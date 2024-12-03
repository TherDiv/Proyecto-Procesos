import React, { useState, useEffect } from 'react';
import { TextField, MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';

const AddActividadDialog = ({ open, onClose, onCrear }) => {
  const [actividad, setActividad] = useState({
    nombre_actividad: '',
    descripcion: '',
    horarios: [],
  });

  const [trabajadores, setTrabajadores] = useState([]);
  const [selectedTrabajador, setSelectedTrabajador] = useState(null);

  useEffect(() => {
    // Obtener trabajadores desde la API
    axios.get('/api/trabajadores')
      .then((response) => {
        setTrabajadores(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener los trabajadores', error);
      });
  }, []);

  const handleTrabajadorChange = (event) => {
    const trabajador = trabajadores.find(t => t.id_trabajador === event.target.value);
    setSelectedTrabajador(trabajador);
  };

  const handleCrearActividad = () => {
    const horario = {
      fecha: '2024-11-23T00:00:00.000Z',
      hora_inicio: '2024-11-23T11:00:00.000Z',
      hora_fin: '2024-11-23T17:00:00.000Z',
      id_trabajador: selectedTrabajador?.id_trabajador,
    };

    setActividad(prev => ({
      ...prev,
      horarios: [horario],  // Aquí asignamos el horario con el trabajador
    }));

    // Aquí envías la actividad al backend con el id_trabajador asociado
    axios.post('/api/actividades', actividad)
      .then(response => {
        console.log('Actividad creada exitosamente:', response.data);
        onCrear(response.data);
        onClose();
      })
      .catch(error => {
        console.error('Error al crear la actividad:', error);
      });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Crear Nueva Actividad</DialogTitle>
      <DialogContent>
        <TextField
          label="Nombre de la Actividad"
          fullWidth
          value={actividad.nombre_actividad}
          onChange={(e) => setActividad({ ...actividad, nombre_actividad: e.target.value })}
        />
        <TextField
          label="Descripción"
          fullWidth
          value={actividad.descripcion}
          onChange={(e) => setActividad({ ...actividad, descripcion: e.target.value })}
        />
        
        <TextField
          select
          label="Seleccionar Trabajador"
          fullWidth
          value={selectedTrabajador?.id_trabajador || ''}
          onChange={handleTrabajadorChange}
        >
          {trabajadores.map((trabajador) => (
            <MenuItem key={trabajador.id_trabajador} value={trabajador.id_trabajador}>
              {trabajador.nombres} {trabajador.apellidos}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancelar</Button>
        <Button onClick={handleCrearActividad} color="primary">Añadir Actividad</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddActividadDialog;
