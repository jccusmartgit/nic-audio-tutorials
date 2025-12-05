import React, { useState, useEffect, useRef } from "react";
import "./styles/TutorialsArea.css";
import EditTutorialForm from "./EditTutorialForm";

function TutorialsArea({ nuevoTutorial, adminMode = false }) {
  const [tutoriales, setTutoriales] = useState([]);
  const [editando, setEditando] = useState(null);
  const endRef = useRef(null);
  const lastAudioRef = useRef(null);

  
  useEffect(() => {
    fetch("https://nic-audio-tutorials.onrender.com/api/tutorials")
      .then((res) => res.json())
      .then((data) => setTutoriales(data))
      .catch((err) => console.error("Error al cargar:", err));
  }, []);

  /*useEffect(() => {
    if (nuevoTutorial) setTutoriales((prev) => [...prev, nuevoTutorial]);
  }, [nuevoTutorial]);*/

  useEffect(() => {
  if (nuevoTutorial) {
    setTutoriales((prev) => {
      const existe = prev.find(t => t.id === nuevoTutorial.id);
      if (existe) return prev;
      return [...prev, nuevoTutorial];
    });

    setTimeout(() => {
      // Scroll suave al nuevo elemento
      endRef.current?.scrollIntoView({ behavior: "smooth" });

      // Foco en el reproductor de audio
      if (lastAudioRef.current) {
        lastAudioRef.current.focus();
      }
    }, 300);
  }
}, [nuevoTutorial]);



  const handleUpdate = (tutorial) => {
    setEditando(tutorial);
    alert(`Actualizar tutorial: ${tutoriales[index].titulo}`);
  };

  /*const handleDelete = (index) => {
    const confirmDelete = confirm("¿Estás seguro de que deseas eliminar este tutorial?");
    if (confirmDelete) {
      const updated = tutoriales.filter((_, i) => i !== index);
      setTutoriales(updated);
    }
  };*/

const handleDelete = async (id) => {
  const confirmDelete = confirm("¿Estás seguro de que deseas eliminar este tutorial?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(`https://nic-audio-tutorials.onrender.com/api/tutorials/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) {
      alert("Error al eliminar en el servidor");
      return;
    }

    // Actualizar el estado local
    setTutoriales((prev) => prev.filter((t) => t.id !== id));

  } catch (err) {
    console.error("Error eliminando:", err);
    alert("No se pudo conectar con el servidor");
  }
};


  return (
    <div className="tutorial-list">
      <h1 tabIndex="0">Lista de tutoriales</h1>
      {tutoriales.map((t, index) => (
        <div key={index} className="tutorial-item">
          <p className="titulo" tabIndex="0">{t.titulo}</p>
          <p className="descripcion" tabIndex="0">{t.descripcion}</p>

          <audio
            controls
            tabIndex="0"
            ref={index === tutoriales.length - 1 ? lastAudioRef : null}
            src={`http://localhost:3000${t.media}`}
          ></audio>

          {adminMode ? (
            <div className="admin-buttons">
              <button
                 onClick={() => handleUpdate(t)}
                 aria-label="Actualizar Registro"
                 className="material-symbols-outlined"
              >
                edit_square
              </button>
              <button
                onClick={() => handleDelete(t.id)}
                aria-label="Eliminar Registro"
                className="material-symbols-outlined"
              >
                delete
              </button>
            </div>
          ) : (
            <a
              href={`http://localhost:3000${t.media}`}
              download
              className="descargar"
              aria-label={`Descargar ${t.titulo}`}
              tabIndex="0"
            >
              Descargar
            </a>
          )}
        </div>
      ))}
      <div ref={endRef}></div>
      {editando && (
            <EditTutorialForm
              tutorial={editando}
              onClose={() => setEditando(null)}
              onSave={(updated) =>
                setTutoriales((prev) =>
                  prev.map((t) => (t.id === updated.id ? updated : t))
                )
              }
            />
          )}
    </div>
  );
}

export default TutorialsArea;
