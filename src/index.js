// index.js
import express from 'express';
import cors from 'cors';
import empleadosRoutes from './empleados.routes.js';

const app = express();
app.use(cors());

const PORT = 3003;

app.use(express.json()); // Middleware para leer JSON en el body

// Usar las rutas de empleados
app.use('/empleados', empleadosRoutes);

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
