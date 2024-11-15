import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get('/obtener_asistencias', async (req, res) => {
  const { date } = req.query; // Usamos `req.query` para GET
  
  try {
    const fecha = new Date(`${date}T00:00:00Z`);
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
              select: {
                hora_entrada: true,
                hora_salida: true,
              },
            },
          },
        },
      },
    });

    const usuariosConAsistencia = usuarios.map(usuario => {
      const asistencia = usuario.matriculas[0]?.asistencias[0];
      return {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        id_matricula: usuario.matriculas[0]?.id_matricula || null,
        hora_entrada: asistencia?.hora_entrada ? asistencia.hora_entrada.toISOString().split('T')[1].split('.')[0] : null,
        hora_salida: asistencia?.hora_salida ? asistencia.hora_salida.toISOString().split('T')[1].split('.')[0] : null
      };
    });

    res.json(usuariosConAsistencia);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.post('/marcar_asistencia', async (req, res) => {
  const { id_matricula, date, time } = req.body;

  try {
    const fecha = new Date(`${date}T00:00:00Z`);
    const hora = new Date(fecha);
    const [hours, minutes] = time.split(':');
    hora.setUTCHours(hours, minutes);

    const asistenciaExistente = await prisma.asistencias.findFirst({
      where: { fecha, matriculas: { id_matricula } },
    });

    if (!asistenciaExistente) {
      const nuevaAsistencia = await prisma.asistencias.create({
        data: {
          fecha,
          hora_entrada: hora,
          estado_asistencia: 'presente',
          matriculas: { connect: { id_matricula } },
        },
      });
      res.json({ message: 'Asistencia registrada con hora de entrada', asistencia: nuevaAsistencia });
    } else if (!asistenciaExistente.hora_salida) {
      const asistenciaActualizada = await prisma.asistencias.update({
        where: { id_asistencia: asistenciaExistente.id_asistencia },
        data: { hora_salida: hora, estado_asistencia: 'presente' },
      });
      res.json({ message: 'Asistencia registrada con hora de salida', asistencia: asistenciaActualizada });
    } else {
      res.status(400).json({ message: 'La asistencia ya está completa para esta fecha' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default router;
