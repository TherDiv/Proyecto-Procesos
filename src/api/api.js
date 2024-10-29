// api.js
import axios from 'axios';
import dayjs from 'dayjs';

const BASE_URL = 'https://procesos-backend.vercel.app/api';

// Función para obtener la lista de asistencias en una fecha específica
export const obtenerAsistencias = async (date) => {
    try {
      // Usamos params para pasar el parámetro en un GET
      const response = await axios.get(`${BASE_URL}/obtener_asistencias`, {
        params: { date },
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener asistencias:', error);
      throw error;
    }
  };
  
  // Función para registrar o marcar una asistencia (entrada o salida)
  export const marcarAsistencia = async (id_matricula, date, time) => {
    try {
      const response = await axios.post(`${BASE_URL}/marcar_asistencia`, {
        id_matricula,
        date,
        time,
      });
      return response.data;
    } catch (error) {
      console.error('Error al marcar asistencia:', error);
      throw error;
    }
  };

// Función para obtener todos los usuarios registrados en el sistema
export const obtenerUsuarios = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/obtener_usuario`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener usuarios:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al obtener usuarios');
  }
};

// Función para crear un nuevo usuario
export const crearUsuario = async (nuevoUsuario) => {
  try {
    // Asegurarse de que las fechas estén en formato "YYYY-MM-DD"
    const formattedUser = {
      ...nuevoUsuario,
      inicio_membresia: dayjs(nuevoUsuario.inicio_membresia).format('YYYY-MM-DD'),
      fin_membresia: dayjs(nuevoUsuario.fin_membresia).format('YYYY-MM-DD'),
    };
    
    const response = await axios.post(`${BASE_URL}/crear_usuario`, formattedUser);
    return response.data;
  } catch (error) {
    console.error("Error al crear usuario:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al crear usuario');
  }
};
