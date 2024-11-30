import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, MenuItem, FormControl, InputLabel, Select, CircularProgress } from '@mui/material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axios from 'axios';

const AddActivityDialog = ({ open, onClose, onCrear }) => {
  const [newActivity, setNewActivity] = useState({
    nombre_actividad: '',
    descripcion: '',
    fecha: dayjs(),  // Asegúrate de que esto esté correctamente inicializado
    horaInicio: dayjs(),  // Lo mismo con la hora de inicio
    horaFin: dayjs().add(1, 'hour'),  // Y la hora de fin
    id_trabajador: '', // Asegúrate de que se inicia como un string vacío, no null
  });

  const [trabajadores, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  // Agregar estado de error

  // Obtener la lista de trabajadores
  useEffect(() => {
    const fetchTrabajadores = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://procesos-backend.vercel.app/api/trabajadores');
        setTrabajadores(response.data); // Asumiendo que la respuesta es un array de trabajadores
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
    setNewActivity((prev) => ({ ...prev, [field]: value }));
  };

  const handleCrearActividad = async () => {
    // Validación de los campos
    if (
      newActivity.nombre_actividad &&
      newActivity.fecha &&
      newActivity.horaInicio &&
      newActivity.horaFin &&
      newActivity.id_trabajador
    ) {
      // Verificar si la hora de fin es posterior a la hora de inicio
      if (newActivity.horaFin.isBefore(newActivity.horaInicio)) {
        alert('La hora de fin debe ser posterior a la hora de inicio.');
        return;
      }

      const payload = {
        id_gimnasio: 1, // ID del gimnasio (puedes modificarlo si es necesario)
        nombre_actividad: newActivity.nombre_actividad,
        descripcion: newActivity.descripcion,
        horarios: [
          {
            fecha: newActivity.fecha.toISOString(),
            hora_inicio: newActivity.horaInicio.toISOString(),
            hora_fin: newActivity.horaFin.toISOString(),
            id_trabajador: newActivity.id_trabajador,  // Enviar id_trabajador directamente
          },
        ],
      };

      try {
        const response = await axios.post('https://procesos-backend.vercel.app/api/actividades', payload);
        console.log('Actividad creada:', response.data);
        onCrear(response.data);  // Llamar a onCrear para actualizar el estado en el componente padre
        onClose();  // Cerrar el diálogo
      } catch (error) {
        console.error('Error al crear actividad:', error);
        alert('Hubo un error al crear la actividad: ' + error.response?.data?.message || error.message);
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
              value={newActivity.fecha} // Este valor debe ser un objeto dayjs
              onChange={(newValue) => handleChange('fecha', newValue || dayjs())}  // Default a dayjs() si newValue es null
              renderInput={(params) => <TextField fullWidth {...params} />}
            />
            <TimePicker
              label="Hora de Inicio"
              value={newActivity.horaInicio}  // Asegúrate de que esto sea un objeto dayjs válido
              onChange={(newValue) => handleChange('horaInicio', newValue || dayjs())}
              renderInput={(params) => <TextField fullWidth {...params} />}
            />
            <TimePicker
              label="Hora de Fin"
              value={newActivity.horaFin}  // Asegúrate de que esto sea un objeto dayjs válido
              onChange={(newValue) => handleChange('horaFin', newValue || dayjs())}
              renderInput={(params) => <TextField fullWidth {...params} />}
            />
          </LocalizationProvider>

          <FormControl fullWidth>
            <InputLabel>Profesor</InputLabel>
            <Select
              value={newActivity.id_trabajador || ''}  // Asegúrate de que el valor sea el adecuado
              onChange={(e) => handleChange('id_trabajador', e.target.value)}  // Actualiza el valor correctamente
              label="Profesor"
            >
              {trabajadores.map((trabajador) => (
                <MenuItem key={trabajador.id_trabajador} value={trabajador.id_trabajador}>
                  {trabajador.nombres} {trabajador.apellidos}
                </MenuItem>
              ))}
            </Select>
          </FormControl>


          {/* Mostrar error si no se pueden cargar los trabajadores */}
          {error && <Box color="error.main">{error}</Box>}

          {/* Mostrar el indicador de carga mientras obtenemos los trabajadores */}
          {loading && <CircularProgress />}
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
