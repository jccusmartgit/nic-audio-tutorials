import React, { useEffect, useState }  from "react";
import "./styles/Manager.css";
import UploadFileForm from "../components/UploadFileForm";
import TutorialsArea from "../components/TutorialsArea";


function Manager () {
    const [nuevoTutorial, setNuevoTutorial] = useState(null);
    

    return (
        <div className="admin">
            <h1>Administración de tuotoriales</h1>
            <UploadFileForm  onTutorialAdded={setNuevoTutorial} />
            <TutorialsArea  nuevoTutorial={nuevoTutorial} adminMode = { true } />
        </div>
        
        
    );
}

export default Manager;