import React, { useState, useEffect, useCallback } from 'react';
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
import axios from 'axios';

const BASE_URL = 'https://procesos-backend.vercel.app/api';

const Horarios = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Fecha seleccionada para el DatePicker
  const [activities, setActivities] = useState([]);
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);  // Aquí está la declaración del estado
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Cargar actividades desde el backend con useCallback para evitar que cambie en cada renderizado
  const cargarActividades = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/actividades`);
      console.log('Respuesta de actividades:', response.data);

      // Asegurándonos de que la respuesta tiene el formato esperado
      if (response.data.actividades) {
        const data = response.data.actividades.map((actividad) => ({
          id_actividad: actividad.id_actividad,
          fecha: dayjs(actividad.fecha).format('YYYY-MM-DD'),
          hora_inicio: actividad.hora_inicio,
          hora_fin: actividad.hora_fin,
          actividad: actividad.actividad,
          profesor: actividad.profesor,
          day: dayjs(actividad.fecha).format('dddd'),
        }));
        setActivities(data);
        generarVistaSemanal(data);
      } else {
        console.error('No se encontraron actividades en la respuesta');
      }
    } catch (error) {
      console.error('Error al cargar actividades:', error);
    }
  }, []);

  // Cargar trabajadores desde el backend
  const cargarTrabajadores = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/trabajadores`);
      const trabajadoresData = response.data;
      const entrenadores = trabajadoresData.filter((trabajador) => trabajador.cargo === 'entrenador');
      setTrabajadores(entrenadores);  // Almacenar solo entrenadores en el estado
    } catch (error) {
      console.error('Error al cargar trabajadores:', error);
    }
  };

  // Generar la vista semanal
  const generarVistaSemanal = (actividades) => {
    const horariosSemanal = actividades.map((actividad) => ({
      day: dayjs(actividad.fecha).format('dddd'),
      time: `${actividad.hora_inicio} - ${actividad.hora_fin}`,
      activity: actividad.actividad,
      instructor: actividad.profesor,
    }));
    setWeeklySchedule(horariosSemanal);
  };

  // useEffect que depende de cargarActividades
  useEffect(() => {
    cargarActividades();  // Solo se ejecuta cuando el componente se monta
    cargarTrabajadores();  // Cargar los trabajadores
  }, [cargarActividades]);

  // Agregar una nueva actividad
  const handleAddActivity = async (newActivity) => {
    try {
      const response = await axios.post(`${BASE_URL}/actividades`, newActivity);
      console.log('Actividad añadida:', response.data);
      cargarActividades(); // Vuelve a cargar las actividades después de añadir una nueva
    } catch (error) {
      console.error('Error al añadir actividad:', error);
    }
  };

  // Eliminar una actividad
  const handleDeleteActivity = async (id_actividad) => {
    try {
      await axios.delete(`${BASE_URL}/actividades`, {
        data: { id_actividad },
      });
      cargarActividades();  // Recarga las actividades después de eliminar una
    } catch (error) {
      console.error('Error al eliminar actividad:', error);
    }
  };

  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  const timeSlots = [
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 13:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
  ];

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
          {activities.map((activity) => (
            <TableRow key={activity.id_actividad}>
              <TableCell>{activity.fecha}</TableCell>
              <TableCell>{`${activity.hora_inicio} - ${activity.hora_fin}`}</TableCell>
              <TableCell>{activity.actividad}</TableCell>
              <TableCell>{activity.profesor}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleDeleteActivity(activity.id_actividad)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>

      {/* Vista Semanal */}
      <Box display="flex" alignItems="center" mb={3}>
        <Typography variant="h6" sx={{ marginRight: 2 }}>Vista Semanal</Typography>
        
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Seleccionar semana"
            value={selectedDate} // Asegura que siempre sea un objeto válido de Dayjs
            onChange={(newValue) => setSelectedDate(newValue || dayjs())} // Asegura un valor por defecto
            renderInput={(params) => <TextField {...params} sx={{ marginLeft: 1 }} />} // Agregar margen pequeño al input
          />
        </LocalizationProvider>
      </Box>

      <Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell> {/* Columna para los intervalos de tiempo */}
              {daysOfWeek.map((day, index) => (
                <TableCell key={index}>{day}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {timeSlots.map((time) => (
              <TableRow key={time}>
                <TableCell>{time}</TableCell>
                {daysOfWeek.map((day) => (
                  <TableCell key={day}>
                    {weeklySchedule
                      .filter((item) => item.day === day && item.time === time)
                      .map((item, index) => (
                        <Box key={index}>
                          <Typography variant="subtitle2">{item.activity}</Typography>
                          <Typography variant="body2">({item.instructor})</Typography>
                        </Box>
                      ))}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* Diálogo para añadir actividad */}
      <AddActivityDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCrear={handleAddActivity}
        trabajadores={trabajadores}  // Aquí pasas los trabajadores filtrados
      />
    </div>
  );
};

export default Horarios;
