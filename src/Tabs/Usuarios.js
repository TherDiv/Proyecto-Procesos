import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, TextField, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import AddUserDialog from '../Components/AddUserDialog';

const Usuarios = () => {
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  const [users, setUsers] = useState([
    { dni: '1234567', name: 'GARCÍA LÓPEZ, JUAN CARLOS', estado: 'ACTIVO', inicio: '18/04/24', fin: '18/07/24', tipo: 'Trimestral', horario: 'Diario' },
    { dni: '2345678', name: 'PÉREZ SÁNCHEZ, MARÍA FERNANDA', estado: 'ACTIVO', inicio: '18/04/24', fin: '18/07/24', tipo: 'Trimestral', horario: 'Interdiario' },
    { dni: '3456789', name: 'MARTÍNEZ RUIZ, LUIS MIGUEL', estado: 'ACTIVO', inicio: '01/05/24', fin: '01/08/24', tipo: 'Semestral', horario: 'Diario' },
    { dni: '4567890', name: 'RODRÍGUEZ DÍAZ, ANA SOFÍA', estado: 'ACTIVO', inicio: '01/06/24', fin: '01/09/24', tipo: 'Anual', horario: 'Interdiario' },
    { dni: '5678901', name: 'HERNÁNDEZ GÓMEZ, DAVID ALEJANDRO', estado: 'ACTIVO', inicio: '18/04/24', fin: '18/10/24', tipo: 'Semestral', horario: 'Diario' },
    { dni: '6789012', name: 'FERNÁNDEZ LÓPEZ, ISABEL CRISTINA', estado: 'ACTIVO', inicio: '18/04/24', fin: '18/10/24', tipo: 'Anual', horario: 'Diario' },
    { dni: '7890123', name: 'RAMÍREZ PÉREZ, CARLOS ANDRÉS', estado: 'ACTIVO', inicio: '18/05/24', fin: '18/11/24', tipo: 'Semestral', horario: 'Interdiario' },
    { dni: '8901234', name: 'SÁNCHEZ GARCÍA, LAURA PAOLA', estado: 'ACTIVO', inicio: '18/05/24', fin: '18/11/24', tipo: 'Trimestral', horario: 'Diario' },
    { dni: '9012345', name: 'GÓMEZ JIMÉNEZ, JORGE DANIEL', estado: 'ACTIVO', inicio: '18/05/24', fin: '18/11/24', tipo: 'Anual', horario: 'Diario' },
    { dni: '0123456', name: 'DÍAZ HERNÁNDEZ, SOFÍA ISABEL', estado: 'ACTIVO', inicio: '18/06/24', fin: '18/12/24', tipo: 'Semestral', horario: 'Interdiario' },
    { dni: '1234561', name: 'LOPEZ MARTÍNEZ, ALEJANDRO ENRIQUE', estado: 'ACTIVO', inicio: '18/06/24', fin: '18/12/24', tipo: 'Anual', horario: 'Diario' },
    { dni: '2345672', name: 'VARGAS SERRANO, MARÍA CAMILA', estado: 'ACTIVO', inicio: '18/06/24', fin: '18/12/24', tipo: 'Semestral', horario: 'Interdiario' },
    { dni: '3456783', name: 'RUIZ RAMÍREZ, JAVIER ANTONIO', estado: 'ACTIVO', inicio: '18/07/24', fin: '18/01/25', tipo: 'Anual', horario: 'Diario' },
    { dni: '4567894', name: 'MORALES PÉREZ, DANIEL FERNANDO', estado: 'ACTIVO', inicio: '18/07/24', fin: '18/01/25', tipo: 'Semestral', horario: 'Diario' },
    { dni: '5678905', name: 'TORRES FLORES, SARA ELENA', estado: 'ACTIVO', inicio: '18/07/24', fin: '18/01/25', tipo: 'Anual', horario: 'Interdiario' },
    { dni: '6789016', name: 'GUTIÉRREZ GONZÁLEZ, MIGUEL ÁNGEL', estado: 'ACTIVO', inicio: '18/07/24', fin: '18/01/25', tipo: 'Semestral', horario: 'Diario' }
  ]);

  const [open, setOpen] = useState(false); // Controla si el diálogo está abierto

  // Abrir el diálogo
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Cerrar el diálogo
  const handleClose = () => {
    setOpen(false);
  };

  // Añadir el nuevo usuario a la lista
  const handleAddUser = (newUser) => {
    setUsers([...users, newUser]);
  };

  // Filtrar usuarios
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()) &&
    (filter === '' || user.estado === filter)
  );

  return (
    <div>
      <h1>Usuarios del gimnasio</h1>
      <div className="toolbar">
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Añadir usuario
        </Button>
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

      {/* Usamos el componente de diálogo */}
      <AddUserDialog open={open} handleClose={handleClose} handleAddUser={handleAddUser} />
    </div>
  );
};

export default Usuarios;
