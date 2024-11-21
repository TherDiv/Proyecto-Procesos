import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axios from 'axios';

const AddActivityDialog = ({ open, onClose, onCrear }) => {
  const [newActivity, setNewActivity] = useState({
    nombre_actividad: '',
    descripcion: '',
    fecha: dayjs(), 
    horaInicio: dayjs(), 
    horaFin: dayjs().add(1, 'hour'), 
    profesor: '',
  });

  const handleChange = (field, value) => {
    setNewActivity((prev) => ({ ...prev, [field]: value }));
  };

  const handleCrearActividad = async () => {
    if (
      newActivity.nombre_actividad &&
      newActivity.fecha &&
      newActivity.horaInicio &&
      newActivity.horaFin &&
      newActivity.profesor
    ) {
      // Crear la estructura de datos esperada por el backend
      const payload = {
        id_gimnasio: 1, // ID del gimnasio (puedes modificarlo si es necesario)
        nombre_actividad: newActivity.nombre_actividad,
        descripcion: newActivity.descripcion,
        horarios: [
          {
            fecha: newActivity.fecha.toISOString(), // Convertir la fecha a formato ISO
            hora_inicio: newActivity.horaInicio.toISOString(), // Convertir la hora de inicio a formato ISO
            hora_fin: newActivity.horaFin.toISOString(), // Convertir la hora de fin a formato ISO
            id_trabajador: 5 // ID del trabajador (profesor) que puede ser dinámico
          }
        ]
      };

      // Verificar el contenido del payload (opcional, para depuración)
      console.log(payload);

      try {
        // Enviar el payload al backend
        const response = await axios.post('https://procesos-backend.vercel.app/api/actividades', payload);
        console.log('Actividad creada:', response.data);
        
        // Llamar a onCrear para actualizar el estado en el componente padre
        onCrear(response.data);

        // Cerrar el diálogo
        onClose();
      } catch (error) {
        console.error('Error al crear actividad:', error);
        alert('Hubo un error al crear la actividad');
      }
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
