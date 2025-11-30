import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

const router = express.Router();

// Configurar __dirname correctamente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Ruta absoluta hacia registers.json y carpeta media
const filePath = path.join(__dirname, "..", "registers.json");
const mediaPath = path.join(__dirname, "..", "media");

// Crear carpeta media si no existe
if (!fs.existsSync(mediaPath)) {
  fs.mkdirSync(mediaPath, { recursive: true });
}

// Configurar Multer para guardar los audios
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, mediaPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

/* ============================
    Obtener todos los tutoriales
============================ */
/*router.get("/", (req, res) => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    const tutorials = JSON.parse(data);
    res.json(tutorials);
  } catch (error) {
    console.error(" Error al leer los registros:", error);
    res.status(500).json({ error: "Error al leer los registros" });
  }
});*/


router.get("/", (req, res) => {
  try {
    console.log(" Leyendo desde:", filePath);
    if (!fs.existsSync(filePath)) {
      console.error("⚠️ No existe el archivo:", filePath);
      return res.status(404).json({ error: "Archivo no encontrado" });
    }

    const data = fs.readFileSync(filePath, "utf8").trim();
    console.log("📄 Contenido leído:", data);

    // Verificar si el archivo está vacío
    if (!data) {
      console.error("⚠️ El archivo JSON está vacío.");
      return res.json([]);
    }

    const tutorials = JSON.parse(data);
    if (!Array.isArray(tutorials)) {
      console.error("⚠️ El archivo JSON no contiene un array.");
      return res.status(500).json({ error: "Formato JSON inválido" });
    }

    res.json(tutorials);
  } catch (error) {
    console.error("❌ Error al leer los registros:", error.message);
    res.status(500).json({ error: error.message });
  }
});


/* ============================
    Agregar un nuevo tutorial
============================ */
router.post("/", upload.single("archivo"), (req, res) => {
  try {
    const { titulo, descripcion } = req.body;
    const archivo = req.file ? req.file.filename : null;

    if (!titulo || !descripcion || !archivo) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    const data = fs.readFileSync(filePath, "utf8");
    const tutorials = JSON.parse(data);

    const nuevoTutorial = {
      id: Date.now(),
      titulo,
      descripcion,
      media: `/media/${archivo}`, // ✅ referencia pública al archivo
    };

    tutorials.push(nuevoTutorial);
    fs.writeFileSync(filePath, JSON.stringify(tutorials, null, 2), "utf8");

    res.status(201).json(nuevoTutorial);
  } catch (error) {
    console.error("❌ Error al guardar:", error);
    res.status(500).json({ error: "Error al escribir el registro" });
  }
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);

  try {
    const data = fs .readFileSync(filePath, "utf8");
    const tutorials = JSON.parse(data);
    
    const index = tutorials.findIndex((t) => t.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Tutorial no encontrado" });
    }

    const tutorialToDelete = tutorials[index];
    console.log(" Tutorial a eliminar:", tutorialToDelete);
    //eliminar audio mp3
    const audioPath = path.join(__dirname, "..", tutorialToDelete.media);
    if (fs.existsSync(audioPath)) {
      fs.unlinkSync(audioPath);
      console.log(" Archivo de audio eliminado:", audioPath);
    }

    //Eliminar del json
    const updateTutorials = tutorials.filter((t) => t.id !== id);
    fs.writeFileSync(filePath, JSON.stringify(updateTutorials, null, 2), "utf8");

    res.json({ message: "Tutorial eliminado correctamente" });

  } catch (error) {
    console.error("Error al eliminar el tutorial:", error);
    res.status(500).json({ error: "Error al eliminar el tutorial" });
  }
});  

/* ============================
   ✏️ Actualizar un tutorial por ID
============================ */
router.put("/:id", upload.single("archivo"), (req, res) => {
  const id = Number(req.params.id);

  try {
    const data = fs.readFileSync(filePath, "utf8");
    const tutorials = JSON.parse(data);

    const index = tutorials.findIndex((t) => t.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Tutorial no encontrado" });
    }

    const tutorial = tutorials[index];

    // Si subió un nuevo archivo, eliminar el anterior
    let mediaPathFinal = tutorial.media;

    if (req.file) {
      const oldFile = path.join(__dirname, "..", tutorial.media);
      if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);

      mediaPathFinal = `/media/${req.file.filename}`;
    }

    // Actualizar campos
    const updated = {
      ...tutorial,
      titulo: req.body.titulo || tutorial.titulo,
      descripcion: req.body.descripcion || tutorial.descripcion,
      media: mediaPathFinal
    };

    tutorials[index] = updated;
    fs.writeFileSync(filePath, JSON.stringify(tutorials, null, 2));

    res.json(updated);
  } catch (err) {
    console.error("❌ Error al actualizar:", err);
    res.status(500).json({ error: "Error al actualizar el registro" });
  }
});


export default router;
