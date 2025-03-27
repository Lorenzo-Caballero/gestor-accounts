import express from 'express';
import { agregarCuenta, obtenerCBU } from "../controllers/empleados.controllers"

const router = express.Router();

// Ruta para agregar una cuenta a un empleado
router.post('/agregar-cuenta', agregarCuenta);

// Ruta para obtener el CBU de un empleado
router.get('/obtener-cbu', obtenerCBU);

export default router;
