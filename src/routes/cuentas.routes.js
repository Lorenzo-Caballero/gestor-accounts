import { Router } from "express";
import { 
    crearCuenta, 
    obtenerCuentas, 
    obtenerCuentaPorId, 
    actualizarCuenta, 
    eliminarCuenta, obtenerCuentasConNombreEmpleado,
    obtenerCuentasConEmpleados
} from "../controllers/cuentas.controller.js";

const router = Router();

// Rutas para CRUD de cuentas
router.get("/cuentas-con-nombre", obtenerCuentasConNombreEmpleado);

router.post("/cuentas", crearCuenta);                    // Crear cuenta
router.get("/cuentas", obtenerCuentas);                  // Obtener todas las cuentas
router.get("/cuentas/:id", obtenerCuentaPorId);          // Obtener una cuenta por ID
router.put("/cuentas/:id", actualizarCuenta);            // Actualizar una cuenta
router.delete("/cuentas/:id", eliminarCuenta);           // Eliminar una cuenta

// Cuentas + Empleados
router.get("/cuentas-empleados", obtenerCuentasConEmpleados); // Obtener cuentas con info del empleado

export default router;
