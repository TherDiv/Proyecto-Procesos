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
import { obtenerActividades, eliminarActividad, obtenerTrabajadores, crearActividad } from '../api/api'; // Importar las funciones del archivo api.js

const Horarios = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Fecha seleccionada para el DatePicker
  const [activities, setActivities] = useState([]); // Actividades cargadas
  const [weeklySchedule, setWeeklySchedule] = useState([]); // Horarios semanales
  const [trabajadores, setTrabajadores] = useState([]); // Trabajadores (solo entrenadores)
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Estado del diálogo de añadir actividad

  // Función para cargar actividades
  const cargarActividades = async () => {
    try {
      const actividades = await obtenerActividades();
      const data = actividades.map((actividad) => ({
        id_actividad: actividad.id_actividad,
        fecha: dayjs(actividad.fecha).format('YYYY-MM-DD'),
        hora_inicio: dayjs(actividad.hora_inicio).format('HH:mm'),
        hora_fin: dayjs(actividad.hora_fin).format('HH:mm'),
        actividad: actividad.nombre_actividad || 'Actividad no disponible',
        profesor: actividad.trabajadores ? `${actividad.trabajadores.nombres} ${actividad.trabajadores.apellidos}` : 'Sin asignar',
        day: dayjs(actividad.fecha).format('dddd'),
      }));
      setActivities(data);
      generarVistaSemanal(data); // Actualiza la vista semanal
    } catch (error) {
      console.error('Error al cargar actividades:', error);
      alert('Ocurrió un error al cargar las actividades. Intenta nuevamente más tarde.');
    }
  };

  // Función para cargar trabajadores (solo entrenadores)
  const cargarTrabajadores = async () => {
    try {
      const trabajadoresData = await obtenerTrabajadores();
      // Corregir para que el id_trabajador sea un número y no una cadena
      setTrabajadores(trabajadoresData.filter((trabajador) => trabajador.cargo === 'entrenador').map((trabajador) => ({
        ...trabajador,
        id_trabajador: Number(trabajador.id_trabajador), // Asegurarse de que el ID sea un número
      })));
    } catch (error) {
      console.error('Error al cargar trabajadores:', error);
      alert('Ocurrió un error al cargar los trabajadores. Intenta nuevamente más tarde.');
    }
  };

  // Función para generar la vista semanal de actividades
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

  // Función para agregar una nueva actividad
  const handleAddActivity = async (newActivity) => {
    try {
      await crearActividad(newActivity);
      cargarActividades(); // Recarga las actividades después de añadir una nueva
    } catch (error) {
      console.error('Error al añadir actividad:', error);
      alert('Ocurrió un error al añadir la actividad. Intenta nuevamente más tarde.');
    }
  };

  const handleDeleteActivity = async (id_actividad) => {
    try {
      // Enviar solicitud DELETE al backend
      const response = await fetch('https://procesos-backend.vercel.app/api/actividades', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_actividad }), // Pasar el id de la actividad como parámetro
      });
  
      // Verificar la respuesta del servidor
      const result = await response.json();
  
      // Solo proceder si la respuesta es exitosa
      if (response.ok) {
        console.log(result.message); // Mensaje de éxito
        cargarActividades(); // Recargar las actividades después de la eliminación
        alert('Actividad eliminada exitosamente.'); // Notificación de éxito
      } 
    } catch (error) {
      // Manejo de errores en caso de fallo en la solicitud
      console.error('Error en la solicitud de eliminación:', error);
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
                  <TableCell>{schedule.instructor}</TableCell>
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
        trabajadores={trabajadores} // Pasamos la lista de trabajadores (entrenadores)
      />
    </div>
  );
};

export default Horarios;
