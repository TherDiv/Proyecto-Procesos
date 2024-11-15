import express from 'express';
import cors from 'cors';
import gymRoutes from './routes/gym.routes.js'; // Importa las rutas

const app = express();

// Configura CORS si necesitas acceso desde un frontend en otro dominio
app.use(cors());

// Middleware para manejar JSON
app.use(express.json());

// Usa las rutas definidas en gymRoutes
app.use('/api', gymRoutes);

// Puerto de la aplicación (puedes cambiarlo si es necesario)
const PORT = process.env.PORT || 3000;

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
