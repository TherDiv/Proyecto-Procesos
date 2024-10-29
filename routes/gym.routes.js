// gym.routes.js
import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get('/obtener_asistencias', async (req, res) => {
    const { date } = req.query; // Cambiado de req.body a req.query para GET requests

    const fecha = new Date(`${date}T00:00:00Z`);

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
                            where: {
                                fecha: fecha,
                            },
                            select: {
                                hora_entrada: true,
                                hora_salida: true,
                            },
                        },
                    },
                },
            },
        });

        const usuariosConAsistencia = usuarios.map((usuario) => {
            const asistencia = usuario.matriculas[0]?.asistencias[0];
            return {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                id_matricula: usuario.matriculas[0]?.id_matricula || null,
                hora_entrada: asistencia?.hora_entrada
                    ? asistencia.hora_entrada.toISOString().split('T')[1].split('.')[0]
                    : null,
                hora_salida: asistencia?.hora_salida
                    ? asistencia.hora_salida.toISOString().split('T')[1].split('.')[0]
                    : null,
            };
        });

        res.json(usuariosConAsistencia);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
