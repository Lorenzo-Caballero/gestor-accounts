import multer from "multer";
import sharp from "sharp";
import { pool } from "../db.js";

// Configuración de multer para almacenar la imagen en memoria
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        // Acepta solo imágenes
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Solo se permiten imágenes"));
        }
        cb(null, true);
    }
});

// Middleware para manejar la subida de imágenes
export const uploadMiddleware = (req, res, next) => {
    upload.single("image")(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ message: "Error en la carga del archivo", error: err.message });
        } else if (err) {
            return res.status(500).json({ message: "Error desconocido", error: err.message });
        }
        next();
    });
};

export const createDesigns = async (req, res) => {
    try {
        const { name, price } = req.body;
        const file = req.file;

        if (!name || !price || !file) {
            return res.status(400).json({ message: "Todos los campos son obligatorios!" });
        }

        // Comprimir la imagen con sharp
        const compressedImageBuffer = await sharp(file.buffer)
            .jpeg({ quality: 70 })
            .toBuffer();

        const compressedImageBase64 = compressedImageBuffer.toString("base64");

        const imageObject = {
            fileName: file.originalname,
            contentType: file.mimetype,
            size: file.size,
            data: compressedImageBase64,
        };

        const [row] = await pool.query(
            "INSERT INTO designs (name, price, images) VALUES (?, ?, ?)",
            [name, price, JSON.stringify(imageObject)]
        );

        res.json({
            id: row.insertId,
            name,
            price,
            images: imageObject,
        });
    } catch (error) {
        console.error("Error al crear el diseño:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

export const getDesigns = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM designs");

        const designs = rows.map((row) => {
            try {
                if (row.images && typeof row.images === "string") {
                    row.images = JSON.parse(row.images); // Convertir solo si es string
                }
            } catch (error) {
                console.error("Error al parsear JSON de images:", error);
                row.images = null; // Evitar que la app se rompa
            }
            return row;
        });

        res.json(designs);
    } catch (error) {
        console.error("Error al obtener designs:", error);
        res.status(500).json({
            message: "Error interno del servidor al obtener designs"
        });
    }
};

export const getDesignsById = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM designs WHERE id = ?", [req.params.id]);

        if (rows.length <= 0) {
            return res.status(404).json({ message: "designs no encontrado" });
        }

        const design = rows[0];
        if (design.images) {
            design.images = JSON.parse(design.images);
        }

        res.json(design);
    } catch (error) {
        console.error("Error al buscar designs por ID:", error);
        res.status(500).json({
            message: "Error interno del servidor al buscar designs por ID"
        });
    }
};

export const updateDesigns = async (req, res) => {
    try {
        const { id, name, price, image } = req.body;

        const [existingRows] = await pool.query("SELECT * FROM designs WHERE id = ?", [id]);
        if (existingRows.length <= 0) {
            return res.status(404).json({
                message: "designs no encontrado"
            });
        }

        let updatedImage = image;
        if (updatedImage && typeof updatedImage === "string") {
            updatedImage = JSON.parse(updatedImage); // Si es cadena JSON, convertirlo a objeto
        }

        await pool.query("UPDATE designs SET name=?, price=?, images=? WHERE id=?",
            [name, price, updatedImage ? JSON.stringify(updatedImage) : null, id]);

        res.json({
            message: "designs actualizado correctamente"
        });
    } catch (error) {
        console.error("Error al actualizar designs:", error);
        res.status(500).json({
            message: "Error interno del servidor al actualizar designs"
        });
    }
};

export const deleteDesigns = async (req, res) => {
    try {
        const designsId = req.params.id;
        const [existingRows] = await pool.query("SELECT * FROM designs WHERE id = ?", [designsId]);
        if (existingRows.length <= 0) {
            return res.status(404).json({
                message: "designs no encontrado"
            });
        }

        await pool.query("DELETE FROM designs WHERE id = ?", [designsId]);
        res.json({
            message: "designs eliminado correctamente"
        });
    } catch (error) {
        console.error("Error al eliminar designs:", error);
        res.status(500).json({
            message: "Error interno del servidor al eliminar designs"
        });
    }
};
