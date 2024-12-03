import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Snackbar, CircularProgress } from '@mui/material';
import { obtenerTrabajadores, crearTrabajador } from '../api/api'; // Importar las funciones de la API
import AddWorkerDialog from '../Components/AddWorkerDialog'; // Importar el componente de diálogo para añadir trabajador

const Trabajadores = () => {
  const [trabajadores, setTrabajadores] = useState([]); // Estado para almacenar los trabajadores
  const [openDialog, setOpenDialog] = useState(false); // Estado para controlar la apertura del diálogo
  const [loading, setLoading] = useState(false); // Estado para controlar la carga de los trabajadores
  const [errorMessage, setErrorMessage] = useState(''); // Para mostrar mensajes de error

  useEffect(() => {
    cargarTrabajadores(); // Llamar la función al montar el componente
  }, []);

  // Función para cargar los trabajadores
  const cargarTrabajadores = async () => {
    setLoading(true); // Activamos el estado de carga
    try {
      const data = await obtenerTrabajadores();
      setTrabajadores(data); // Guardamos todos los trabajadores
    } catch (error) {
      console.error('Error al cargar trabajadores:', error);
      setErrorMessage('Error al cargar los trabajadores');
    } finally {
      setLoading(false); // Desactivamos el estado de carga
    }
  };

  // Función para manejar la creación de un trabajador
  const handleCrearTrabajador = async (nuevoTrabajador) => {
    try {
      await crearTrabajador({
        ...nuevoTrabajador,
        id_gimnasio: 1, // Asegúrate de tener un ID de gimnasio
      });
      cargarTrabajadores(); // Recargamos la lista de trabajadores después de crear uno nuevo
      setOpenDialog(false); // Cerramos el diálogo
      setErrorMessage(''); // Limpiamos cualquier mensaje de error anterior
    } catch (error) {
      console.error('Error al crear trabajador:', error.message);
      setErrorMessage('Error al crear el trabajador');
    }
  };

  return (
    <div>
      <h1>Lista de Trabajadores</h1>
      <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
        Añadir Trabajador
      </Button>

      {/* Tabla de trabajadores */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Apellido</TableCell>
            <TableCell>Cargo</TableCell>
            <TableCell>Tipo de Sueldo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {trabajadores.map((trabajador, index) => (
            <TableRow key={index}>
              <TableCell>{trabajador.nombres}</TableCell>
              <TableCell>{trabajador.apellidos}</TableCell>
              <TableCell>{trabajador.cargo}</TableCell>
              <TableCell>{trabajador.tipo_sueldo}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Mostrar errores si los hay */}
      {errorMessage && (
        <Snackbar
          open={true}
          message={errorMessage}
          onClose={() => setErrorMessage('')}
          autoHideDuration={3000}
        />
      )}

      {/* Diálogo para añadir nuevo trabajador */}
      <AddWorkerDialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        onCrear={handleCrearTrabajador} 
      />
    </div>
  );
};

export default Trabajadores;
