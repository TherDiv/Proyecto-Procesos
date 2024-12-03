import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Snackbar, Alert } from '@mui/material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { obtenerTrabajadores, crearActividad } from '..//api/api'; // Importa las funciones desde api.js

const AddActivityDialog = ({ open, onClose, onCrear }) => {
  const [newActivity, setNewActivity] = useState({
    nombre_actividad: '',
    descripcion: '',
    fecha: dayjs(),
    horaInicio: dayjs(),
    horaFin: dayjs().add(1, 'hour'),
    id_entrenador: '',
  });

  const [trabajadores, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchTrabajadores = async () => {
      setLoading(true);
      try {
        const trabajadores = await obtenerTrabajadores();
        setTrabajadores(trabajadores.filter((trabajador) => trabajador.cargo === 'entrenador'));
      } catch (error) {
        setErrorMessage('Error al obtener los trabajadores');
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchTrabajadores();
      setErrorMessage('');
      setSuccessMessage('');
      setNewActivity({
        nombre_actividad: '',
        descripcion: '',
        fecha: dayjs(),
        horaInicio: dayjs(),
        horaFin: dayjs().add(1, 'hour'),
        id_entrenador: '',
      });
    }
  }, [open]);

  const handleChange = (field, value) => {
    setNewActivity((prev) => ({ ...prev, [field]: value }));
  };

  const handleCrearActividad = async () => {
    if (!newActivity.nombre_actividad || !newActivity.descripcion || !newActivity.id_entrenador) {
      setErrorMessage('Por favor, completa todos los campos');
      return;
    }

    if (newActivity.horaFin.isBefore(newActivity.horaInicio)) {
      setErrorMessage('La hora de fin debe ser posterior a la hora de inicio.');
      return;
    }

    const payload = {
      id_gimnasio: 1,
      nombre_actividad: newActivity.nombre_actividad,
      descripcion: newActivity.descripcion,
      horarios: [
        {
          fecha: newActivity.fecha.toISOString(),
          hora_inicio: newActivity.horaInicio.format('YYYY-MM-DDTHH:mm:ss'),
          hora_fin: newActivity.horaFin.format('YYYY-MM-DDTHH:mm:ss'),
          id_trabajador: Number(newActivity.id_entrenador),
        },
      ],
    };

    try {
      const response = await crearActividad(payload);
      if (onCrear) onCrear(response.actividad); // Asegúrate de que onCrear es una función válida
      setSuccessMessage('Actividad creada con éxito');
      setTimeout(onClose, 1000); // Cierra el diálogo después de mostrar el mensaje de éxito
    } catch (error) {
      console.error('Error al crear actividad:', error);
      setErrorMessage('Hubo un error al crear la actividad');
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
              onChange={(newValue) => handleChange('fecha', newValue || dayjs())}
              renderInput={(params) => <TextField fullWidth {...params} />}
            />
            <TimePicker
              label="Hora de Inicio"
              value={newActivity.horaInicio}
              onChange={(newValue) => handleChange('horaInicio', newValue || dayjs())}
              renderInput={(params) => <TextField fullWidth {...params} />}
            />
            <TimePicker
              label="Hora de Fin"
              value={newActivity.horaFin}
              onChange={(newValue) => handleChange('horaFin', newValue || dayjs())}
              renderInput={(params) => <TextField fullWidth {...params} />}
            />
          </LocalizationProvider>
          <TextField
            label="Entrenador"
            fullWidth
            value={newActivity.id_entrenador}
            onChange={(e) => handleChange('id_entrenador', e.target.value)}
            select
            SelectProps={{ native: true }}
          >
            {trabajadores.length > 0 ? (
              trabajadores.map((trabajador) => (
                <option key={trabajador.id_trabajador} value={trabajador.id_trabajador}>
                  {trabajador.nombres} {trabajador.apellidos}
                </option>
              ))
            ) : (
              <option>No hay entrenadores disponibles</option>
            )}
          </TextField>
          {errorMessage && (
            <Snackbar open={true} autoHideDuration={6000}>
              <Alert severity="error">{errorMessage}</Alert>
            </Snackbar>
          )}
          {successMessage && (
            <Snackbar open={true} autoHideDuration={6000}>
              <Alert severity="success">{successMessage}</Alert>
            </Snackbar>
          )}
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
