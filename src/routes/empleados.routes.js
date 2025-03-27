import express from 'express';
import { agregarCuenta, obtenerCBU ,obtenerEmpleados} from "../controllers/empleados.controllers.js";

const router = express.Router();

// Ruta para agregar una cuenta a un empleado
router.post('/agregar-cuenta', agregarCuenta);

// Ruta para obtener el CBU de un empleado
router.get('/obtener-cbu', obtenerCBU);
router.get('/obtener-empleados', obtenerEmpleados);

export default router;
