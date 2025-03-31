import { Router } from "express";
import { agregarCuenta, obtenerCBU ,obtenerEmpleados} from "../controllers/empleados.controllers.js";

const router = Router()

router.post('/agregar-cuenta', agregarCuenta);
router.get('/obtener-cbu', obtenerCBU);
router.get('/obtener-empleados', obtenerEmpleados);

export default router;
