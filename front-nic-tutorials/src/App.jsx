import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import ima from './components/images/tutorial.png'
import {useNavigate} from 'react-router-dom'
import './App.css'
import TutorialsArea from './components/TutorialsArea'


function App() {
  

  const navigate = useNavigate();
  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === 'm') {
      e.preventDefault();
      navigate('/manager');
    }
  };

  return (
    <>
      <div className='App'>
        <p className='description' tabIndex="0">
          Escucha y descarga tutoriales dirgidos a personas con discapacidad visual en formato de audio, para que puedas realizar distintos procesos en tus dispositivos de forma rápida y accesible.
        </p>
        <img src= { ima }/>
        <div className='list-tutorial'>
          <TutorialsArea />
        </div>
        <footer>
          <p tabIndex="0">© 2025 NIC-Tutorials. Todos los derechos reservados.</p>
          <button tabIndex="0" aria-label='fin' onKeyDown={handleKeyDown}></button>
        </footer>
      </div>
    </>
  )
}

export default App
