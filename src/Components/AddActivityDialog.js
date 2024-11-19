import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Box } from '@mui/material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const AddActivityDialog = ({ open, onClose, onCrear }) => {
  const [newActivity, setNewActivity] = useState({
    nombre_actividad: '',
    descripcion: '',
    fecha: dayjs(), // Inicializar con un objeto válido de Dayjs
    horaInicio: dayjs(), // Hora inicial predeterminada
    horaFin: dayjs().add(1, 'hour'), // Hora final predeterminada
    profesor: '',
  });

  const handleChange = (field, value) => {
    setNewActivity((prev) => ({ ...prev, [field]: value }));
  };

  const handleCrearActividad = () => {
    if (
      newActivity.nombre_actividad &&
      newActivity.fecha &&
      newActivity.horaInicio &&
      newActivity.horaFin &&
      newActivity.profesor
    ) {
      const payload = {
        nombre_actividad: newActivity.nombre_actividad,
        descripcion: newActivity.descripcion,
        fecha: newActivity.fecha.format('YYYY-MM-DD'), // Formato esperado por el backend
        hora_inicio: newActivity.horaInicio.format('HH:mm'),
        hora_fin: newActivity.horaFin.format('HH:mm'),
        profesor: newActivity.profesor,
      };

      onCrear(payload);
      onClose();
    } else {
      alert('Por favor, completa todos los campos');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Añadir Nueva Actividad</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap="16px">
          <TextField
            label="Nombre de la Actividad"
            fullWidth
            value={newActivity.nombre_actividad}
            onChange={(e) => handleChange('nombre_actividad', e.target.value)}
          />
          <TextField
            label="Descripción"
            fullWidth
            value={newActivity.descripcion}
            onChange={(e) => handleChange('descripcion', e.target.value)}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Fecha de la Actividad"
              value={newActivity.fecha}
              onChange={(newValue) => handleChange('fecha', newValue)}
              renderInput={(params) => <TextField fullWidth {...params} />}
            />
            <TimePicker
              label="Hora de Inicio"
              value={newActivity.horaInicio}
              onChange={(newValue) => handleChange('horaInicio', newValue)}
              renderInput={(params) => <TextField fullWidth {...params} />}
            />
            <TimePicker
              label="Hora de Fin"
              value={newActivity.horaFin}
              onChange={(newValue) => handleChange('horaFin', newValue)}
              renderInput={(params) => <TextField fullWidth {...params} />}
            />
          </LocalizationProvider>
          <TextField
            label="Profesor"
            fullWidth
            value={newActivity.profesor}
            onChange={(e) => handleChange('profesor', e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleCrearActividad} color="primary">
          Añadir Actividad
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddActivityDialog;
