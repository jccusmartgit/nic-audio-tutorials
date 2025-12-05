import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import tutorialsRouter from "./routes/tutorials.js";

const app = express();

// Necesario para rutas absolutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (audios)
app.use("/media", express.static(path.join(__dirname, "media")));

// Rutas API
app.use("/api/tutorials", tutorialsRouter);

// Puerto dinámico para Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log("Media path:", path.join(__dirname, "media"));
});
