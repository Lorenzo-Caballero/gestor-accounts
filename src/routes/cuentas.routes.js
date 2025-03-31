import { Router } from "express";
import { 
    crearCuenta, 
    obtenerCuentas, 
    obtenerCuentaPorId, 
    actualizarCuenta, 
    eliminarCuenta 
} from "../controllers/cuentas.controllers.js";

const router = Router();

// Rutas para CRUD de cuentas
router.post("/cuentas", crearCuenta);
router.get("/cuentas", obtenerCuentas);
router.get("/cuentas/:id", obtenerCuentaPorId);
router.put("/cuentas/:id", actualizarCuenta);
router.delete("/cuentas/:id", eliminarCuenta);

export default router;
