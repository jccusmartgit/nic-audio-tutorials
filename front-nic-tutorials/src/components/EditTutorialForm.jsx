import React, { useState } from "react";
import "./styles/EditTutorialForm.css";

function EditTutorialForm({ tutorial, onClose, onSave }) {
  const [titulo, setTitulo] = useState(tutorial.titulo);
  const [descripcion, setDescripcion] = useState(tutorial.descripcion);
  const [archivo, setArchivo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descripcion", descripcion);
    if (archivo) formData.append("archivo", archivo);

    const res = await fetch(`https://nic-audio-tutorials.onrender.com/api/tutorials/${tutorial.id}`, {
      method: "PUT",
      body: formData
    });

    const data = await res.json();
    if (res.ok) {
      onSave(data); // actualiza en lista
      onClose();    // cierra modal
    } else {
      alert("Error al actualizar");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" role="dialog" aria-modal="true">
        <form 
            className="form-edit" 
            onSubmit={handleSubmit}
            role = "region"
            aria-labelledby="edit-form-title"
            tabIndex="0"
        >
            <h2 id="edit-form-title">Editar Tutorial</h2>

            <div className="input-container">
            <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="titulo-input"
                aria-label="Editar título. Máximo 40 caracteres"
                tabIndex="0"
                maxLength="40"
                placeholder=" "
                required
            />
                <label>Título</label>
            </div>

            <div className="input-container">
            <input
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="descripcion-input"
                aria-label="Editar descripción. Máximo 80 caracteres"
                tabIndex="0"
                maxLength="80"
                placeholder=" "
                required
            />
                <label>Descripción</label>
            </div>

            <div className="input-container-file">
            <input
                type="file"
                accept="audio/*"
                onChange={(e) => setArchivo(e.target.files[0])}
                aria-label="Seleccionar nuevo archivo de audio"
                tabIndex="0"
                className="archivo-input"
            />
            </div>

            <button type="submit">Guardar cambios</button>
            <button type="button" onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </div>
  );
}

export default EditTutorialForm;
