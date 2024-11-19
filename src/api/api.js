import axios from 'axios';
import dayjs from 'dayjs';

const BASE_URL = 'https://procesos-backend.vercel.app/api';

// **Asistencias**

// Función para obtener asistencias en una fecha específica
export const obtenerAsistencias = async (date) => {
  try {
    const response = await axios.get(`${BASE_URL}/obtener_asistencias`, {
      params: { date }, // Enviamos la fecha como parámetro
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener asistencias:', error.message);
    throw error;
  }
};

// Función para marcar asistencia (entrada o salida)
export const marcarAsistencia = async (id_matricula, date, time) => {
  try {
    const response = await axios.post(`${BASE_URL}/marcar_asistencia`, {
      id_matricula,
      date,
      time,
    });
    return response.data;
  } catch (error) {
    console.error('Error al marcar asistencia:', error.message);
    throw error;
  }
};

// **Usuarios**

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

// **Actividades**

// Función para obtener todas las actividades
export const obtenerActividades = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/actividades`);
    return response.data.actividades;
  } catch (error) {
    console.error('Error al obtener actividades:', error.message);
    throw error;
  }
};

// Función para crear una nueva actividad
export const crearActividad = async (actividad) => {
  try {
    const response = await axios.post(`${BASE_URL}/actividades`, actividad);
    return response.data;
  } catch (error) {
    console.error('Error al crear actividad:', error.message);
    throw error;
  }
};

// Función para eliminar una actividad
export const eliminarActividad = async (id_actividad) => {
  try {
    const response = await axios.delete(`${BASE_URL}/actividades`, {
      data: { id_actividad },
    });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar actividad:', error.message);
    throw error;
  }
};

// **Trabajadores**

// Función para obtener todos los trabajadores
export const obtenerTrabajadores = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/trabajadores`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener trabajadores:', error.message);
    throw error;
  }
};

// Función para crear un nuevo trabajador
export const crearTrabajador = async (trabajador) => {
  try {
    const response = await axios.post(`${BASE_URL}/trabajadores`, trabajador);
    return response.data;
  } catch (error) {
    console.error('Error al crear trabajador:', error.message);
    throw error;
  }
};
