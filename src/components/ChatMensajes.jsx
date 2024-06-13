import { useEffect, useState } from 'react';
import * as FaIcons from "react-icons/fa";
import './css/ChatMensajes.css';

const ChatMensajes = ({ mensaje, enviado, esMensajePropio, timestamp, archivos, fecharegistro }) => {

  const formatFechaRegistro = (fechaRegistro) => {
    const dateObj = new Date(fechaRegistro);

    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const dayOfWeek = daysOfWeek[dateObj.getDay()];

    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    const fecha = `${day}/${month}/${year}`;

    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHour = `${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;

    return (
      <div className="timestamp-popover">
        <span className="timestamp-day">{dayOfWeek}</span>
        <span className="timestamp-date">{fecha}</span>
      </div>
    );
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000); // Convertir el timestamp UNIX a milisegundos

    // Obtener el día de la semana
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const dayOfWeek = daysOfWeek[date.getDay()];

    // Obtener la fecha en formato DD/MM/YYYY
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const fecha = `${day}/${month}/${year}`;


    return (
      <div className="timestamp-popover">
        <span className="timestamp-day">{dayOfWeek}</span>
        <span className="timestamp-date">{fecha}</span>
      </div>
    ); // Formatear la fecha y el día
  };

  // Función para formatear la hora en formato HH:MM AM/PM
  const formatHour = (timestamp) => {
    const date = new Date(timestamp * 1000); // Convertir el timestamp UNIX a milisegundos
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // Si hours es 0, convertirlo a 12
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`; // Formatear la hora
  };

  const formattedDate = enviado ? formatFechaRegistro(fecharegistro) : formatTimestamp(timestamp);


  return (
    <div>
      <div className="timestamp-container">
        {formattedDate}
      </div>
      <div className={`chat-message-container ${enviado ? 'own-message' : 'other-message'}`}>
        <div className="chat-message">
          {!enviado && (
            <p className="enviado">{esMensajePropio}</p>
          )}
          <p className="chat-message-content">{mensaje}</p>
          {archivos && <a className="chat-message-content" href={archivos}>Archivo adjunto</a>}
          <p className="chat-message-timestamp">{formatHour(timestamp)}</p>
        </div>
      </div>
    </div>
  );
}



export default ChatMensajes;
