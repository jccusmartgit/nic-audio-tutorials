import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

const router = express.Router();

// Configurar __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rutas absolutas correctas
const filePath = path.join(__dirname, "..", "registers.json");
const mediaPath = path.join(__dirname, "..", "media");

// Si la carpeta no existe en Render, la creamos
if (!fs.existsSync(mediaPath)) {
  fs.mkdirSync(mediaPath, { recursive: true });
}

// Configurar Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, mediaPath);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${file.originalname}`;
    cb(null, unique);
  },
});
const upload = multer({ storage });

/* ============================
   GET: Obtener todos los tutoriales
============================ */
router.get("/", (req, res) => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    const tutorials = JSON.parse(data);
    res.json(tutorials);
  } catch (error) {
    console.error("Error leyendo registros:", error);
    res.status(500).json({ error: "Error al leer registros" });
  }
});

/* ============================
   POST: Agregar nuevo tutorial
============================ */
router.post("/", upload.single("archivo"), (req, res) => {
  try {
    const { titulo, descripcion } = req.body;
    const archivo = req.file?.filename;

    if (!titulo || !descripcion || !archivo) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    const data = fs.readFileSync(filePath, "utf8");
    const tutorials = JSON.parse(data);

    const nuevoTutorial = {
      id: Date.now(),
      titulo,
      descripcion,
      media: `/media/${archivo}`,
    };

    tutorials.push(nuevoTutorial);
    fs.writeFileSync(filePath, JSON.stringify(tutorials, null, 2), "utf8");

    res.status(201).json(nuevoTutorial);
  } catch (error) {
    console.error("Error al guardar:", error);
    res.status(500).json({ error: "Error al guardar registro" });
  }
});

/* ============================
   DELETE: Eliminar un tutorial
============================ */
router.delete("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);

    const data = fs.readFileSync(filePath, "utf8");
    let tutorials = JSON.parse(data);

    const tutorial = tutorials.find((t) => t.id === id);
    if (!tutorial) return res.status(404).json({ error: "No existe el tutorial" });

    // Eliminar archivo físico
    const audioPath = path.join(__dirname, "..", tutorial.media);
    if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);

    // Eliminar del JSON
    tutorials = tutorials.filter((t) => t.id !== id);
    fs.writeFileSync(filePath, JSON.stringify(tutorials, null, 2), "utf8");

    res.json({ message: "Tutorial eliminado", id });
  } catch (error) {
    console.error("Error al eliminar:", error);
    res.status(500).json({ error: "Error al eliminar" });
  }
});

export default router;
