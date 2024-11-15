import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';

const AddWorkerDialog = ({ open, onClose, onCrear }) => {
  const [newWorker, setNewWorker] = useState({
    name: '',
    salaryType: '',
    job: '',
  });

  const handleChange = (e) => {
    setNewWorker({
      ...newWorker,
      [e.target.name]: e.target.value,
    });
  };

  const handleCrear = () => {
    if (newWorker.name && newWorker.salaryType && newWorker.job) {
      onCrear(newWorker);
      setNewWorker({ name: '', salaryType: '', job: '' });
      onClose();
    } else {
      alert('Todos los campos son obligatorios');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle><strong>Añadir Nuevo Trabajador</strong></DialogTitle>
      <DialogContent>
        <TextField
          name="name"
          label="Nombres y Apellidos"
          fullWidth
          margin="dense"
          onChange={handleChange}
          value={newWorker.name}
        />
        <TextField
          select
          label="Tipo de Sueldo"
          name="salaryType"
          fullWidth
          margin="dense"
          onChange={handleChange}
          value={newWorker.salaryType}
        >
          <MenuItem value="Fijo">Fijo</MenuItem>
          <MenuItem value="Por horas">Por horas</MenuItem>
        </TextField>
        <TextField
          select
          label="Cargo"
          name="job"
          fullWidth
          margin="dense"
          onChange={handleChange}
          value={newWorker.job}
        >
          <MenuItem value="Administración">Administración</MenuItem>
          <MenuItem value="Entrenador">Entrenador</MenuItem>
          <MenuItem value="Ventas">Ventas</MenuItem>
          <MenuItem value="Limpieza">Limpieza</MenuItem>
          <MenuItem value="Seguridad">Seguridad</MenuItem>
          <MenuItem value="Profesor de baile">Profesor de baile</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancelar</Button>
        <Button onClick={handleCrear} color="primary">Añadir Trabajador</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddWorkerDialog;
