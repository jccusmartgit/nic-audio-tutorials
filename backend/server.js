import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import tutorialsRouter from "./routes/tutorials.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// ⭐⭐ SOLUCIÓN: Servir la carpeta media ⭐⭐
app.use("/media", express.static(path.join(__dirname, "media")));

// Rutas API
app.use("/api/tutorials", tutorialsRouter);

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
