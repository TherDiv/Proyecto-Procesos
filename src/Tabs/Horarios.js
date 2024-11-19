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
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import AddActivityDialog from '../Components/AddActivityDialog';
import dayjs from 'dayjs';
import axios from 'axios';

const BASE_URL = 'https://procesos-backend.vercel.app/api';

const Horarios = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [activities, setActivities] = useState([]);
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Cargar actividades desde el backend
  const cargarActividades = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/actividades`);
      const data = response.data.actividades.map((actividad) => ({
        id_actividad: actividad.id_actividad,
        fecha: dayjs(actividad.fecha).format('YYYY-MM-DD'), // Formatear fecha
        hora_inicio: actividad.hora_inicio, // Horas ya están en formato HH:mm
        hora_fin: actividad.hora_fin,
        actividad: actividad.actividad,
        profesor: actividad.profesor,
        day: dayjs(actividad.fecha).format('dddd'), // Día de la semana
      }));
      setActivities(data);
      generarVistaSemanal(data);
    } catch (error) {
      console.error('Error al cargar actividades:', error);
    }
  };

  // Generar la vista semanal a partir de las actividades
  const generarVistaSemanal = (actividades) => {
    const horariosSemanal = actividades.map((actividad) => ({
      day: dayjs(actividad.fecha).format('dddd'),
      time: `${actividad.hora_inicio} - ${actividad.hora_fin}`,
      activity: actividad.actividad,
      instructor: actividad.profesor,
    }));
    setWeeklySchedule(horariosSemanal);
  };

  useEffect(() => {
    cargarActividades();
  }, []);

  // Añadir nueva actividad
  const handleAddActivity = async (newActivity) => {
    try {
      const response = await axios.post(`${BASE_URL}/actividades`, newActivity);
      console.log('Actividad añadida:', response.data);
      cargarActividades(); // Refrescar actividades después de añadir
    } catch (error) {
      console.error('Error al añadir actividad:', error);
    }
  };

  // Eliminar actividad
  const handleDeleteActivity = async (id_actividad) => {
    try {
      await axios.delete(`${BASE_URL}/actividades`, {
        data: { id_actividad },
      });
      cargarActividades(); // Refrescar actividades después de eliminar
    } catch (error) {
      console.error('Error al eliminar actividad:', error);
    }
  };

  // Manejo del cambio de fecha seleccionada
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Días de la semana
  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  // Definir los intervalos de tiempo
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
      <Typography variant="h4" gutterBottom>
        Horarios de Actividades
      </Typography>

      {/* Botón para añadir actividad */}
      <Box display="flex" justifyContent="flex-end" marginBottom={2}>
        <Button variant="contained" color="primary" onClick={() => setIsDialogOpen(true)}>
          Añadir Actividad
        </Button>
      </Box>

      {/* Lista de actividades */}
      <Box mb={3}>
        <Typography variant="h6">Lista de actividades por profesor</Typography>
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
        <Typography variant="h6" mr={2}>
          Vista Semanal
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Seleccionar semana"
            value={selectedDate} // Debe ser un objeto válido de Dayjs
            onChange={(newValue) => setSelectedDate(newValue || dayjs())} // Asegura un valor por defecto
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
      />
    </div>
  );
};

export default Horarios;
