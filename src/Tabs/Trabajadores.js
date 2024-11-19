import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, TextField, Button, Select, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle, Box } from '@mui/material';
import { obtenerTrabajadores, crearTrabajador } from '../api/api';

const Trabajadores = () => {
  const [trabajadores, setTrabajadores] = useState([]);
  const [nuevoTrabajador, setNuevoTrabajador] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    cargo: '',
    tipo_sueldo: '',
    sueldo: '',
  });
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    cargarTrabajadores();
  }, []);

  const cargarTrabajadores = async () => {
    try {
      const data = await obtenerTrabajadores();
      setTrabajadores(data);
    } catch (error) {
      console.error('Error al cargar trabajadores:', error.message);
    }
  };

  const handleCrearTrabajador = async () => {
    try {
      await crearTrabajador({ ...nuevoTrabajador, id_gimnasio: 1 });
      cargarTrabajadores(); // Recargar lista
      setOpenDialog(false); // Cerrar diálogo
    } catch (error) {
      console.error('Error al crear trabajador:', error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoTrabajador((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h1>Lista de Trabajadores</h1>
      <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>Añadir Trabajador</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Apellido</TableCell>
            <TableCell>Cargo</TableCell>
            <TableCell>Tipo de Sueldo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {trabajadores.map((trabajador, index) => (
            <TableRow key={index}>
              <TableCell>{trabajador.nombres}</TableCell>
              <TableCell>{trabajador.apellidos}</TableCell>
              <TableCell>{trabajador.cargo}</TableCell>
              <TableCell>{trabajador.tipo_sueldo}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Añadir Nuevo Trabajador</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField name="nombres" label="Nombres" value={nuevoTrabajador.nombres} onChange={handleChange} fullWidth />
            <TextField name="apellidos" label="Apellidos" value={nuevoTrabajador.apellidos} onChange={handleChange} fullWidth />
            <TextField name="email" label="Email" value={nuevoTrabajador.email} onChange={handleChange} fullWidth />
            <Select name="cargo" value={nuevoTrabajador.cargo} onChange={handleChange} fullWidth>
              <MenuItem value="entrenador">Entrenador</MenuItem>
              <MenuItem value="limpieza">Limpieza</MenuItem>
              <MenuItem value="administrador">Administrador</MenuItem>
              <MenuItem value="recepcionista">Recepcionista</MenuItem>
            </Select>
            <Select name="tipo_sueldo" value={nuevoTrabajador.tipo_sueldo} onChange={handleChange} fullWidth>
              <MenuItem value="fijo">Fijo</MenuItem>
              <MenuItem value="por_hora">Por Hora</MenuItem>
            </Select>
            <TextField name="sueldo" label="Sueldo" type="number" value={nuevoTrabajador.sueldo} onChange={handleChange} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">Cancelar</Button>
          <Button onClick={handleCrearTrabajador} color="primary">Añadir</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Trabajadores;
