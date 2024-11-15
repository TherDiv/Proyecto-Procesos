// Tabs/Trabajadores.js
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, TextField, Select, MenuItem, InputLabel, FormControl, Box, Button } from '@mui/material';
import AddWorkerDialog from '../Components/AddWorkerDialog';

const Trabajadores = () => {
  const [search, setSearch] = useState('');
  const [salaryTypeFilter, setSalaryTypeFilter] = useState('');
  const [jobFilter, setJobFilter] = useState('');
  const [workers, setWorkers] = useState([
    { name: 'GARCÍA LÓPEZ, JUAN CARLOS', salaryType: 'Fijo', job: 'Administración' },
    { name: 'PÉREZ SÁNCHEZ, MARÍA FERNANDA', salaryType: 'Fijo', job: 'Entrenador' },
    { name: 'MARTÍNEZ RUIZ, LUIS MIGUEL', salaryType: 'Fijo', job: 'Ventas' },
    { name: 'RODRÍGUEZ DÍAZ, ANA SOFÍA', salaryType: 'Por horas', job: 'Limpieza' },
    { name: 'HERNÁNDEZ GÓMEZ, DAVID ALEJANDRO', salaryType: 'Fijo', job: 'Seguridad' },
    { name: 'FERNÁNDEZ LÓPEZ, ISABEL CRISTINA', salaryType: 'Por horas', job: 'Entrenador' },
    { name: 'RAMÍREZ PÉREZ, CARLOS ANDRÉS', salaryType: 'Fijo', job: 'Ventas' },
    { name: 'SÁNCHEZ GARCÍA, LAURA PAOLA', salaryType: 'Por horas', job: 'Profesor de baile' },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredWorkers = workers.filter((worker) =>
    worker.name.toLowerCase().includes(search.toLowerCase()) &&
    (salaryTypeFilter === '' || worker.salaryType === salaryTypeFilter) &&
    (jobFilter === '' || worker.job === jobFilter)
  );

  const handleAddWorker = (newWorker) => {
    setWorkers([...workers, newWorker]);
  };

  return (
    <div>
      <h1>Lista de Trabajadores</h1>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
        <Box display="flex" alignItems="center">
          <TextField 
            label="Buscar por nombre" 
            variant="outlined" 
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginRight: '20px', width: '200px' }}
          />
          <FormControl variant="outlined" size="small" style={{ minWidth: 150, marginRight: '20px' }}>
            <InputLabel>Tipo de Sueldo</InputLabel>
            <Select
              value={salaryTypeFilter}
              onChange={(e) => setSalaryTypeFilter(e.target.value)}
              label="Tipo de Sueldo"
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="Fijo">Fijo</MenuItem>
              <MenuItem value="Por horas">Por horas</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" size="small" style={{ minWidth: 150 }}>
            <InputLabel>Trabajo</InputLabel>
            <Select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              label="Trabajo"
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="Administración">Administración</MenuItem>
              <MenuItem value="Entrenador">Entrenador</MenuItem>
              <MenuItem value="Ventas">Ventas</MenuItem>
              <MenuItem value="Limpieza">Limpieza</MenuItem>
              <MenuItem value="Seguridad">Seguridad</MenuItem>
              <MenuItem value="Profesor de baile">Profesor de baile</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsDialogOpen(true)}
        >
          Añadir Trabajador
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombres y Apellidos</TableCell>
            <TableCell>Tipo de Sueldo</TableCell>
            <TableCell>Cargo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredWorkers.map((worker, index) => (
            <TableRow key={index}>
              <TableCell>{worker.name}</TableCell>
              <TableCell>{worker.salaryType}</TableCell>
              <TableCell>{worker.job}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AddWorkerDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCrear={handleAddWorker}
      />
    </div>
  );
};

export default Trabajadores;
