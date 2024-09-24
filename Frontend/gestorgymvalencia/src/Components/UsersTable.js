import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, TextField, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const UsersTable = () => {
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  const users = [
    { dni: '1234567', name: 'APELLIDOS, NOMBRES 1', estado: 'ACTIVO', inicio: '18/04/24', fin: '18/07/24', tipo: 'Trimestral', horario: 'Diario' },
    { dni: '1234567', name: 'APELLIDOS, NOMBRES 2', estado: 'ACTIVO', inicio: '18/04/24', fin: '18/07/24', tipo: 'Trimestral', horario: 'Interdiario' },
    // Agrega más usuarios aquí...
  ];

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()) &&
    (filter === '' || user.estado === filter)
  );

  return (
    <div>
      <h1>Usuarios del gimnasio</h1>
      <div className="toolbar">
        <Button variant="contained" color="primary">Añadir entrada</Button>
        <TextField 
          label="Buscar usuario"
          variant="outlined"
          size="small"
          style={{ marginLeft: '1rem' }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FormControl style={{ marginLeft: '1rem' }}>
          <InputLabel>Filtrar por</InputLabel>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: 150 }}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="ACTIVO">Activo</MenuItem>
            <MenuItem value="INACTIVO">Inactivo</MenuItem>
          </Select>
        </FormControl>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>DNI</TableCell>
            <TableCell>APELLIDOS, NOMBRES</TableCell>
            <TableCell>ESTADO M.</TableCell>
            <TableCell>Inicio de Membresía</TableCell>
            <TableCell>Fin de Membresía</TableCell>
            <TableCell>Tipo de Membresía</TableCell>
            <TableCell>Horario</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.map((user, index) => (
            <TableRow key={index}>
              <TableCell>{user.dni}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.estado}</TableCell>
              <TableCell>{user.inicio}</TableCell>
              <TableCell>{user.fin}</TableCell>
              <TableCell>{user.tipo}</TableCell>
              <TableCell>{user.horario}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;
