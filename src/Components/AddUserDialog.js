import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const AddUserDialog = ({ open, onClose, onCrear }) => {
  // Estado inicial del nuevo usuario
  const initialState = {
    dni: '',
    apellido: '',
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    fecha_registro: dayjs().format('YYYY-MM-DD'),
    inicio_membresia: null,
    fin_membresia: '',
    tipo_membresia: '',
  };

  // Establecemos el estado del nuevo usuario
  const [nuevoUsuario, setNuevoUsuario] = useState(initialState);

  // Reseteamos los datos cuando el diálogo se abre
  useEffect(() => {
    if (open) {
      setNuevoUsuario(initialState);  // Restablecemos el estado al valor inicial
    }
  }, [open]);  // Este efecto se ejecuta cada vez que 'open' cambie

  const handleChange = (e) => {
    setNuevoUsuario({
      ...nuevoUsuario,
      [e.target.name]: e.target.value,
    });
  };

  const handleFechaInicioChange = (date) => {
    const formattedDate = date.format('YYYY-MM-DD');
    setNuevoUsuario((prev) => {
      const updatedState = { ...prev, inicio_membresia: formattedDate };
      // Calcular fecha fin al cambiar la fecha de inicio
      if (updatedState.tipo_membresia) {
        updatedState.fin_membresia = calcularFechaFin(formattedDate, updatedState.tipo_membresia);
      }
      return updatedState;
    });
  };

  const handleTipoMembresiaChange = (value) => {
    setNuevoUsuario((prev) => {
      const updatedState = { ...prev, tipo_membresia: value };
      // Solo calculamos la fecha de fin si ya existe la fecha de inicio
      if (updatedState.inicio_membresia) {
        updatedState.fin_membresia = calcularFechaFin(updatedState.inicio_membresia, value);
      }
      return updatedState;
    });
  };

  const calcularFechaFin = (fechaInicio, tipoMembresia) => {
    let fechaFin;
    switch (tipoMembresia) {
      case 'mensual':
        fechaFin = dayjs(fechaInicio).add(1, 'month').format('YYYY-MM-DD');
        break;
      case 'trimestral':
        fechaFin = dayjs(fechaInicio).add(3, 'month').format('YYYY-MM-DD');
        break;
      case 'semestral':
        fechaFin = dayjs(fechaInicio).add(6, 'month').format('YYYY-MM-DD');
        break;
      case 'anual':
        fechaFin = dayjs(fechaInicio).add(1, 'year').format('YYYY-MM-DD');
        break;
      default:
        fechaFin = '';
    }
    return fechaFin;
  };

  const handleCrearUsuario = () => {
    onCrear(nuevoUsuario);
    onClose(); // Cierra el diálogo después de crear el usuario
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle><strong>Crear Nuevo Miembro</strong></DialogTitle>
      <DialogContent>
        <TextField name="apellido" label="Apellidos" fullWidth margin="dense" onChange={handleChange} value={nuevoUsuario.apellido} />
        <TextField name="nombre" label="Nombres" fullWidth margin="dense" onChange={handleChange} value={nuevoUsuario.nombre} />
        <TextField name="dni" label="DNI" fullWidth margin="dense" onChange={handleChange} value={nuevoUsuario.dni} />
        <TextField name="email" label="Correo Electrónico" fullWidth margin="dense" onChange={handleChange} value={nuevoUsuario.email} />
        <TextField name="telefono" label="Teléfono" fullWidth margin="dense" onChange={handleChange} value={nuevoUsuario.telefono} />
        <TextField name="direccion" label="Dirección" fullWidth margin="dense" onChange={handleChange} value={nuevoUsuario.direccion} />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Inicio de Membresía"
            value={dayjs(nuevoUsuario.inicio_membresia)}
            onChange={handleFechaInicioChange}
            format="YYYY-MM-DD"
            renderInput={(params) => <TextField fullWidth margin="dense" {...params} />}
          />
        </LocalizationProvider>
        <TextField
          select
          label="Tipo de Membresía"
          fullWidth
          margin="dense"
          value={nuevoUsuario.tipo_membresia}
          onChange={(e) => handleTipoMembresiaChange(e.target.value)}
        >
          <MenuItem value="mensual">Mensual</MenuItem>
          <MenuItem value="trimestral">Trimestral</MenuItem>
          <MenuItem value="semestral">Semestral</MenuItem>
          <MenuItem value="anual">Anual</MenuItem>
        </TextField>
        <TextField name="fin_membresia" label="Fin de Membresía" fullWidth margin="dense" value={nuevoUsuario.fin_membresia} disabled />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancelar</Button>
        <Button onClick={handleCrearUsuario} color="primary">Añadir miembro</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserDialog;
