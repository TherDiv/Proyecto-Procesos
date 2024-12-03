import axios from 'axios';
import dayjs from 'dayjs';

const BASE_URL = 'https://procesos-backend.vercel.app/api';

// Obtener trabajadores
export const obtenerTrabajadores = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/trabajadores`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener trabajadores:', error);
    throw error;
  }
};

// Crear un nuevo trabajador
export const crearTrabajador = async (nuevoTrabajador) => {
  try {
    const response = await axios.post(`${BASE_URL}/trabajadores`, nuevoTrabajador);
    return response.data;
  } catch (error) {
    console.error('Error al crear trabajador:', error.message);
    throw new Error(error.response?.data?.message || 'Error al crear trabajador');
  }
};

export const obtenerAsistencias = async (date) => {
  try {
    const response = await axios.post(`${BASE_URL}/obtener_asistencias`, {
      date, // Pasar la fecha en el cuerpo de la solicitud
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener asistencias:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('Detalles del error del servidor:', error.response.data);
    }
    throw new Error(error.response?.data?.message || 'Error al obtener asistencias');
  }
};

// Marcar asistencia de un usuario (POST)
// Marcar asistencia de un usuario
export const marcarAsistencia = async (id_matricula, date, time) => {
  try {
    if (!id_matricula || isNaN(id_matricula)) {
      throw new Error('El id_matricula debe ser un número válido');
    }

    console.log('Enviando datos a marcar_asistencia:', { id_matricula, date, time });

    const response = await axios.post(`${BASE_URL}/marcar_asistencia`, {
      id_matricula,
      date,
      time,
    });
    return response.data;
  } catch (error) {
    console.error('Error al marcar asistencia:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('Detalles del error del servidor:', error.response.data);
    }
    throw new Error(error.response?.data?.message || 'Error al marcar asistencia');
  }
};



// Obtener todos los usuarios
export const obtenerUsuarios = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/obtener_usuario`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener usuarios:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al obtener usuarios');
  }
};

// Crear un nuevo usuario
export const crearUsuario = async (nuevoUsuario) => {
  try {
    const formattedUser = {
      ...nuevoUsuario,
      inicio_membresia: dayjs(nuevoUsuario.inicio_membresia).format('YYYY-MM-DD'),
      fin_membresia: dayjs(nuevoUsuario.fin_membresia).format('YYYY-MM-DD'),
    };

    const response = await axios.post(`${BASE_URL}/crear_usuario`, formattedUser);
    return response.data;
  } catch (error) {
    console.error('Error al crear usuario:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al crear usuario');
  }
};

// Obtener actividades
export const obtenerActividades = async () => {
  try {
    const url = `${BASE_URL}/actividades`; // Usar BASE_URL correctamente
    console.log('URL de la API:', url); // Verificar la URL
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error al obtener actividades:', error);
    throw error;
  }
};

// Crear actividad
export const crearActividad = async (newActivity) => {
  try {
    console.log('Enviando actividad:', newActivity); // Verificar los datos antes de enviarlos
    const response = await axios.post(`${BASE_URL}/actividades`, newActivity); // Usar BASE_URL
    console.log('Respuesta de la API:', response); // Verificar la respuesta
    return response.data;
  } catch (error) {
    console.error('Error al crear actividad:', error.response?.data || error.message); // Ver detalle del error
    if (error.response?.data) {
      console.error('Detalles del error del servidor:', error.response.data);
    }
    throw new Error(error.response?.data?.message || 'Error al crear actividad');
  }
};

// Eliminar actividad por ID
export const eliminarActividad = async (id_actividad) => {
  try {
    const response = await axios.delete(`${BASE_URL}/actividades/${id_actividad}`); // ID se pasa directamente en la URL
    return response.data;
  } catch (error) {
    console.error('Error al eliminar actividad:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al eliminar actividad');
  }
};