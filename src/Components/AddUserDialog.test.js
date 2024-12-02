import { render, screen, fireEvent, act } from '@testing-library/react';
import AddUserDialog from './AddUserDialog';
import dayjs from 'dayjs';

// Mocking the functions
const mockOnClose = jest.fn();
const mockOnCrear = jest.fn();

describe('AddUserDialog', () => {

  beforeEach(() => {
    jest.clearAllMocks(); // Limpiar mocks antes de cada prueba
  });

  test('should render the AddUserDialog and check initial inputs', () => {
    render(<AddUserDialog open={true} onClose={mockOnClose} onCrear={mockOnCrear} />);

    // Verificar si los campos están presentes en el formulario
    expect(screen.getByLabelText(/Apellidos/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombres/)).toBeInTheDocument();
    expect(screen.getByLabelText(/DNI/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo Electrónico/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Teléfono/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Dirección/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Inicio de Membresía/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tipo de Membresía/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Fin de Membresía/)).toBeInTheDocument();
  });

  test('should handle input changes correctly', () => {
    render(<AddUserDialog open={true} onClose={mockOnClose} onCrear={mockOnCrear} />);

    // Simulamos el cambio de valor de los campos
    fireEvent.change(screen.getByLabelText(/Apellidos/), { target: { value: 'Perez' } });
    fireEvent.change(screen.getByLabelText(/Nombres/), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByLabelText(/DNI/), { target: { value: '12345678' } });

    // Verificar que los valores del estado se hayan actualizado
    expect(screen.getByLabelText(/Apellidos/).value).toBe('Perez');
    expect(screen.getByLabelText(/Nombres/).value).toBe('Juan');
    expect(screen.getByLabelText(/DNI/).value).toBe('12345678');
  });

  test('should call onCrear when clicking the "Añadir Usuario" button', () => {
    render(<AddUserDialog open={true} onClose={mockOnClose} onCrear={mockOnCrear} />);

    // Simulamos los cambios en los campos
    fireEvent.change(screen.getByLabelText(/Apellidos/), { target: { value: 'Perez' } });
    fireEvent.change(screen.getByLabelText(/Nombres/), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByLabelText(/DNI/), { target: { value: '12345678' } });

    // Hacemos clic en el botón "Añadir Usuario"
    fireEvent.click(screen.getByText(/Añadir Usuario/));

    // Verificar que la función onCrear haya sido llamada
    expect(mockOnCrear).toHaveBeenCalledTimes(1);
    expect(mockOnCrear).toHaveBeenCalledWith(expect.objectContaining({
      apellido: 'Perez',
      nombre: 'Juan',
      dni: '12345678',
    }));
  });

  test('should correctly calculate the membership end date when "Tipo de Membresía" is changed', async () => {
    render(<AddUserDialog open={true} onClose={mockOnClose} onCrear={mockOnCrear} />);

    // Simulamos la selección del tipo de membresía
    fireEvent.change(screen.getByLabelText(/Tipo de Membresía/), { target: { value: 'mensual' } });

    // Esperamos un pequeño retraso si es necesario (simulación de la actualización de la fecha)
    await act(async () => {
      // Verificamos que la fecha de fin de membresía se haya actualizado correctamente
      expect(screen.getByLabelText(/Fin de Membresía/).value).toBe(dayjs().add(1, 'month').format('YYYY-MM-DD'));
    });
  });

  test('should call onClose when clicking the "Cancelar" button', () => {
    render(<AddUserDialog open={true} onClose={mockOnClose} onCrear={mockOnCrear} />);

    // Simulamos el clic en el botón "Cancelar"
    fireEvent.click(screen.getByText(/Cancelar/));

    // Verificamos que la función onClose haya sido llamada
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

});
