import React from 'react';
import BarraLateral from './BarraLateral';
import Navegacio from './Navegacio';
import './css/Home.css';



export default function Home() {
  return (
    <div className="home">
      <div className="home-container">
        <Navegacio/>
        <BarraLateral/>
        <div className="home-bg">
          <img src="../../public/img/sevenbrains.png" alt="Fondo" />
        </div>
      </div>
    </div>
  );
}
