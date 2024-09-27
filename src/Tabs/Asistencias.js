import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, TextField, Button, Checkbox, Box, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers';
import 'dayjs/locale/es';

const Asistencias = () => {
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  const [users, setUsers] = useState([
    { dni: '1234567', name: 'GARCÍA LÓPEZ, JUAN CARLOS', horaEntrada: '08:00', horaSalida: '17:00', tipo: 'Trimestral', horario: 'Diario', asistencia: false },
    { dni: '2345678', name: 'PÉREZ SÁNCHEZ, MARÍA FERNANDA', horaEntrada: '09:00', horaSalida: '18:00', tipo: 'Trimestral', horario: 'Interdiario', asistencia: false },
    { dni: '3456789', name: 'MARTÍNEZ RUIZ, LUIS MIGUEL', horaEntrada: '07:30', horaSalida: '16:30', tipo: 'Semestral', horario: 'Diario', asistencia: false },
    { dni: '4567890', name: 'RODRÍGUEZ DÍAZ, ANA SOFÍA', horaEntrada: '08:30', horaSalida: '17:30', tipo: 'Anual', horario: 'Interdiario', asistencia: false },
    { dni: '5678901', name: 'HERNÁNDEZ GÓMEZ, DAVID ALEJANDRO', horaEntrada: '08:00', horaSalida: '17:00', tipo: 'Semestral', horario: 'Diario', asistencia: false },
    { dni: '6789012', name: 'FERNÁNDEZ LÓPEZ, ISABEL CRISTINA', horaEntrada: '09:00', horaSalida: '18:00', tipo: 'Anual', horario: 'Diario', asistencia: false },
    { dni: '7890123', name: 'RAMÍREZ PÉREZ, CARLOS ANDRÉS', horaEntrada: '08:30', horaSalida: '17:30', tipo: 'Semestral', horario: 'Interdiario', asistencia: false },
    { dni: '8901234', name: 'SÁNCHEZ GARCÍA, LAURA PAOLA', horaEntrada: '07:45', horaSalida: '16:45', tipo: 'Trimestral', horario: 'Diario', asistencia: false },
    { dni: '9012345', name: 'GÓMEZ JIMÉNEZ, JORGE DANIEL', horaEntrada: '08:15', horaSalida: '17:15', tipo: 'Anual', horario: 'Diario', asistencia: false },
    { dni: '0123456', name: 'DÍAZ HERNÁNDEZ, SOFÍA ISABEL', horaEntrada: '09:30', horaSalida: '18:30', tipo: 'Semestral', horario: 'Interdiario', asistencia: false },
    { dni: '1234561', name: 'LOPEZ MARTÍNEZ, ALEJANDRO ENRIQUE', horaEntrada: '07:00', horaSalida: '16:00', tipo: 'Anual', horario: 'Diario', asistencia: false },
    { dni: '2345672', name: 'VARGAS SERRANO, MARÍA CAMILA', horaEntrada: '08:45', horaSalida: '17:45', tipo: 'Semestral', horario: 'Interdiario', asistencia: false },
    { dni: '3456783', name: 'RUIZ RAMÍREZ, JAVIER ANTONIO', horaEntrada: '08:00', horaSalida: '17:00', tipo: 'Anual', horario: 'Diario', asistencia: false },
    { dni: '4567894', name: 'MORALES PÉREZ, DANIEL FERNANDO', horaEntrada: '09:00', horaSalida: '18:00', tipo: 'Semestral', horario: 'Diario', asistencia: false },
    { dni: '5678905', name: 'TORRES FLORES, SARA ELENA', horaEntrada: '07:30', horaSalida: '16:30', tipo: 'Anual', horario: 'Interdiario', asistencia: false },
    { dni: '6789016', name: 'GUTIÉRREZ GONZÁLEZ, MIGUEL ÁNGEL', horaEntrada: '08:15', horaSalida: '17:15', tipo: 'Semestral', horario: 'Diario', asistencia: false }
  ]);
  

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCheckboxChange = (index) => {
    const updatedUsers = [...users];
    updatedUsers[index].asistencia = !updatedUsers[index].asistencia;
    setUsers(updatedUsers);
  };

  return (
    <div>
      <h1>Modulo de asistencias</h1>
      <Box style={{ marginBottom: "20px" }} >
        <LocalizationProvider dateAdapter = {AdapterDayjs} adapterLocale="es">
          <DatePicker 
          label="Seleccionar Fecha"/>
        </LocalizationProvider>

      </Box>
      <TextField 
        label="Buscar usuario"
        variant="outlined"
        size="small"
        style={{ width: '600px' }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Button 
        variant="contained" 
        color="primary" 
        style={{ marginLeft: '2rem' }}>
        Descargar Reporte
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>DNI</TableCell> 
            <TableCell>Nombres y Apellidos</TableCell>   
            <TableCell>Asistencia</TableCell>       
            <TableCell>Hora Entrada</TableCell> 
            <TableCell>Hora Salida</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredUsers.map((user, index) => (
            <TableRow key={index}>
              <TableCell>{user.dni}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>
                <Checkbox
                  checked={user.asistencia}
                  onChange={() => handleCheckboxChange(index)}
                />
              </TableCell>
              <TableCell>{user.horaEntrada}</TableCell>
              <TableCell>{user.horaSalida}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p>Este es el contenido principal de la página de Asistencias.</p>
    </div>
  );
};

export default Asistencias;
