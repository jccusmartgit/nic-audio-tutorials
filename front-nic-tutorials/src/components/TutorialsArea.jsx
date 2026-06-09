import React, { useState, useEffect, useRef } from "react";
import "./styles/TutorialsArea.css";
import EditTutorialForm from "./EditTutorialForm";

const speak = (text) => {
  if (!("speechSynthesis" in window)) return;

  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "es-ES";
  msg.rate = 1;
  msg.pitch = 1;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(msg);
};


function TutorialsArea({ nuevoTutorial, adminMode = false }) {
  const [tutoriales, setTutoriales] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [editando, setEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [adminMode, setAdminMode] = useState(false);
  const firstResultRef = useRef(null);
  const endRef = useRef(null);
  const lastAudioRef = useRef(null);

  // 🔹 Cargar la lista desde Render
  useEffect(() => {
    fetch("https://nic-audio-tutorials.onrender.com/api/tutorials")
      .then((res) => res.json())
      .then((data) => {
        setTutoriales(data);
        setFiltrados(data);
      })
      .catch((err) => console.error("Error al cargar:", err));
  }, []);

  // 🔹 Añadir el nuevo tutorial sin repetir
  useEffect(() => {
    if (nuevoTutorial) {
      setTutoriales((prev) => {
        const existe = prev.find(t => t.id === nuevoTutorial.id);
        return existe ? prev : [...prev, nuevoTutorial];
      });

      setFiltrados((prev) => {
        const existe = prev.find(t => t.id === nuevoTutorial.id);
        return existe ? prev : [...prev, nuevoTutorial];
      });

      setTimeout(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
        lastAudioRef.current?.focus();
      }, 300);
    }
  }, [nuevoTutorial]);

  // 🔹 Función de búsqueda al presionar ENTER
  /*const buscar = (e) => {
    if (e.key !== "Enter") return;

    const termino = busqueda.trim().toLowerCase();

    if (termino === "") {
      setFiltrados(tutoriales);
      return;
    }

    const resultados = tutoriales.filter(t =>
      t.titulo.toLowerCase().includes(termino) ||
      t.descripcion.toLowerCase().includes(termino)
    );

    setFiltrados(resultados);

    // Enfocar el primer elemento encontrado
    setTimeout(() => {
      firstResultRef.current?.focus();
    }, 150);
  }; */

const ejecutarBusqueda = () => {
  const termino = busqueda.trim().toLowerCase();

  // 🔐 CLAVE ADMIN
  if (termino === "clave555") {
    setBusqueda("");
    setAdminMode(true);

    speak("Modo administración activo");

    setTimeout(() => {
      document.getElementById("admin-panel")?.focus();
    }, 300);

    return;
  }

  // 🔎 BÚSQUEDA NORMAL
  if (!termino) {
    setFiltrados(tutoriales);
    return;
  }

  const resultados = tutoriales.filter(t =>
    t.titulo.toLowerCase().includes(termino) ||
    t.descripcion.toLowerCase().includes(termino)
  );

  setFiltrados(resultados);

  setTimeout(() => {
    firstResultRef.current?.focus();
  }, 200);
};

const handleKeyDown = (e) => {
  if (e.key === "Enter") {
    ejecutarBusqueda();
  }
};



  // 🔹 Abrir formulario de edición
  const handleUpdate = (tutorial) => {
    setEditando(tutorial);
    alert(`Actualizar tutorial: ${tutorial.titulo}`);
  };

  // 🔹 Eliminar tutorial
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

      setTutoriales(prev => prev.filter(t => t.id !== id));
      setFiltrados(prev => prev.filter(t => t.id !== id));

    } catch (err) {
      console.error("Error eliminando:", err);
      alert("No se pudo conectar con el servidor");
    }
  };

  const lista = filtrados.length ? filtrados : tutoriales;


  return (
    <div className="tutorial-list">
      <h1 tabIndex="0">Lista de tutoriales</h1>

      {/* 🔍 BUSCADOR */}
      <div className="search-box">
        <input
          type="text"
          className="buscador"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar tutorial..."
          aria-label="Buscar tutorial"
        />

        <button
          onClick={ejecutarBusqueda}
          aria-label="Ejecutar búsqueda"
        >
          Buscar
        </button>
      </div>


      {lista.map((t, index) => (
        <div
          key={t.id}
          className="tutorial-item"
          ref={index === 0 ? firstResultRef : null}
        >
          <p 
            className="titulo" 
            tabIndex="0" 
            ref={index === 0 ? firstResultRef : null}
          >
            {t.titulo}
          </p>
          <p className="descripcion" tabIndex="0">{t.descripcion}</p>

          <audio
            controls
            tabIndex="0"
            ref={index === filtrados.length - 1 ? lastAudioRef : null}
            src={`https://nic-audio-tutorials.onrender.com${t.media}`}
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
              href={`https://nic-audio-tutorials.onrender.com${t.media}`}
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
