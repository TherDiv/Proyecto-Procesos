import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Box } from '@mui/material';
import { obtenerAsistencias, obtenerActividades } from '../api/api'; // Usamos obtenerActividades
import dayjs from 'dayjs';

const Inicio = () => {
  const [asistenciasHoy, setAsistenciasHoy] = useState([]);
  const [actividadesSemana, setActividadesSemana] = useState([]);

  // Cargar asistencias de hoy
  const cargarAsistenciasHoy = async () => {
    const hoy = dayjs().format('DD-MM-YYYY'); // Fecha de hoy
    try {
      const asistencias = await obtenerAsistencias(hoy);
      setAsistenciasHoy(asistencias || []);
    } catch (error) {
      console.error("Error al cargar las asistencias de hoy", error);
    }
  };

  // Cargar actividades de la semana
  const cargarActividadesSemana = async () => {
    try {
      const actividades = await obtenerActividades();  // Usamos obtenerActividades
      const hoy = dayjs();
      const primerDiaSemana = hoy.startOf('week');  // Primer día de la semana (lunes)
      const ultimoDiaSemana = hoy.endOf('week');  // Último día de la semana (domingo)

      // Filtramos las actividades de la semana
      const actividadesFiltradas = actividades.filter(actividad => {
        const fechaActividad = dayjs(actividad.fecha);
        return fechaActividad.isBetween(primerDiaSemana, ultimoDiaSemana, 'day', '[]');
      });

      setActividadesSemana(actividadesFiltradas || []);
    } catch (error) {
      console.error("Error al cargar las actividades de la semana", error);
    }
  };

  // Cargar ambos datos cuando el componente se monta
  useEffect(() => {
    cargarAsistenciasHoy();
    cargarActividadesSemana();
  }, []);

  return (
    <div>
      <h1>Vista General</h1>

      <Box marginBottom={4}>
        <h3>Asistencias de Hoy</h3>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Hora Entrada</TableCell>
              <TableCell>Hora Salida</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {asistenciasHoy.map((asistencia, index) => (
              <TableRow key={index}>
                <TableCell>{asistencia.nombre}</TableCell>
                <TableCell>{asistencia.hora_entrada}</TableCell>
                <TableCell>{asistencia.hora_salida || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Box>
        <h3>Actividades de la Semana</h3>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Actividad</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Hora</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {actividadesSemana.map((actividad, index) => (
              <TableRow key={index}>
                <TableCell>{actividad.nombre}</TableCell>
                <TableCell>{dayjs(actividad.fecha).format('DD-MM-YYYY')}</TableCell>
                <TableCell>{actividad.hora}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </div>
  );
};

export default Inicio;
