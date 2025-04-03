import { pool } from "../db.js";


export const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email) {
            return res.status(400).json({
                message: "Todos los campos (name, email) son obligatorios"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const [row] = await pool.query(
            "INSERT INTO users(name, email,password) VALUES(?, ?, ?)",
            [name, email, hashedPassword]);
        res.json({
            id_client: row.insertId,
            name,
            email,
            hashedPassword
        });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({
            message: "Error interno del servidor al crear usuario",
            error: error.message // Agregado para imprimir el mensaje específico del error.
        });
    }
};


export const crearCuenta = async (req, res) => {
    try {
        const { servicio, cbu, titular, id_empleado } = req.body;
console.log("info",servicio,cbu,titular);
        if (!servicio || !cbu || !titular) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        // Obtener la fecha y hora actual
        const fechaActual = new Date().toISOString().slice(0, 19).replace("T", " ");

        const [result] = await pool.query(
            "INSERT INTO cuentas (servicio, titular, cbu, date, id_empleado) VALUES (?, ?, ?, ?, ?)",
            [servicio, titular, cbu, fechaActual, id_empleado]
        );

        res.status(201).json({ 
            message: "Cuenta creada exitosamente", 
            id_cuenta: result.insertId,
            date: fechaActual
        });
    } catch (error) {
        console.error("Error al crear cuenta:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
export const obtenerCuentas = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM cuentas");
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener cuentas:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Obtener una cuenta por ID
export const obtenerCuentaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query("SELECT * FROM cuentas WHERE id_cuenta = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Cuenta no encontrada" });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error("Error al obtener cuenta por ID:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Actualizar una cuenta
export const actualizarCuenta = async (req, res) => {
    try {
        const { id } = req.params;
        const { servicio, cbu, id_empleado } = req.body;

        const [result] = await pool.query(
            "UPDATE cuentas SET servicio = ?, cbu = ?, id_empleado = ? WHERE id_cuenta = ?",
            [servicio, cbu, id_empleado, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Cuenta no encontrada" });
        }

        res.json({ message: "Cuenta actualizada correctamente" });
    } catch (error) {
        console.error("Error al actualizar cuenta:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Eliminar una cuenta
export const eliminarCuenta = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query("DELETE FROM cuentas WHERE id_cuenta = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Cuenta no encontrada" });
        }

        res.json({ message: "Cuenta eliminada correctamente" });
    } catch (error) {
        console.error("Error al eliminar cuenta:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
