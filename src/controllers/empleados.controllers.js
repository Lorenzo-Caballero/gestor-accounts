import { pool } from "../db.js";

export const agregarCuenta = (req, res) => {
    const { empleado, cuenta } = req.body;
  
    // Validar si el índice es correcto
    if (isNaN(empleado) || empleado < 1 || empleado > empleados.length) {
      return res.status(400).json({ error: "Índice de empleado inválido" });
    }
  
    // Agregar la nueva cuenta al empleado correspondiente
    empleados[empleado - 1].cbus.push({
      ...cuenta,
      ultimaLlamada: null, // Aseguramos que empiece sin fecha de llamada
    });
  
    res.json({ message: "Cuenta añadida correctamente", empleado: empleados[empleado - 1] });
  };
  export const obtenerEmpleados = async (req, res) => {
    try {
      // Consultar la base de datos para obtener los empleados
      const [rows] = await pool.query("SELECT * FROM empleados");
  
      // Si la consulta es exitosa, devolver los empleados
      res.json(rows);
    } catch (error) {
      console.error("Error al obtener empleados:", error);
      res.status(500).json({
        message: "Error interno del servidor al obtener empleados",
        error: error.message // Agregado para imprimir el mensaje específico del error
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
  