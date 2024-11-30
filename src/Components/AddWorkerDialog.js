const AddWorkerDialog = ({ open, onClose, onCrear, trabajadores }) => {
  const [newWorker, setNewWorker] = useState({
    name: '',
    salaryType: '',  // Asegúrate de que 'salaryType' sea correcto
    job: '',          // El cargo, este debería ser un campo necesario
    id_trabajador: '', // Este debería ser asignado solo si ya existe un trabajador, no debería ser editado aquí
  });

  const handleChange = (e) => {
    setNewWorker({
      ...newWorker,
      [e.target.name]: e.target.value,
    });
  };

  const handleCrear = () => {
    // Validación de campos
    if (newWorker.name && newWorker.salaryType && newWorker.job) {
      onCrear(newWorker);  // Enviar los datos al componente padre
      setNewWorker({ name: '', salaryType: '', job: '', id_trabajador: '' });
      onClose();
    } else {
      alert('Todos los campos son obligatorios');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle><strong>Añadir Nuevo Trabajador</strong></DialogTitle>
      <DialogContent>
        <TextField
          name="name"
          label="Nombres y Apellidos"
          fullWidth
          margin="dense"
          onChange={handleChange}
          value={newWorker.name}
        />
        <TextField
          select
          label="Tipo de Sueldo"
          name="salaryType"
          fullWidth
          margin="dense"
          onChange={handleChange}
          value={newWorker.salaryType}
        >
          <MenuItem value="Fijo">Fijo</MenuItem>
          <MenuItem value="Por horas">Por horas</MenuItem>
        </TextField>
        <TextField
          select
          label="Cargo"
          name="job"
          fullWidth
          margin="dense"
          onChange={handleChange}
          value={newWorker.job}
        >
          <MenuItem value="Administración">Administración</MenuItem>
          <MenuItem value="Entrenador">Entrenador</MenuItem>
          <MenuItem value="Ventas">Ventas</MenuItem>
          <MenuItem value="Limpieza">Limpieza</MenuItem>
          <MenuItem value="Seguridad">Seguridad</MenuItem>
          <MenuItem value="Profesor de baile">Profesor de baile</MenuItem>
        </TextField>

        {/* Si el trabajador ya está asignado a un id, este no debería ser editable aquí */}
        <Select
          name="id_trabajador"
          value={newWorker.id_trabajador || ''}
          onChange={handleChange}
          fullWidth
          disabled  // Esta propiedad "disabled" lo hace no editable
        >
          {trabajadores.map((trabajador) => (
            <MenuItem key={trabajador.id_trabajador} value={trabajador.id_trabajador}>
              {trabajador.nombres} {trabajador.apellidos}
            </MenuItem>
          ))}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancelar</Button>
        <Button onClick={handleCrear} color="primary">Añadir Trabajador</Button>
      </DialogActions>
    </Dialog>
  );
};
