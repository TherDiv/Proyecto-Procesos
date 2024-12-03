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
  const [trabajadores, setTrabajadores] = useState([]); // Trabajadores (solo entrenadores)
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Estado del diálogo de añadir actividad

  // Función para formatear horarios
  const formatearHora = (hora) => {
    return dayjs(hora).format('HH:mm');
  };

  // Función para cargar actividades
  const cargarActividades = async () => {
    try {
      const actividades = await obtenerActividades();
      const data = actividades.map((actividad) => ({
        id_actividad: actividad.id_actividad,
        fecha: dayjs(actividad.horarios[0].fecha).format('YYYY-MM-DD'),
        hora_inicio: formatearHora(actividad.horarios[0].hora_inicio),
        hora_fin: formatearHora(actividad.horarios[0].hora_fin),
        actividad: actividad.nombre_actividad || 'Actividad no disponible',
        profesor: actividad.horarios[0].trabajadores
          ? `${actividad.horarios[0].trabajadores.nombres} ${actividad.horarios[0].trabajadores.apellidos}`
          : 'Sin asignar',
      }));
      setActivities(data);
    } catch (error) {
      console.error('Error al cargar actividades:', error);
      alert('Ocurrió un error al cargar las actividades. Intenta nuevamente más tarde.');
    }
  };

  // Función para cargar trabajadores (solo entrenadores)
  const cargarTrabajadores = async () => {
    try {
      const trabajadoresData = await obtenerTrabajadores();
      setTrabajadores(
        trabajadoresData
          .filter((trabajador) => trabajador.cargo === 'entrenador')
          .map((trabajador) => ({
            ...trabajador,
            id_trabajador: Number(trabajador.id_trabajador), // Asegurarse de que el ID sea un número
          }))
      );
    } catch (error) {
      console.error('Error al cargar trabajadores:', error);
      alert('Ocurrió un error al cargar los trabajadores. Intenta nuevamente más tarde.');
    }
  };

  // useEffect para cargar datos al montar el componente
  useEffect(() => {
    cargarActividades(); // Cargar actividades al montar el componente o cambiar la fecha seleccionada
    cargarTrabajadores(); // Cargar trabajadores (solo entrenadores)
  }, [selectedDate]); // Vuelve a cargar las actividades si cambia la fecha seleccionada

  // Función para agregar una nueva actividad
  const handleAddActivity = async (newActivity) => {
    try {
      const data = {
        id_gimnasio: 1, // Ajusta al ID de tu gimnasio
        nombre_actividad: newActivity.nombre_actividad,
        descripcion: newActivity.descripcion,
        horarios: newActivity.horarios.map((horario) => ({
          fecha: dayjs(horario.fecha).format('YYYY-MM-DD'), // Formato de fecha para la API
          hora_inicio: dayjs(horario.hora_inicio).format('YYYY-MM-DDTHH:mm:ssZ'), // Formato de hora para la API
          hora_fin: dayjs(horario.hora_fin).format('YYYY-MM-DDTHH:mm:ssZ'), // Formato de hora para la API
          id_trabajador: horario.id_trabajador,
        })),
      };

      console.log('Enviando actividad:', data); // Verifica los datos que se están enviando

      const response = await fetch('https://procesos-backend.vercel.app/api/actividades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        console.log(result.message); // Mensaje de éxito
        // Actualizar directamente el estado de actividades sin recargar
        setActivities((prevActivities) => [
          ...prevActivities,
          {
            id_actividad: result.actividad.id_actividad, // Asegúrate de que el objeto respuesta tiene estos valores
            fecha: dayjs(result.actividad.horarios[0].fecha).format('YYYY-MM-DD'),
            hora_inicio: formatearHora(result.actividad.horarios[0].hora_inicio),
            hora_fin: formatearHora(result.actividad.horarios[0].hora_fin),
            actividad: result.actividad.nombre_actividad || 'Actividad no disponible',
            profesor: result.actividad.horarios[0].trabajadores
              ? `${result.actividad.horarios[0].trabajadores.nombres} ${result.actividad.horarios[0].trabajadores.apellidos}`
              : 'Sin asignar',
          },
        ]);
        alert('Actividad añadida exitosamente.');
      } else {
        console.error(result.message);
        alert('Ocurrió un error al añadir la actividad. Intenta nuevamente más tarde.');
      }
    } catch (error) {
      console.error('Error al añadir actividad:', error);
      alert('Ocurrió un error al añadir la actividad. Intenta nuevamente más tarde.');
    }
  };

  const handleDeleteActivity = async (id_actividad) => {
    try {
      const response = await fetch('https://procesos-backend.vercel.app/api/actividades', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_actividad }), // Pasar el id de la actividad como parámetro
      });

      const result = await response.json();

      if (response.ok) {
        console.log(result.message); // Mensaje de éxito
        setActivities((prevActivities) =>
          prevActivities.filter((activity) => activity.id_actividad !== id_actividad) // Filtrar la actividad eliminada
        );
      }
    } catch (error) {
      console.error('Error en la solicitud de eliminación:', error);
      alert('Ocurrió un error al eliminar la actividad. Intenta nuevamente más tarde.');
    }
  };

  return (
    <div>
      <h1>Horarios de Actividades</h1>

      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
        <Typography variant="h6" sx={{ marginRight: 2 }}>
          Lista de Actividades
        </Typography>

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
                  No hay actividades disponibles.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

      {/* Diálogo de agregar actividad */}
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
