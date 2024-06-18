import { useEffect, useState } from 'react';
import * as FaIcons from "react-icons/fa";
import './css/ChatMensajes.css';

const ChatMensajes = ({ mensaje, enviado }) => {
  const { mensaje_formateado, textomensaje, wa_id, estado } = mensaje;
  const { timestamp, text, type } = mensaje_formateado;

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

  // Función para obtener el nombre del archivo a partir de la ruta
  const getFileNameFromPath = (filePath) => {
    const parts = filePath.split('/');
    return parts[parts.length - 1]; // Devuelve el último elemento del arreglo
  };

  // Determinar las clases CSS según el tipo de mensaje (enviado o recibido)
  const messageClass = enviado ? 'sent-message' : 'received-message';

  // Función para renderizar el contenido del mensaje según el tipo
  const renderMessageContent = () => {
    if (type === 'text') {
      return <p>{textomensaje}</p>;
    } else if (['image', 'video', 'audio', 'sticker'].includes(type)) {
      const fileName = getFileNameFromPath(text); // Obtener el nombre del archivo
      if (type === 'image' || type === 'sticker') {
        return (
          <img
            src={text}
            alt={fileName}
            className="img-fluid rounded mx-auto d-block"
            style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover' }}
          />
        );
      } else if (type === 'video') {
        return (
          <div className="embed-responsive embed-responsive-16by9  rounded mx-auto d-block">
      <video controls className="embed-responsive-item" style={{ maxHeight: '300px', width: 'auto' }}>
        <source src={text} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
        );
      } else if (type === 'audio') {
        return (
          <div>
            <audio controls>
              <source src={text} type="audio/mpeg" />
              Your browser does not support the audio tag.
            </audio>
          </div>
        );
      }
    } else if (type === 'pdf') {
      const fileName = getFileNameFromPath(text); // Obtener el nombre del archivo
      return (
        <div className="text-center">
          <embed src={text} type="application/pdf" width="100%" height="300px" />
          <p>{fileName}</p>
        </div>
      );
    } else {
      return <p>{textomensaje}</p>; // Manejar otros tipos de mensaje según necesidad
    }
  };
  return (
    <div>
      <div className="timestamp-container">
        {formatFechaRegistro(timestamp)}
      </div>
      {/* Mostrar la fecha fuera de la burbuja del chat */}
      <div className="chat-message-container">
        <div className={`chat-message ${messageClass}`}>
          <div className="message-content">
            {renderMessageContent()}
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