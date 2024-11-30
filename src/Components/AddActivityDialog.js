import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, CircularProgress } from '@mui/material';
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
    nombre_entrenador: '',  // Cambiado a nombre_entrenador
  });

  const [trabajadores, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener la lista de trabajadores
  useEffect(() => {
    const fetchTrabajadores = async () => {
      setLoading(true);
      console.log('Fetching trabajadores...');
      try {
        const response = await axios.get('https://procesos-backend.vercel.app/api/trabajadores');
        // Filtrar solo los entrenadores
        const entrenadores = response.data.filter(trabajador => trabajador.cargo === 'entrenador');
        console.log('Trabajadores obtenidos:', entrenadores);
        setTrabajadores(entrenadores);
      } catch (error) {
        setError('Error al obtener los trabajadores');
        console.error('Error al obtener trabajadores:', error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchTrabajadores();
    }
  }, [open]);

  const handleChange = (field, value) => {
    console.log(`Change detected for ${field}:`, value);
    setNewActivity((prev) => ({ ...prev, [field]: value }));
  };

  const handleCrearActividad = async () => {
    if (
      newActivity.nombre_actividad &&
      newActivity.fecha &&
      newActivity.horaInicio &&
      newActivity.horaFin &&
      newActivity.nombre_entrenador
    ) {
      // Validación de hora de fin
      if (newActivity.horaFin.isBefore(newActivity.horaInicio)) {
        alert('La hora de fin debe ser posterior a la hora de inicio.');
        return;
      }

      const payload = {
        id_gimnasio: 1,
        nombre_actividad: newActivity.nombre_actividad,
        descripcion: newActivity.descripcion,
        horarios: [
          {
            fecha: newActivity.fecha.toISOString(),
            hora_inicio: newActivity.horaInicio.toISOString(),
            hora_fin: newActivity.horaFin.toISOString(),
            nombre_entrenador: newActivity.nombre_entrenador,  // Enviar nombre_entrenador
          },
        ],
      };

      try {
        const response = await axios.post('https://procesos-backend.vercel.app/api/actividades', payload);
        console.log('Actividad creada:', response.data);
        onCrear(response.data);
        onClose();
      } catch (error) {
        console.error('Error al crear actividad:', error);
        alert('Hubo un error al crear la actividad: ' + (error.response?.data?.message || error.message));
      }
    } else {
      alert('Por favor, completa todos los campos');
    }
  };

  console.log('Nuevo estado de la actividad:', newActivity);
  console.log('Trabajadores disponibles:', trabajadores);

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
              onChange={(newValue) => handleChange('fecha', newValue || dayjs())}
              textField={<TextField fullWidth />}
            />
            <TimePicker
              label="Hora de Inicio"
              value={newActivity.horaInicio}
              onChange={(newValue) => handleChange('horaInicio', newValue || dayjs())}
              textField={<TextField fullWidth />}
            />
            <TimePicker
              label="Hora de Fin"
              value={newActivity.horaFin}
              onChange={(newValue) => handleChange('horaFin', newValue || dayjs())}
              textField={<TextField fullWidth />}
            />
          </LocalizationProvider>

          {/* Campo para escribir el nombre del entrenador */}
          <TextField
            label="Nombre del Entrenador"
            fullWidth
            value={newActivity.nombre_entrenador}
            onChange={(e) => handleChange('nombre_entrenador', e.target.value)}
            select
            SelectProps={{
              native: true,
            }}
            helperText="Escribe el nombre del entrenador"
          >
            {trabajadores.length > 0 ? (
              trabajadores.map((trabajador) => (
                <option key={trabajador.id_trabajador} value={trabajador.nombres + ' ' + trabajador.apellidos}>
                  {trabajador.nombres} {trabajador.apellidos}
                </option>
              ))
            ) : (
              <option>No hay entrenadores disponibles</option>
            )}
          </TextField>

          {error && <Box color="error.main">{error}</Box>}
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
