import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box,
  IconButton,
  Button,
  TextField,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import AddActivityDialog from '../Components/AddActivityDialog';
import dayjs from 'dayjs';
import { obtenerActividades, eliminarActividad, obtenerTrabajadores } from '../api/api'; // Importar las funciones del archivo api.js

const Horarios = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Fecha seleccionada para el DatePicker
  const [activities, setActivities] = useState([]); // Actividades cargadas
  const [weeklySchedule, setWeeklySchedule] = useState([]); // Horarios semanales
  const [trabajadores, setTrabajadores] = useState([]); // Trabajadores (solo entrenadores)
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Estado del diálogo de añadir actividad

  // Cargar actividades desde el backend
  const cargarActividades = async () => {
    try {
      const actividades = await obtenerActividades();
      const data = actividades.map((actividad) => ({
        id_actividad: actividad.id_actividad,
        fecha: dayjs(actividad.fecha).format('YYYY-MM-DD'),
        hora_inicio: dayjs(actividad.hora_inicio).format('HH:mm'),
        hora_fin: dayjs(actividad.hora_fin).format('HH:mm'),
        actividad: actividad.nombre_actividad || 'Actividad no disponible',
        profesor: actividad.trabajadores ? actividad.trabajadores.nombre : 'Sin asignar',
        day: dayjs(actividad.fecha).format('dddd'),
      }));
      setActivities(data);
      generarVistaSemanal(data); // Actualiza la vista semanal
    } catch (error) {
      console.error('Error al cargar actividades:', error);
      alert('Ocurrió un error al cargar las actividades. Intenta nuevamente más tarde.');
    }
  };

  // Cargar trabajadores (solo entrenadores)
  const cargarTrabajadores = async () => {
    try {
      const trabajadoresData = await obtenerTrabajadores();
      setTrabajadores(trabajadoresData);
    } catch (error) {
      console.error('Error al cargar trabajadores:', error);
      alert('Ocurrió un error al cargar los trabajadores. Intenta nuevamente más tarde.');
    }
  };

  // Generar la vista semanal
  const generarVistaSemanal = (actividades) => {
    const startOfWeek = selectedDate.startOf('week').isoWeekday(1); // Empieza el lunes
    const endOfWeek = selectedDate.endOf('week').isoWeekday(7); // Termina el domingo

    const horariosSemanal = actividades.filter((actividad) => {
      const actividadFecha = dayjs(actividad.fecha);
      return actividadFecha.isBetween(startOfWeek, endOfWeek, null, '[]'); // Filtrar por semana
    }).map((actividad) => ({
      day: dayjs(actividad.fecha).format('dddd'),
      time: `${actividad.hora_inicio} - ${actividad.hora_fin}`,
      activity: actividad.actividad,
      instructor: actividad.profesor,
    }));

    setWeeklySchedule(horariosSemanal);
  };

  // useEffect para cargar datos al montar el componente
  useEffect(() => {
    cargarActividades(); // Cargar actividades al montar el componente o cambiar la fecha seleccionada
    cargarTrabajadores(); // Cargar trabajadores (solo entrenadores)
  }, [selectedDate]); // Vuelve a cargar las actividades si cambia la fecha seleccionada

  // Agregar una nueva actividad
  const handleAddActivity = async (newActivity) => {
    try {
      // Llama la función de API para crear la actividad (no implementada en este ejemplo, solo llamada)
      // await crearActividad(newActivity);
      cargarActividades(); // Vuelve a cargar las actividades después de añadir una nueva
    } catch (error) {
      console.error('Error al añadir actividad:', error);
      alert('Ocurrió un error al añadir la actividad. Intenta nuevamente más tarde.');
    }
  };

  // Eliminar una actividad
  const handleDeleteActivity = async (id_actividad) => {
    try {
      await eliminarActividad(id_actividad);
      cargarActividades(); // Recarga las actividades después de eliminar una
    } catch (error) {
      console.error('Error al eliminar actividad:', error);
      alert('Ocurrió un error al eliminar la actividad. Intenta nuevamente más tarde.');
    }
  };

  // Array con los días de la semana
  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  return (
    <div>
      <h1>Horarios de Actividades</h1>

      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
        <Typography variant="h6" sx={{ marginRight: 2 }}>Lista de Actividades</Typography>
        
        {/* Botón para añadir actividad */}
        <Button variant="contained" color="primary" onClick={() => setIsDialogOpen(true)}>
          Añadir Actividad
        </Button>
      </Box>

      {/* Lista de actividades */}
      <Box mb={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Hora</TableCell>
              <TableCell>Actividad</TableCell>
              <TableCell>Profesor</TableCell>
              <TableCell>Eliminar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activities.length > 0 ? (
              activities.map((activity) => (
                <TableRow key={activity.id_actividad}>
                  <TableCell>{activity.fecha || 'Fecha no disponible'}</TableCell>
                  <TableCell>{`${activity.hora_inicio} - ${activity.hora_fin}`}</TableCell>
                  <TableCell>{activity.actividad}</TableCell>
                  <TableCell>{activity.profesor}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDeleteActivity(activity.id_actividad)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No se encontraron actividades.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

      {/* Vista Semanal */}
      <Box display="flex" alignItems="center" mb={3}>
        <Typography variant="h6" sx={{ marginRight: 2 }}>Vista Semanal</Typography>
        
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Seleccionar semana"
            value={selectedDate} // Asegura que siempre sea un día
            onChange={(newDate) => setSelectedDate(newDate)}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </Box>

      {/* Mostrar los horarios semanales */}
      <Box>
        {weeklySchedule.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Día</TableCell>
                <TableCell>Hora</TableCell>
                <TableCell>Actividad</TableCell>
                <TableCell>Instructor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {weeklySchedule.map((schedule, index) => (
                <TableRow key={index}>
                  <TableCell>{schedule.day}</TableCell>
                  <TableCell>{schedule.time}</TableCell>
                  <TableCell>{schedule.activity}</TableCell>
                  <TableCell>{schedule.instructor || 'Sin asignar'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography>No hay actividades para esta semana.</Typography>
        )}
      </Box>

      {/* Diálogo para agregar actividad */}
      <AddActivityDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAddActivity={handleAddActivity}
        trabajadores={trabajadores}
      />
    </div>
  );
};

export default Horarios;
