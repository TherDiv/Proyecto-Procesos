import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, Box, IconButton, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers';
import DeleteIcon from '@mui/icons-material/Delete';
import 'dayjs/locale/es';
import './Horarios.css';

const Horarios = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [activities, setActivities] = useState([
    { date: '16/09/2024', time: '10:00 - 11:00', activity: 'Zumba', instructor: 'Carlos López' },
    { date: '18/09/2024', time: '12:00 - 13:00', activity: 'Yoga', instructor: 'Ana Martínez' },
    { date: '20/09/2024', time: '11:00 - 12:00', activity: 'Aeróbicos', instructor: 'Juan Pérez' },
    { date: '22/09/2024', time: '9:00 - 10:00', activity: 'Yoga', instructor: 'María Álvarez' }
  ]);

  const [weeklySchedule, setWeeklySchedule] = useState([
    { day: 'Lunes', time: '9:00 - 10:00', activity: 'Zumba', instructor: 'Carlos López' },
    { day: 'Jueves', time: '12:00 - 1:00', activity: 'Yoga', instructor: 'Ana Martínez' },
    { day: 'Sábado', time: '2:00 - 3:00', activity: 'Aeróbicos', instructor: 'Juan Pérez' },
    { day: 'Domingo', time: '10:00 - 11:00', activity: 'Yoga', instructor: 'María Álvarez' }
  ]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleDeleteActivity = (index) => {
    const updatedActivities = [...activities];
    updatedActivities.splice(index, 1);
    setActivities(updatedActivities);
  };

  // Definir los intervalos de tiempo
  const timeSlots = [
    '9:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 1:00',
    '1:00 - 2:00',
    '2:00 - 3:00'
  ];

  // Días de la semana
  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  return (
    <div>
      <Typography variant="h4" gutterBottom>Horarios de Actividades</Typography>

      {/* Lista de actividades por profesor */}
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
            {activities.map((activity, index) => (
              <TableRow key={index}>
                <TableCell>{activity.date}</TableCell>
                <TableCell>{activity.time}</TableCell>
                <TableCell>{activity.activity}</TableCell>
                <TableCell>{activity.instructor}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDeleteActivity(index)}>
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
        <Typography variant="h6" mr={2}>Vista Semanal</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <DatePicker
            label="Seleccionar semana"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </LocalizationProvider>
      </Box>

      <Box>
        <Table className="weekly-schedule-table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell> {/* Columna para los intervalos de tiempo */}
              {daysOfWeek.map((day, index) => (
                <TableCell key={index}>{day}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {timeSlots.map((time, index) => (
              <TableRow key={index} className="weekly-schedule-row">
                <TableCell className="time-cell">{time}</TableCell>
                {daysOfWeek.map((day, idx) => (
                  <TableCell key={idx} className="weekly-schedule-cell">
                    {weeklySchedule
                      .filter(item => item.day === day && item.time === time)
                      .map((item, i) => (
                        <Box key={i}>
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
    </div>
  );
};

export default Horarios;
