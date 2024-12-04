// Asistencias.js
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Box, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { obtenerUsuarios, marcarAsistencia, obtenerAsistencias } from '../api/api'; // Importar las funciones necesarias

const Asistencias = () => {
  const [fecha, setFecha] = useState(dayjs().format('YYYY-MM-DD')); // Fecha seleccionada en formato YYYY-MM-DD
  const [usuarios, setUsuarios] = useState([]); // Lista de usuarios activos
  const [asistencias, setAsistencias] = useState([]); // Lista de asistencias
  const [loading, setLoading] = useState(false); // Estado para el loading

  // Cargar usuarios activos en base a la fecha seleccionada
  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const data = await obtenerUsuarios();
      const fechaSeleccionada = dayjs(fecha); // Fecha seleccionada en el DatePicker

      // Filtramos los usuarios activos y con membresía vigente en la fecha seleccionada
      const usuariosActivos = data.filter((usuario) => {
        const fechaInicio = dayjs(usuario.inicio_membresia);
        const fechaFin = dayjs(usuario.fin_membresia);
        // Verificamos si la fecha seleccionada está dentro del rango de la membresía
        return usuario.estado_membresia === 'activa' && fechaSeleccionada.isBetween(fechaInicio, fechaFin, null, '[]');
      });

      setUsuarios(usuariosActivos);
    } catch (error) {
      console.error('Error al cargar usuarios:', error.message);
    }
    setLoading(false);
  };

  // Obtener asistencias de la API
  const cargarAsistencias = async () => {
    console.log('Datos enviados para obtener asistencias:', { date: fecha });
    try {
      const data = await obtenerAsistencias({ date: fecha });
      console.log('Asistencias recibidas:', data);
      setAsistencias(data);
    } catch (error) {
      console.error('Error al cargar asistencias:', error.message);
    }
  };

  // Marcar asistencia (entrada o salida) usando la función de la API
  const handleMarcarAsistencia = async (id_matricula) => {
    try {
      const time = dayjs().format('HH:mm'); // Hora actual
      const formattedDate = dayjs(fecha).format('YYYY-MM-DD'); // Fecha formateada a YYYY-MM-DD
      console.log('Datos enviados al endpoint marcar_asistencia:', { id_matricula, date: formattedDate, time });

      // Usar la función marcarAsistencia de api.js
      const data = await marcarAsistencia(id_matricula, formattedDate, time);
      console.log('Respuesta del servidor:', data);

      // Si la respuesta fue exitosa, actualizamos las asistencias
      if (data?.message === 'Asistencia registrada con hora de entrada') {
        setAsistencias((prevAsistencias) => [
          ...prevAsistencias,
          {
            id_matricula,
            fecha: formattedDate,
            hora_entrada: time,
            hora_salida: null,
            estado_asistencia: 'presente',
          },
        ]);
      } else if (data?.message === 'Asistencia registrada con hora de salida') {
        setAsistencias((prevAsistencias) => {
          const updatedAsistencias = prevAsistencias.map((asistencia) => {
            if (asistencia.id_matricula === id_matricula && asistencia.fecha === formattedDate) {
              return { ...asistencia, hora_salida: time };
            }
            return asistencia;
          });
          return updatedAsistencias;
        });
      }
    } catch (error) {
      console.error('Error al marcar asistencia:', error.message);
    }
  };

  // Obtener tabla de asistencias, asociando asistencia a cada usuario
  const obtenerTablaAsistencias = () => {
    return usuarios.map((usuario) => {
      // Buscamos la asistencia para este usuario en la fecha seleccionada
      const asistencia = asistencias.find((a) => a.id_matricula === usuario.id_matricula);
      return {
        id_usuario: usuario.dni, // Usamos el DNI en vez de id_matricula
        nombre: usuario.nombres,
        apellido: usuario.apellidos,
        hora_entrada: asistencia?.hora_entrada || '-',
        hora_salida: asistencia?.hora_salida || '-',
        id_matricula: usuario.id_matricula,
      };
    });
  };

  // Llamadas a cargar usuarios y asistencias cuando cambia la fecha seleccionada
  useEffect(() => {
    cargarUsuarios();
    cargarAsistencias(); // Llamada para obtener asistencias
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
                setFecha(newValue.format('YYYY-MM-DD')); // Actualizar fecha seleccionada
              }
            }}
            renderInput={(props) => <TextField {...props} size="small" />}
          />
        </LocalizationProvider>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>DNI Usuario</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Apellido</TableCell>
            <TableCell>Hora Entrada</TableCell>
            <TableCell>Hora Salida</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {usuarios.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>No hay usuarios activos en esta fecha</TableCell>
            </TableRow>
          ) : (
            obtenerTablaAsistencias().map((usuario, index) => (
              <TableRow key={index}>
                <TableCell>{usuario.id_usuario}</TableCell>
                <TableCell>{usuario.nombre}</TableCell>
                <TableCell>{usuario.apellido}</TableCell>
                <TableCell>{usuario.hora_entrada}</TableCell>
                <TableCell>{usuario.hora_salida}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleMarcarAsistencia(usuario.id_matricula)}
                    disabled={usuario.hora_entrada !== '-'} // Deshabilitar si ya tiene entrada
                    style={{ marginRight: '10px' }}
                  >
                    Entrada
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleMarcarAsistencia(usuario.id_matricula)}
                    disabled={usuario.hora_entrada === '-' || usuario.hora_salida !== '-'} // Deshabilitar si no tiene entrada o ya tiene salida
                  >
                    Salida
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Asistencias;
