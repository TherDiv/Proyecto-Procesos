// Tabs/Usuarios.js
import React, { useEffect, useState } from 'react';
import { obtenerUsuarios, crearUsuario } from '../api/api';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Box, TextField, Select, MenuItem } from '@mui/material';
import AddUserDialog from '../Components/AddUserDialog';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [search, setSearch] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    const usuariosData = await obtenerUsuarios();
    setUsuarios(usuariosData);
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleCrearUsuario = async (nuevoUsuario) => {
    await crearUsuario(nuevoUsuario);
    cargarUsuarios();
  };

  // Filtrar usuarios en función del estado y la búsqueda
  const usuariosFiltrados = usuarios.filter((usuario) => {
    const nombreCompleto = `${usuario.apellidos}, ${usuario.nombres}`.toLowerCase();
    const searchMatch = nombreCompleto.includes(search.toLowerCase());
    const estadoMatch = estadoFiltro ? usuario.estado_membresia.toLowerCase() === estadoFiltro.toLowerCase() : true;
    return searchMatch && estadoMatch;
  });

  return (
    <div>
      <h1>Usuarios del gimnasio</h1>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px">
        <Button variant="contained" color="primary" onClick={handleOpenDialog}>
          Añadir Usuario
        </Button>
        <Box display="flex" alignItems="center">
          <TextField
            label="Buscar usuario"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginRight: '20px', width: '200px' }}
          />
          <Select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            displayEmpty
            variant="outlined"
            size="small"
            style={{ width: '180px' }}
          >
            <MenuItem value="">Filtrar por Estado</MenuItem>
            <MenuItem value="activa">Activa</MenuItem>
            <MenuItem value="inactiva">Inactiva</MenuItem>
          </Select>
        </Box>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>DNI</TableCell>
            <TableCell>Apellidos, Nombres</TableCell>
            <TableCell>Estado Membresía</TableCell>
            <TableCell>Inicio de Membresía</TableCell>
            <TableCell>Fin de Membresía</TableCell>
            <TableCell>Tipo de Membresía</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {usuariosFiltrados.map((usuario, index) => (
            <TableRow key={index}>
              <TableCell>{usuario.dni}</TableCell>
              <TableCell>{usuario.apellidos}, {usuario.nombres}</TableCell>
              <TableCell>{usuario.estado_membresia}</TableCell>
              <TableCell>{usuario.inicio_membresia}</TableCell>
              <TableCell>{usuario.fin_membresia}</TableCell>
              <TableCell>{usuario.tipo_membresia}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AddUserDialog open={openDialog} onClose={handleCloseDialog} onCrear={handleCrearUsuario} />
    </div>
  );
};

export default Usuarios;
