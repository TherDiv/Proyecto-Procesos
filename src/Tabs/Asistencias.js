import React, { useEffect, useState } from 'react';
import { obtenerAsistencias, marcarAsistencia } from '../api/api';
import dayjs from 'dayjs';

const Asistencias = () => {
  const [asistencias, setAsistencias] = useState([]);
  const [fecha, setFecha] = useState(dayjs().format('YYYY-MM-DD')); // Inicializamos con la fecha actual en formato YYYY-MM-DD

  // Cargar asistencias al montar el componente o cuando la fecha cambie
  useEffect(() => {
    const cargarAsistencias = async () => {
      try {
        const data = await obtenerAsistencias(fecha);
        setAsistencias(data);
      } catch (error) {
        console.error("Error al cargar asistencias:", error);
      }
    };
    cargarAsistencias();
  }, [fecha]);

  // Manejar cambio de fecha y formatearla en YYYY-MM-DD
  const handleFechaChange = (event) => {
    const selectedDate = dayjs(event.target.value).format('YYYY-MM-DD');
    setFecha(selectedDate);
  };

  // Función para marcar asistencia (entrada o salida)
  const handleMarcarAsistencia = async (id_matricula) => {
    const currentTime = dayjs().format('HH:mm');
    try {
      const response = await marcarAsistencia(id_matricula, fecha, currentTime);
      alert(response.message);
      // Recargar la lista de asistencias después de marcar
      const data = await obtenerAsistencias(fecha);
      setAsistencias(data);
    } catch (error) {
      console.error("Error al marcar asistencia:", error);
    }
  };

  return (
    <div>
      <h1>Módulo de Asistencias</h1>
      <label>
        Seleccionar Fecha:
        <input
          type="date"
          value={fecha}
          onChange={handleFechaChange}
        />
      </label>
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
          {asistencias.map((asistencia) => (
            <tr key={asistencia.id_usuario}>
              <td>{asistencia.id_usuario}</td>
              <td>{asistencia.nombre}</td>
              <td>{asistencia.apellido}</td>
              <td>{asistencia.email}</td>
              <td>{asistencia.hora_entrada || "No registrada"}</td>
              <td>{asistencia.hora_salida || "No registrada"}</td>
              <td>
                <button onClick={() => handleMarcarAsistencia(asistencia.id_matricula)}>
                  Marcar Asistencia
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Asistencias;
