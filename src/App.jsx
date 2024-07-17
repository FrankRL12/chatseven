import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./components/Home";
import PaginaDeChat from "./components/PaginaDeChat";
import whatsapp from "../public/img/sevenbrains.png";
import Login from "./components/Login";
import "./App.css";
import { url } from "./api/api.whatsapp";
import { Toaster } from "react-hot-toast";


const Loader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalTime = 3000; // Tiempo total de carga en milisegundos
    const increment = 100 / (totalTime / 30); // Incremento para alcanzar el 100% en 3 segundos

    const interval = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 100 : prevProgress + increment
      );
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-light">
      <div className="text-center">
        <img src={whatsapp} alt="Logo" className="w-25 h-auto mx-auto mb-3" />
        <div className="progress mb-3" style={{ height: "5px" }}>
          <div
            className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
            role="progressbar"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
        <p className="text-muted">Cargando Chat {Math.floor(progress)}%...</p>
      </div>
    </div>
  );
};

function App() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 5000); // Simulando un tiempo de carga de 5 segundos
  }, []);

  return (
    <BrowserRouter>
      {loading && <Loader />}
      {!loading && (
        <div>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home/>} />
            <Route
              path="/:wa_id"
              element={<PaginaDeChat/>}
            />
            <Route path="/login" element={<Login />} />
          </Routes>
          <Toaster />
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
