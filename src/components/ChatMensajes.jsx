import { useEffect, useState } from 'react';
import * as FaIcons from "react-icons/fa";
import './css/ChatMensajes.css';

const ChatMensajes = ({ mensaje, enviado }) => {
  const { mensaje_formateado, textomensaje, wa_id, estado } = mensaje;
  const { timestamp } = mensaje_formateado;

  // Función para formatear la hora en formato HH:MM AM/PM
  const formatHour = (timestampString) => {
    const date = new Date(timestampString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHour = `${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
    return formattedHour;
  };

  // Función para formatear la fecha en formato DD/MM/YYYY y el día de la semana
  const formatFechaRegistro = (timestampString) => {
    const dateObj = new Date(timestampString);

    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const dayOfWeek = daysOfWeek[dateObj.getDay()];

    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1; // Los meses empiezan en 0
    const year = dateObj.getFullYear();
    const fecha = `${day}/${month}/${year}`;

    return (
      <div className="timestamp-popover">
        <span className="timestamp-day">{dayOfWeek}</span>
        <span className="timestamp-date">{fecha}</span>
      </div>
    );
  };

  // Determinar las clases CSS según el tipo de mensaje (enviado o recibido)
  const messageClass = enviado ? 'sent-message' : 'received-message';

  return (
    <div>
      <div className="timestamp-container">
      {formatFechaRegistro(timestamp)}
      </div>
      {/* Mostrar la fecha fuera de la burbuja del chat */}
      <div className="chat-message-container">
      <div className={`chat-message ${messageClass}`}>
        <div className="message-content">
          <p>{textomensaje}</p>
        </div>
        <div className="message-timestamp">
          <p>{formatHour(timestamp)}</p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ChatMensajes;