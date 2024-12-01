import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Select, Box, CircularProgress, Snackbar } from '@mui/material';
import axios from 'axios';

const Trabajadores = () => {
  const [trabajadores, setTrabajadores] = useState([]); // Estado para almacenar los trabajadores
  const [nuevoTrabajador, setNuevoTrabajador] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    cargo: '',
    tipo_sueldo: '',
    sueldo: '',
    id_trabajador: '', // Para seleccionar el trabajador
  });
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
      const response = await axios.get('https://procesos-backend.vercel.app/api/trabajadores');
      setTrabajadores(response.data); // Guardamos todos los trabajadores
    } catch (error) {
      console.error('Error al cargar trabajadores:', error);
      setErrorMessage('Error al cargar los trabajadores');
    } finally {
      setLoading(false); // Desactivamos el estado de carga
    }
  };

  // Función para manejar la creación de un trabajador
  const handleCrearTrabajador = async () => {
    try {
      // Validación básica de los campos
      if (!nuevoTrabajador.nombres || !nuevoTrabajador.apellidos || !nuevoTrabajador.email || !nuevoTrabajador.cargo || !nuevoTrabajador.sueldo) {
        setErrorMessage('Por favor, completa todos los campos.');
        return;
      }

      await axios.post('https://procesos-backend.vercel.app/api/trabajadores', {
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

  // Manejo de los cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoTrabajador((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h1>Lista de Trabajadores</h1>
      <Box display="flex" justifyContent="flex-start" marginBottom={2}>
        <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
          Añadir Trabajador
        </Button>
      </Box>


      {/* Tabla de trabajadores */}
      <Table>
        <TableHead>
          <TableRow >
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

      {/* Diálogo para añadir nuevo trabajador */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Añadir Nuevo Trabajador</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              name="nombres"
              label="Nombres"
              value={nuevoTrabajador.nombres}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              name="apellidos"
              label="Apellidos"
              value={nuevoTrabajador.apellidos}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              name="email"
              label="Email"
              value={nuevoTrabajador.email}
              onChange={handleChange}
              fullWidth
            />
            <Select
              name="cargo"
              value={nuevoTrabajador.cargo}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="entrenador">Entrenador</MenuItem>
              <MenuItem value="limpieza">Limpieza</MenuItem>
              <MenuItem value="administrador">Administrador</MenuItem>
              <MenuItem value="recepcionista">Recepcionista</MenuItem>
            </Select>
            <Select
              name="tipo_sueldo"
              value={nuevoTrabajador.tipo_sueldo}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="fijo">Fijo</MenuItem>
              <MenuItem value="por_hora">Por Hora</MenuItem>
            </Select>
            <TextField
              name="sueldo"
              label="Sueldo"
              type="number"
              value={nuevoTrabajador.sueldo}
              onChange={handleChange}
              fullWidth
            />

            {/* ComboBox de Trabajadores */}
            <Select name="id_trabajador" value={nuevoTrabajador.id_trabajador} onChange={handleChange} fullWidth>
              {loading ? (
                <MenuItem disabled>
                  <CircularProgress size={24} />
                </MenuItem>
              ) : (
                trabajadores.map((trabajador) => (
                  <MenuItem key={trabajador.id_trabajador} value={trabajador.id_trabajador}>
                    {trabajador.nombres} {trabajador.apellidos}
                  </MenuItem>
                ))
              )}
            </Select>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleCrearTrabajador} color="primary">
            Añadir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mostrar errores si los hay */}
      {errorMessage && (
        <Snackbar
          open={true}
          message={errorMessage}
          onClose={() => setErrorMessage('')}
          autoHideDuration={3000}
        />
      )}
    </div>
  );
};

export default Trabajadores;
