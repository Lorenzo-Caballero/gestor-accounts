import { pool } from "../db.js";

export const crearEmpleado = async (req, res) => {
    try {
        const { nombre } = req.body;

        if (!nombre) {
            return res.status(400).json({
                message: "El campo 'nombre' es obligatorio"
            });
        }

        const [empleadoResult] = await pool.query("INSERT INTO empleados (nombre) VALUES (?)", [nombre]);
        const id_empleado = empleadoResult.insertId;

        res.json({
            message: "Empleado creado correctamente",
            empleado: {
                id_empleado,
                nombre
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

export const agregarCuenta = async (req, res) => {
    try {
        const { id_empleado, id_cuenta, servicio, cbu } = req.body;

        // Validar que al menos uno de los dos (cuenta existente o nueva cuenta) esté presente
        if (!id_empleado || (!id_cuenta && (!servicio || !cbu))) {
            return res.status(400).json({
                message: "Faltan campos obligatorios: id_empleado, y (id_cuenta o servicio y cbu)"
            });
        }

        // Verificar que el empleado existe
        const [empleado] = await pool.query("SELECT * FROM empleados WHERE id = ?", [id_empleado]);
        if (empleado.length === 0) {
            return res.status(404).json({ message: "Empleado no encontrado" });
        }

        let cuentaId = id_cuenta;

        // Si no se proporcionó una cuenta existente, crear una nueva cuenta
        if (!id_cuenta) {
            // Validar que se recibieron los datos de la nueva cuenta (servicio y cbu)
            if (!servicio || !cbu) {
                return res.status(400).json({ message: "Servicio y CBU son obligatorios para crear una nueva cuenta" });
            }

            // Insertar la nueva cuenta
            const [cuentaResult] = await pool.query(
                "INSERT INTO cuentas (servicio, cbu, date, id_empleado) VALUES (?, ?, NOW(), ?)",
                [servicio, cbu, id_empleado]
            );
            cuentaId = cuentaResult.insertId;
        }

        // Asociar la cuenta (ya sea existente o recién creada) al empleado
        await pool.query(
            "INSERT INTO empleados_cuentas (id_empleado, id_cuenta) VALUES (?, ?)",
            [id_empleado, cuentaId]
        );

        // Obtener los detalles de la cuenta asociada
        const [cuenta] = await pool.query("SELECT * FROM cuentas WHERE id = ?", [cuentaId]);

        res.json({
            message: "Cuenta asociada correctamente",
            cuenta: {
                id: cuenta.id,
                servicio: cuenta.servicio,
                cbu: cuenta.cbu,
                date: cuenta.date,
                id_empleado: cuenta.id_empleado,
            }
        });
    } catch (error) {
        console.error("Error al agregar cuenta:", error);
        res.status(500).json({
            message: "Error interno del servidor al agregar cuenta",
            error: error.message
        });
    }
};


export const obtenerCBU = async (req, res) => {
    try {
        const { id_empleado } = req.query;

        if (!id_empleado) {
            return res.status(400).json({ error: "Se requiere el ID del empleado" });
        }

        const [cuentas] = await pool.query(
            "SELECT servicio, cbu FROM cuentas WHERE id_empleado = ?",
            [id_empleado]
        );

        if (cuentas.length === 0) {
            return res.status(404).json({ error: "No hay cuentas registradas para este empleado" });
        }

        const cuenta = cuentas[0];

        res.json({
            empleado: id_empleado,
            servicio: cuenta.servicio,
            cbu: cuenta.cbu
        });
    } catch (error) {
        console.error("Error al obtener CBU:", error);
        res.status(500).json({
            message: "Error interno del servidor al obtener CBU",
            error: error.message
        });
    }
};
export const obtenerEmpleadosConCuentasSimple = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                e.id AS id_empleado, 
                e.nombre, 
                c.id AS id_cuenta, 
                c.servicio, 
                c.cbu,
                c.titular,
                c.date
            FROM empleados e
            LEFT JOIN cuentas c ON e.id = c.id_empleado
        `);

        res.json(rows);
    } catch (error) {
        console.error("Error al obtener empleados con cuentas:", error);
        res.status(500).json({ 
            message: "Error interno del servidor al obtener empleados con cuentas", 
            error: error.message 
        });
    }
};


export const obtenerEmpleados = async (req, res) => {
    try {
        const [empleados] = await pool.query("SELECT * FROM empleados");

        if (empleados.length === 0) {
            return res.status(404).json({ message: "No hay empleados registrados" });
        }

        const empleadosConCuentas = await Promise.all(
            empleados.map(async (empleado) => {
                const [cuentas] = await pool.query(
                    "SELECT id, servicio, cbu, date FROM cuentas WHERE id_empleado = ?",
                    [empleado.id_empleado]
                );

                return {
                    ...empleado,
                    cuentas
                };
            })
        );

        res.json({ empleados: empleadosConCuentas });

    } catch (error) {
        console.error("Error al obtener empleados:", error);
        res.status(500).json({
            message: "Error interno del servidor al obtener empleados",
            error: error.message
        });
    }
};

export const actualizarEmpleado = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        const [result] = await pool.query(
            "UPDATE empleados SET nombre = ? WHERE id = ?",
            [nombre, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Empleado no encontrado" });
        }

        res.json({ message: "Empleado actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar empleado:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

export const eliminarEmpleado = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query("DELETE FROM empleados WHERE id= ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Empleado no encontrado" });
        }

        res.json({ message: "Empleado eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar empleado:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};
