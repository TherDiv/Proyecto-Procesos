import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';

const AddUserDialog = ({ open, handleClose, handleAddUser }) => {
  const [newUser, setNewUser] = useState({
    dni: '',
    name: '',
    estado: 'ACTIVO',
    inicio: '',
    fin: '',
    tipo: '',
    horario: '',
  });

  // Manejar cambios en los campos de entrada
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  // Resetear el formulario y cerrar el diálogo
  const handleSubmit = () => {
    handleAddUser(newUser);
    setNewUser({ dni: '', name: '', estado: 'ACTIVO', inicio: '', fin: '', tipo: '', horario: '' });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Añadir nuevo usuario</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="DNI"
          name="dni"
          value={newUser.dni}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Apellidos, Nombres"
          name="name"
          value={newUser.name}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Inicio de Membresía"
          name="inicio"
          value={newUser.inicio}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Fin de Membresía"
          name="fin"
          value={newUser.fin}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Tipo de Membresía"
          name="tipo"
          value={newUser.tipo}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Horario"
          name="horario"
          value={newUser.horario}
          onChange={handleInputChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Añadir
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserDialog;
