import { Router } from "express";
import {
  agregarCuenta,
  obtenerCBU,
  obtenerEmpleados,
  crearEmpleado,
  actualizarEmpleado,
  obtenerEmpleadosConCuentasSimple,
  eliminarEmpleado
} from "../controllers/empleados.controllers.js";

const router = Router();

// CRUD de empleados
router.get('/empleados-cuentas', obtenerEmpleadosConCuentasSimple);
router.post('/empleados', crearEmpleado);             // Crear empleado
router.get('/obtener-empleados', obtenerEmpleados);   // Leer empleados con cuentas
router.put('/empleados/:id', actualizarEmpleado);     // Actualizar empleado
router.delete('/empleados/:id', eliminarEmpleado);    // Eliminar empleado

// Cuentas
router.post('/agregar-cuenta', agregarCuenta);        // Agregar cuenta
router.get('/obtener-cbu', obtenerCBU);               // Obtener CBU de empleado

export default router;
