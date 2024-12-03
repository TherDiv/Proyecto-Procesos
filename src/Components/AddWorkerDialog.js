import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Select, MenuItem, Box, InputLabel, FormControl } from '@mui/material';

const AddWorkerDialog = ({ open, onClose, onCrear }) => {
  const [nuevoTrabajador, setNuevoTrabajador] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    cargo: '',
    tipo_sueldo: '',
    sueldo: '',
  });

  // Limpiar el formulario cada vez que se abra el diálogo
  useEffect(() => {
    if (open) {
      setNuevoTrabajador({
        nombres: '',
        apellidos: '',
        email: '',
        cargo: '',
        tipo_sueldo: '',
        sueldo: '',
      });
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoTrabajador((prev) => ({ ...prev, [name]: value }));
  };

  const handleCrear = () => {
    // Validación básica
    if (!nuevoTrabajador.nombres || !nuevoTrabajador.apellidos || !nuevoTrabajador.email || !nuevoTrabajador.cargo || !nuevoTrabajador.sueldo) {
      alert('Por favor, complete todos los campos');
      return;
    }
    onCrear(nuevoTrabajador); // Llamada a la función onCrear
  };

  return (
    <Dialog open={open} onClose={onClose} sx={{ '& .MuiDialog-paper': { width: '400px' } }}>
      <DialogTitle>Añadir Nuevo Trabajador</DialogTitle>
      <DialogContent>
        <TextField
          name="nombres"
          label="Nombres"
          value={nuevoTrabajador.nombres}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          name="apellidos"
          label="Apellidos"
          value={nuevoTrabajador.apellidos}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          name="email"
          label="Email"
          value={nuevoTrabajador.email}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />

        <FormControl fullWidth margin="dense">
          <InputLabel>Cargo</InputLabel>
          <Select
            name="cargo"
            value={nuevoTrabajador.cargo}
            onChange={handleChange}
          >
            <MenuItem value="entrenador">Entrenador</MenuItem>
            <MenuItem value="limpieza">Limpieza</MenuItem>
            <MenuItem value="administrador">Administrador</MenuItem>
            <MenuItem value="recepcionista">Recepcionista</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense">
          <InputLabel>Tipo de Sueldo</InputLabel>
          <Select
            name="tipo_sueldo"
            value={nuevoTrabajador.tipo_sueldo}
            onChange={handleChange}
          >
            <MenuItem value="fijo">Fijo</MenuItem>
            <MenuItem value="por_hora">Por Hora</MenuItem>
          </Select>
        </FormControl>

        <TextField
          name="sueldo"
          label="Sueldo"
          value={nuevoTrabajador.sueldo}
          onChange={handleChange}
          fullWidth
          margin="dense"
          type="number"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancelar</Button>
        <Button onClick={handleCrear} color="primary">Añadir</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddWorkerDialog;
