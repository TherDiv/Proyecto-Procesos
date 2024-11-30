import axios from 'axios';
import dayjs from 'dayjs';

const BASE_URL = 'https://procesos-backend.vercel.app/api';

// Obtener trabajadores
export const obtenerTrabajadores = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/trabajadores`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener trabajadores:', error.message);
    throw new Error(error.response?.data?.message || 'Error al obtener trabajadores');
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

// Obtener asistencias para una fecha
export const obtenerAsistencias = async (date) => {
  try {
    const response = await axios.get(`${BASE_URL}/obtener_asistencias`, {
      params: { date },
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

// Marcar asistencia de un usuario
export const marcarAsistencia = async (id_matricula, date, time) => {
  try {
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
    // Formatear las fechas de inicio y fin de membresía
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

// Obtener todas las actividades
export const obtenerActividades = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/actividades`);
    console.log('Respuesta de obtener actividades:', response);  // Ver la respuesta completa
    return response.data.actividades;
  } catch (error) {
    console.error('Error al obtener actividades:', error.message);
    if (error.response) {
      console.error('Detalles del error:', error.response.data);  // Detalles del error
    }
    throw new Error(error.response?.data?.message || 'Error al obtener actividades');
  }
};


// Crear una nueva actividad
export const crearActividad = async (actividad) => {
  try {
    // Asegúrate de que las fechas están correctamente formateadas
    const actividadFormateada = {
      ...actividad,
      horarios: actividad.horarios.map((horario) => ({
        ...horario,
        fecha: dayjs(horario.fecha).toISOString(), // Convertir fecha al formato ISO
        hora_inicio: dayjs(horario.hora_inicio).toISOString(), // Formatear hora de inicio
        hora_fin: dayjs(horario.hora_fin).toISOString(), // Formatear hora de fin
      })),
    };

    console.log("Datos de actividad a enviar:", actividadFormateada);

    const response = await axios.post(`${BASE_URL}/actividades`, actividadFormateada);
    return response.data;
  } catch (error) {
    console.error('Error al crear actividad:', error.message);
    throw new Error(error.response?.data?.message || 'Error al crear actividad');
  }
};

// Eliminar actividad por ID
export const eliminarActividad = async (id_actividad) => {
  try {
    const response = await axios.delete(`${BASE_URL}/actividades`, {
      data: { id_actividad },
    });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar actividad:', error.message);
    throw new Error(error.response?.data?.message || 'Error al eliminar actividad');
  }
};
