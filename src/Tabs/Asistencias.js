import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Box } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { obtenerUsuarios, obtenerAsistencias, marcarAsistencia } from '../api/api';

const Asistencias = () => {
  const [fecha, setFecha] = useState(dayjs().format('YYYY-MM-DD')); // Fecha segun endpoint
  const [usuarios, setUsuarios] = useState([]); // Usuarios activos
  const [asistencias, setAsistencias] = useState([]); // Lista de asistencias

  const cargarUsuarios = async () => {
    try {
      const data = await obtenerUsuarios();
      const usuariosActivos = data.filter((usuario) => usuario.estado_membresia === 'activa');
      setUsuarios(usuariosActivos);
    } catch (error) {
      console.error('Error al cargar usuarios:', error.message);
    }
  };

  const cargarAsistencias = async (date) => {
    try {
      const formattedDate = dayjs(date).format('DD-MM-YYYY'); // Formatear fecha a DD-MM-YYYY
      console.log('Fecha enviada al endpoint obtener_asistencias:', formattedDate); // Depuración
      const data = await obtenerAsistencias(formattedDate);
      setAsistencias(data || []);
    } catch (error) {
      console.error('Error al cargar asistencias:', error.message);
    }
  };

  const handleMarcarAsistencia = async (id_matricula) => {
    try {
      const time = dayjs().format('HH:mm'); // Hora actual
      const formattedDate = dayjs(fecha).format('YYYY-MM-DD'); // Fecha formateada a YYYY-MM-DD
      console.log('Datos enviados al endpoint marcar_asistencia:', {
        id_matricula,
        date: formattedDate,
        time,
      });
      const response = await marcarAsistencia(id_matricula, formattedDate, time);
      console.log('Respuesta del servidor:', response);
      cargarAsistencias(fecha); // Recargar asistencias
    } catch (error) {
      console.error('Error al marcar asistencia:', error.response?.data || error.message);
    }
  };
  

  const obtenerTablaAsistencias = () => {
    return usuarios.map((usuario) => {
      const asistencia = asistencias.find((a) => a.id_matricula === usuario.dni) || {}; 
      return {
        id_usuario: usuario.dni,
        nombre: usuario.nombres,
        apellido: usuario.apellidos,
        email: usuario.email || '-',
        hora_entrada: asistencia.hora_entrada || '-',
        hora_salida: asistencia.hora_salida || '-',
        id_matricula: usuario.dni, 
      };
    });
  };

  useEffect(() => {
    cargarUsuarios();
    cargarAsistencias(fecha); 
  }, [fecha]);

  return (
    <div>
      <h1>Asistencias del Gimnasio</h1>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Seleccionar Fecha"
            value={dayjs(fecha)}
            onChange={(newValue) => {
              if (newValue) {
                setFecha(newValue.format('YYYY-MM-DD'));
              }
            }}
          />
        </LocalizationProvider>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID Usuario</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Apellido</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Hora Entrada</TableCell>
            <TableCell>Hora Salida</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {obtenerTablaAsistencias().map((usuario, index) => (
            <TableRow key={index}>
              <TableCell>{usuario.id_usuario}</TableCell>
              <TableCell>{usuario.nombre}</TableCell>
              <TableCell>{usuario.apellido}</TableCell>
              <TableCell>{usuario.email}</TableCell>
              <TableCell>{usuario.hora_entrada}</TableCell>
              <TableCell>{usuario.hora_salida}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleMarcarAsistencia(usuario.id_matricula)}
                  disabled={usuario.hora_entrada !== '-'} 
                  style={{ marginRight: '10px' }}
                >
                  Entrada
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleMarcarAsistencia(usuario.id_matricula)}
                  disabled={usuario.hora_entrada === '-' || usuario.hora_salida !== '-'} 
                >
                  Salida
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Asistencias;
