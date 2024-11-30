import axios from 'axios';
import dayjs from 'dayjs';

const BASE_URL = 'https://procesos-backend.vercel.app/api';

export const obtenerTrabajadores = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/trabajadores`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener trabajadores:', error.message);
    throw error;
  }
};

export const crearTrabajador = async (nuevoTrabajador) => {
  try {
    const response = await axios.post(`${BASE_URL}/trabajadores`, nuevoTrabajador);
    return response.data;
  } catch (error) {
    console.error('Error al crear trabajador:', error.message);
    throw error;
  }
};

export const obtenerAsistencias = async (date) => {
  try {
    const response = await axios.get(`${BASE_URL}/obtener_asistencias`, {
      params: { date },
    });
    console.log('Respuesta al obtener asistencias:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener asistencias:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('Detalles del error del servidor:', error.response.data);
    }
    throw error;
  }
};

export const marcarAsistencia = async (id_matricula, date, time) => {
  try {
    console.log('Enviando datos a marcar_asistencia:', { id_matricula, date, time });
    const response = await axios.post(`${BASE_URL}/marcar_asistencia`, {
      id_matricula,
      date,
      time,
    });
    console.log('Respuesta del backend (marcarAsistencia):', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al marcar asistencia:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('Detalles del error del servidor:', error.response.data);
    }
    throw error;
  }
};

export const obtenerUsuarios = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/obtener_usuario`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener usuarios:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al obtener usuarios');
  }
};

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

export const obtenerActividades = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/actividades`);
    return response.data.actividades;
  } catch (error) {
    console.error('Error al obtener actividades:', error.message);
    throw error;
  }
};

export const crearActividad = async (actividad) => {
  try {
    console.log("Datos de actividad a enviar:", actividad);
    const response = await axios.post(`${BASE_URL}/actividades`, actividad);
    return response.data;
  } catch (error) {
    console.error('Error al crear actividad:', error.message);
    throw error;
  }
};

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
