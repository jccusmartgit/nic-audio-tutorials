import React, { useState, useRef } from "react";
import "./styles/UploadFileForm.css";

function UploadFileForm({ onTutorialAdded }) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [archivo, setArchivo] = useState(null);
  const tituloRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!archivo) {
      alert("Por favor selecciona un archivo de audio");
      return;
    }

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descripcion", descripcion);
    formData.append("archivo", archivo);

    try {
      const response = await fetch("http://localhost:3000/api/tutorials", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const nuevoTutorial = await response.json();
        alert(`Tutorial "${nuevoTutorial.titulo}" agregado correctamente.`);
        const mensaje = `El tutorial ${nuevoTutorial.titulo} fue agregado correctamente`;
          // Lectura por voz
        const speech = new SpeechSynthesisUtterance(mensaje);
        speech.lang = "es-ES";
        speech.rate = 1;
        window.speechSynthesis.speak(speech);

        onTutorialAdded(nuevoTutorial);
        handleReset();
      } else {
        alert("Error al agregar el tutorial.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = () => {
    setTitulo("");
    setDescripcion("");
    setArchivo(null);
    if (tituloRef.current) tituloRef.current.focus();
  };

  return (
    <div className="form-upload">
      <form 
        tabIndex="0" 
        autoFocus 
        role="region" 
        aria-labelledby="form-title" 
        className="form-upload" 
        onSubmit={handleSubmit}>
        <h2 id="form-title">Cargar audio tutorial</h2>

        <div className="input-container">
          <input
            maxLength="40"
            aria-label="Ingrese el título del tutorial. Máximo 40 caracteres"
            ref={tituloRef}
            className="titulo-input"
            type="text"
            placeholder=" "
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
          <label>Título:</label>
        </div>

        <div className="input-container">
          <input
            maxLength="80"
            aria-label="Ingrese la descripción breve del tutorial. Máximo 80 caracteres"
            className="descripcion-input"
            type="text"
            placeholder=" "
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
          <label>Descripción:</label>
        </div>

        <div className="input-container">
          <input
            aria-label="Seleccione el archivo de audio a cargar"
            className="archivo-input"
            type="file"
            accept="audio/*"
            onChange={(e) => setArchivo(e.target.files[0])}
            required
          />
        </div>

        <button type="submit">Cargar</button>
        <button type="button" onClick={handleReset}>
          Limpiar
        </button>
      </form>
    </div>
  );
}

export default UploadFileForm;
