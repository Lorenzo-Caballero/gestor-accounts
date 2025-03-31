import { pool } from "../db.js";

export const crearEmpleado = async (req, res) => {
    try {
        const { nombre, servicio, cbu } = req.body;

        // Validar que todos los campos requeridos están presentes
        if (!nombre || !servicio || !cbu) {
            return res.status(400).json({
                message: "Todos los campos (nombre, servicio, cbu) son obligatorios"
            });
        }

        // Insertar el empleado en la base de datos
        const [empleadoResult] = await pool.query("INSERT INTO empleados (nombre) VALUES (?)", [nombre]);
        const id_empleado = empleadoResult.insertId;

        // Insertar la cuenta asociada al empleado
        await pool.query("INSERT INTO cuentas (servicio, cbu, id_empleado) VALUES (?, ?, ?)", [servicio, cbu, id_empleado]);

        res.json({
            message: "Empleado y cuenta creados correctamente",
            empleado: {
                id_empleado,
                nombre,
                cuenta: {
                    servicio,
                    cbu
                }
            }
        });
    } catch (error) {
        console.error("Error al crear empleado:", error);
        res.status(500).json({
            message: "Error interno del servidor al crear empleado",
            error: error.message
        });
    }
};

  export const obtenerCBU = (req, res) => {
    const empleadoIndex = parseInt(req.query.empleado);
  
    // Validar si el índice es correcto
    if (isNaN(empleadoIndex) || empleadoIndex < 1 || empleadoIndex > empleados.length) {
      return res.status(400).json({ error: "Índice de empleado inválido" });
    }
  
    const empleado = empleados[empleadoIndex - 1];
    const cuenta = empleado.cbus[empleado.indice];
  
    // Registrar la fecha y hora de la última llamada
    cuenta.ultimaLlamada = new Date().toLocaleString();
  
    // Mover al siguiente CBU dentro del mismo agente
    empleado.indice = (empleado.indice + 1) % empleado.cbus.length;
  
    res.json({
      empleado: empleado.nombre,
      servicio: cuenta.servicio,
      cbu: cuenta.cbu,
      titular: cuenta.titular,
      ultimaLlamada: cuenta.ultimaLlamada
    });
  };
  