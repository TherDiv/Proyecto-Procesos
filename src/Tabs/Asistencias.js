import React, { useState, useEffect } from 'react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { obtenerAsistencias, marcarAsistencia } from '../api/api';

const Asistencias = () => {
  const [fecha, setFecha] = useState(dayjs().format('YYYY-MM-DD'));
  const [asistencias, setAsistencias] = useState([]);

  // Cargar asistencias desde el backend
  const cargarAsistencias = async (date) => {
    try {
      const data = await obtenerAsistencias(date);
      setAsistencias(data);
    } catch (error) {
      console.error("Error al cargar asistencias:", error.message);
    }
  };

  // Manejar el marcado de entrada
  const handleMarcarEntrada = async (id_matricula) => {
    try {
      const time = dayjs().format('HH:mm');
      await marcarAsistencia(id_matricula, fecha, time);
      cargarAsistencias(fecha); // Recargar asistencias
    } catch (error) {
      console.error("Error al marcar la entrada:", error.message);
    }
  };

  // Manejar el marcado de salida
  const handleMarcarSalida = async (id_matricula) => {
    try {
      const time = dayjs().format('HH:mm');
      await marcarAsistencia(id_matricula, fecha, time);
      cargarAsistencias(fecha); // Recargar asistencias
    } catch (error) {
      console.error("Error al marcar la salida:", error.message);
    }
  };

  useEffect(() => {
    cargarAsistencias(fecha);
  }, [fecha]);

  return (
    <div>
      <h2>Módulo de Asistencias</h2>
      <div>
        <label>Seleccionar Fecha:</label>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={dayjs(fecha)}
            onChange={(newValue) => {
              if (newValue) {
                setFecha(newValue.format('YYYY-MM-DD'));
              }
            }}
          />
        </LocalizationProvider>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID Usuario</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Hora Entrada</th>
            <th>Hora Salida</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {asistencias.length > 0 ? (
            asistencias.map((asistencia) => (
              <tr key={asistencia.id_usuario}>
                <td>{asistencia.id_usuario}</td>
                <td>{asistencia.nombre}</td>
                <td>{asistencia.apellido}</td>
                <td>{asistencia.email}</td>
                <td>{asistencia.hora_entrada || '-'}</td>
                <td>{asistencia.hora_salida || '-'}</td>
                <td>
                  <button 
                    onClick={() => handleMarcarEntrada(asistencia.id_matricula)} 
                    disabled={!!asistencia.hora_entrada}
                  >
                    Entrada
                  </button>
                  <button 
                    onClick={() => handleMarcarSalida(asistencia.id_matricula)} 
                    disabled={!asistencia.hora_entrada || !!asistencia.hora_salida}
                  >
                    Salida
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No hay asistencias para la fecha seleccionada</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Asistencias;
