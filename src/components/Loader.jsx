import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Loader = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress < 100) {
          return prevProgress + 10; // Incrementa la barra de progreso en 10 unidades cada 0.5 segundos (por ejemplo)
        } else {
          clearInterval(interval);
          navigate('/home'); // Redirige al usuario a la página de inicio una vez que la carga alcanza el 100%
          return prevProgress;
        }
      });
    }, 500); // Intervalo de tiempo en milisegundos para actualizar la barra de progreso
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div>
      <img src="tu_imagen.jpg" alt="Imagen de carga" />
      <p>Cargando chat... {progress}%</p>
      <div style={{ width: '100%', backgroundColor: '#ccc', height: '20px' }}>
        <div style={{ width: `${progress}%`, backgroundColor: '#4CAF50', height: '100%' }}></div>
      </div>
    </div>
  );
};

export default Loader;
