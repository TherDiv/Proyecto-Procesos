import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Box, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { obtenerUsuarios, obtenerAsistencias, marcarAsistencia } from '../api/api';

const Asistencias = () => {
  const [fecha, setFecha] = useState(dayjs().format('YYYY-MM-DD')); // Fecha seleccionada
  const [usuarios, setUsuarios] = useState([]); // Lista de usuarios activos
  const [asistencias, setAsistencias] = useState([]); // Lista de asistencias para la fecha seleccionada

  // Cargar usuarios activos (usuarios con membresía activa)
  const cargarUsuarios = async () => {
    try {
      const data = await obtenerUsuarios();
      const usuariosActivos = data.filter((usuario) => usuario.estado_membresia === 'activa');
      setUsuarios(usuariosActivos);
    } catch (error) {
      console.error('Error al cargar usuarios:', error.message);
    }
  };

  // Cargar asistencias desde el backend para la fecha seleccionada
  const cargarAsistencias = async (date) => {
    try {
      const data = await obtenerAsistencias(date);
      setAsistencias(data.asistencias || []);
    } catch (error) {
      console.error('Error al cargar asistencias:', error.message);
    }
  };

  // Marcar entrada o salida
  const handleMarcarAsistencia = async (id_matricula) => {
    try {
      const time = dayjs().format('HH:mm'); // Hora actual
      await marcarAsistencia(id_matricula, fecha, time); // Llama al endpoint de marcar asistencia
      cargarAsistencias(fecha); // Actualiza la tabla de asistencias
    } catch (error) {
      console.error('Error al marcar asistencia:', error.message);
    }
  };

  // Combina usuarios con asistencias para mostrar la tabla completa
  const obtenerTablaAsistencias = () => {
    return usuarios.map((usuario) => {
      const asistencia = asistencias.find((a) => a.id_matricula === usuario.dni) || {}; // Busca si hay asistencia registrada
      return {
        id_usuario: usuario.dni,
        nombre: usuario.nombres,
        apellido: usuario.apellidos,
        email: usuario.email || '-',
        hora_entrada: asistencia.hora_entrada || '-',
        hora_salida: asistencia.hora_salida || '-',
        id_matricula: usuario.dni, // Usa el ID de matrícula como identificador
      };
    });
  };

  // Cargar datos iniciales al montar el componente
  useEffect(() => {
    cargarUsuarios(); // Cargar usuarios activos
    cargarAsistencias(fecha); // Cargar asistencias para la fecha actual
  }, [fecha]);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Asistencias del Gimnasio
      </Typography>
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
                  disabled={usuario.hora_entrada !== '-'} // Habilitado solo si no hay hora de entrada
                  style={{ marginRight: '10px' }}
                >
                  Entrada
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleMarcarAsistencia(usuario.id_matricula)}
                  disabled={usuario.hora_entrada === '-' || usuario.hora_salida !== '-'} // Habilitado solo si hay hora de entrada y no hay salida
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
