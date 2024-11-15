// Components/AddActivityDialog.js
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Box } from '@mui/material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const AddActivityDialog = ({ open, onClose, onCrear }) => {
  const [newActivity, setNewActivity] = useState({
    fecha: null,
    horaInicio: null,
    horaFin: null,
    tipoActividad: '',
    profesor: '',
  });

  const handleChange = (field, value) => {
    setNewActivity((prev) => ({ ...prev, [field]: value }));
  };

  const handleCrearActividad = () => {
    onCrear(newActivity);
    onClose(); // Cierra el diálogo después de añadir la actividad
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle><strong>Añadir Nueva Actividad</strong></DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap="16px">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Fecha de la Actividad"
              value={newActivity.fecha}
              onChange={(newValue) => handleChange('fecha', newValue ? newValue.format('YYYY-MM-DD') : null)}
              renderInput={(params) => <TextField fullWidth {...params} />}
            />
            <TimePicker
              label="Hora de Inicio"
              value={newActivity.horaInicio}
              onChange={(newValue) => handleChange('horaInicio', newValue ? newValue.format('HH:mm') : null)}
              renderInput={(params) => <TextField fullWidth {...params} />}
            />
            <TimePicker
              label="Hora de Fin"
              value={newActivity.horaFin}
              onChange={(newValue) => handleChange('horaFin', newValue ? newValue.format('HH:mm') : null)}
              renderInput={(params) => <TextField fullWidth {...params} />}
            />
          </LocalizationProvider>
          <TextField
            select
            label="Tipo de Actividad"
            fullWidth
            value={newActivity.tipoActividad}
            onChange={(e) => handleChange('tipoActividad', e.target.value)}
          >
            <MenuItem value="Zumba">Zumba</MenuItem>
            <MenuItem value="Yoga">Yoga</MenuItem>
            <MenuItem value="Aerobicos">Aeróbicos</MenuItem>
          </TextField>
          <TextField
            label="Nombre del Profesor"
            fullWidth
            value={newActivity.profesor}
            onChange={(e) => handleChange('profesor', e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancelar</Button>
        <Button onClick={handleCrearActividad} color="primary">Añadir Actividad</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddActivityDialog;
