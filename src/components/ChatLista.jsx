import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/ChatLista.css";
import fotoURL from "../../public/img/perfil_defecto.jpg";

export default function ChatLista({ nombre, waid, ultimoMensaje }) {
  const navegacion = useNavigate();
  const irUsuario = (wa_id) => {
    if (wa_id) {
      navegacion(`/${wa_id}`);
    }
  };


  return (
    <div className="lista-de-chat" onClick={() => irUsuario(waid)}>
      <div className="contacto-whatsapp">
        <div className="perfil-y-info">
          <img src={fotoURL} alt="Foto de perfil" className="perfil-chat" />
          <div className="info-contacto">
            <p className="nombre">{nombre}</p>
            <p className="wa-id">{waid}</p>
            <div className="messages-container">
              <div className="message text-truncate">
                {ultimoMensaje}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
