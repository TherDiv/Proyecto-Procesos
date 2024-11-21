import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.post('/api/obtener_asistencias', async (req, res) => {
  const { date } = req.body; // Ahora obtenemos el parámetro desde el body en lugar de query
  if (!date) {
      return res.status(400).json({ message: 'El parámetro date es obligatorio' });
  }

  // Convertir la fecha de DD-MM-YYYY a un formato de fecha utilizable
  const [day, month, year] = date.split('-');
  const fecha = new Date(`${year}-${month}-${day}T00:00:00Z`);

  try {
      const usuarios = await prisma.usuario.findMany({
          select: {
              id_usuario: true,
              nombre: true,
              apellido: true,
              email: true,
              matriculas: {
                  select: {
                      id_matricula: true,
                      asistencias: {
                          where: { fecha },
                          select: { hora_entrada: true, hora_salida: true },
                      },
                  },
              },
          },
      });

      // Procesar resultados
      const usuariosConAsistencia = usuarios.map(usuario => {
          const asistencia = usuario.matriculas[0]?.asistencias[0];
          return {
              id_usuario: usuario.id_usuario,
              nombre: usuario.nombre,
              apellido: usuario.apellido,
              email: usuario.email,
              id_matricula: usuario.matriculas[0]?.id_matricula || null,
              hora_entrada: asistencia?.hora_entrada ? asistencia.hora_entrada.toISOString().split('T')[1].split('.')[0] : null,
              hora_salida: asistencia?.hora_salida ? asistencia.hora_salida.toISOString().split('T')[1].split('.')[0] : null,
          };
      });

      res.json(usuariosConAsistencia);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint para marcar asistencia (entrada o salida)
app.post('/api/marcar_asistencia', async (req, res) => {
    const { id_matricula, date, time } = req.body;

    if (!id_matricula || !date || !time) {
        return res.status(400).json({ message: 'Todos los parámetros (id_matricula, date, time) son obligatorios' });
    }

    try {
        const matriculaId = parseInt(id_matricula, 10);
        const fecha = dayjs(date, 'DD-MM-YYYY').startOf('day').toDate();
        const [hours, minutes] = time.split(':').map(Number);
        const horaEvento = dayjs(fecha).hour(hours).minute(minutes).second(0).toDate();

        if (isNaN(matriculaId)) {
            return res.status(400).json({ message: 'El id_matricula debe ser un número válido' });
        }

        const asistenciaExistente = await prisma.asistencias.findFirst({
            where: { matriculas: { id_matricula: matriculaId }, fecha },
        });

        if (!asistenciaExistente) {
            const nuevaAsistencia = await prisma.asistencias.create({
                data: {
                    fecha,
                    hora_entrada: horaEvento,
                    estado_asistencia: 'presente',
                    matriculas: { connect: { id_matricula: matriculaId } },
                },
            });
            return res.json({ message: 'Asistencia registrada con hora de entrada', asistencia: nuevaAsistencia });
        }

        if (!asistenciaExistente.hora_salida) {
            const asistenciaActualizada = await prisma.asistencias.update({
                where: { id_asistencia: asistenciaExistente.id_asistencia },
                data: { hora_salida: horaEvento },
            });
            return res.json({ message: 'Asistencia registrada con hora de salida', asistencia: asistenciaActualizada });
        }

        res.status(400).json({ message: 'La asistencia para esta fecha ya está completa' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Endpoint para obtener todos los usuarios
app.get('/api/obtener_usuario', async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany({
            include: { matriculas: { include: { membresias: true } } },
        });

        const tipoMembresiaMap = {
            1: 'mensual',
            2: 'trimestral',
            3: 'semestral',
            4: 'anual',
        };

        const resultado = usuarios.map((usuario) => {
            const estado_membresia = usuario.matriculas.length > 0 ? usuario.matriculas[0].estado_matricula : null;
            const membresia = usuario.matriculas.length > 0 ? usuario.matriculas[0].membresias : null;

            return {
                dni: usuario.dni,
                nombres: usuario.nombre,
                apellidos: usuario.apellido,
                estado_membresia,
                inicio_membresia: membresia ? dayjs(membresia.fecha_inicio).format('YYYY-MM-DD') : null,
                fin_membresia: membresia ? dayjs(membresia.fecha_vencimiento).format('YYYY-MM-DD') : null,
                tipo_membresia: membresia ? tipoMembresiaMap[membresia.id_tipo_membresia] : null,
            };
        });

        res.json(resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Endpoint para crear un usuario
app.post('/api/crear_usuario', async (req, res) => {
    const {
        dni, apellido, nombre, email, telefono,
        direccion, fecha_registro, inicio_membresia,
        fin_membresia, tipo_membresia,
    } = req.body;

    const tipoMembresiaMap = {
        mensual: 1,
        trimestral: 2,
        semestral: 3,
        anual: 4,
    };
    const id_tipo_membresia = tipoMembresiaMap[tipo_membresia];

    if (!id_tipo_membresia) {
        return res.status(400).json({ message: 'Tipo de membresía no válido' });
    }

    try {
        const nuevoUsuario = await prisma.usuario.create({
            data: { dni, apellido, nombre, email, telefono, direccion, fecha_registro: dayjs(fecha_registro).toDate() },
        });

        const nuevaMembresia = await prisma.membresias.create({
            data: {
                id_usuario: nuevoUsuario.id_usuario,
                id_tipo_membresia,
                id_gimnasio: 1,
                fecha_inicio: dayjs(inicio_membresia).toDate(),
                fecha_vencimiento: dayjs(fin_membresia).toDate(),
            },
        });

        await prisma.matriculas.create({
            data: {
                id_usuario: nuevoUsuario.id_usuario,
                id_membresia: nuevaMembresia.id_membresia,
                id_gimnasio: 1,
                fecha_matricula: dayjs(inicio_membresia).toDate(),
                estado_matricula: 'activa',
            },
        });

        res.status(201).json({ message: 'Usuario creado exitosamente', id_usuario: nuevoUsuario.id_usuario });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Ruta de prueba
app.get('/', (req, res) => {
    res.send("API del Gym funcionando correctamente");
});

// Iniciar el servidor en un puerto específico
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
