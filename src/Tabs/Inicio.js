import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Box } from '@mui/material';
import { obtenerAsistencias } from '../api/api'; // Función para obtener las asistencias
import { obtenerActividades } from '../api/api'; // Función para obtener las actividades
import dayjs from 'dayjs';

const Inicio = () => {
  const [asistenciasHoy, setAsistenciasHoy] = useState([]);
  const [actividadesSemana, setActividadesSemana] = useState([]);

  // Cargar asistencias de hoy
  const cargarAsistenciasHoy = async () => {
    const hoy = dayjs().format('DD-MM-YYYY'); // Fecha de hoy
    try {
      const asistencias = await obtenerAsistencias(hoy);  // Obtener asistencias de hoy
      setAsistenciasHoy(asistencias || []);  // Actualizar el estado de asistencias
    } catch (error) {
      console.error("Error al cargar las asistencias de hoy", error);
    }
  };

  // Cargar actividades de la semana
  const cargarActividadesSemana = async () => {
    try {
      const actividades = await obtenerActividades();  // Obtener actividades
      const hoy = dayjs();
      const primerDiaSemana = hoy.startOf('week');  // Primer día de la semana (lunes)
      const ultimoDiaSemana = hoy.endOf('week');  // Último día de la semana (domingo)

      // Filtramos las actividades de la semana
      const actividadesFiltradas = actividades.filter(actividad => {
        const fechaActividad = dayjs(actividad.fecha);
        return fechaActividad.isBetween(primerDiaSemana, ultimoDiaSemana, 'day', '[]');
      });

      setActividadesSemana(actividadesFiltradas || []);  // Actualizar estado de actividades
    } catch (error) {
      console.error("Error al cargar las actividades de la semana", error);
    }
  };

  // Cargar ambos datos cuando el componente se monta
  useEffect(() => {
    cargarAsistenciasHoy();
    cargarActividadesSemana();
  }, []);  // Solo se ejecuta al montar el componente

  return (
    <div>
      <h1>Vista General</h1>

      {/* Tabla de Asistencias de Hoy */}
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
            {asistenciasHoy.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>No hay asistencias registradas para hoy.</TableCell>
              </TableRow>
            ) : (
              asistenciasHoy.map((asistencia, index) => (
                <TableRow key={index}>
                  <TableCell>{asistencia.nombre}</TableCell>
                  <TableCell>{asistencia.hora_entrada}</TableCell>
                  <TableCell>{asistencia.hora_salida || '-'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Box>

      {/* Tabla de Actividades de la Semana */}
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
            {actividadesSemana.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>No hay actividades programadas para esta semana.</TableCell>
              </TableRow>
            ) : (
              actividadesSemana.map((actividad, index) => (
                <TableRow key={index}>
                  <TableCell>{actividad.nombre}</TableCell>
                  <TableCell>{dayjs(actividad.fecha).format('DD-MM-YYYY')}</TableCell>
                  <TableCell>{actividad.hora}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Box>
    </div>
  );
};

export default Inicio;
