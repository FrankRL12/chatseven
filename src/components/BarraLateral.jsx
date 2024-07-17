import { useState, useEffect } from "react";
import {} from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import "./css/BarraLateral.css";
import perfil_defecto from "../../public/img/perfil.jpg";
import ChatLista from "./ChatLista";
import { getAllMesajes } from "../api/api.whatsapp";
import ModalContactar from "./mod/ModalContactar";

export default function BarraLateral({ posicion, phoneNumber }) {
  const [contactos, setContactos] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const fetchContactos = async () => {
    try {
      const res = await getAllMesajes();
      setContactos(res.data.webhookEventItem);
    } catch (error) {
      console.error("Error al obtener los contactos:", error);
    }
  };

  
  useEffect(() => {
    const fetchContactosInterval = setInterval(() => {
      fetchContactos();
    }, 1000); // Llama a fetchContactos cada 1 segundos
    // Limpia el intervalo al desmontar el componente
    return () => clearInterval(fetchContactosInterval); 
  }, []);


  function mostrarUltimoMensajeDesdePosicion(mensajes, posicion) {
    if (!mensajes || mensajes.length === 0) {
      return <p>No hay mensajes disponibles</p>;
    }
    const mensajesFiltrados = mensajes.filter(
      (mensaje) => mensaje.posicion === posicion
    );
    if (mensajesFiltrados.length === 0) {
      return <p>No hay mensajes disponibles para esta posición</p>;
    }
    const ultimoMensaje = mensajesFiltrados[mensajesFiltrados.length - 1].texto;
    return <p className="mensaje">{ultimoMensaje}</p>;
  }

  const datosAgrupados = {};

  // Agrupar los datos por wa_id
  contactos.forEach((contacto) => {
    const payloadObj = JSON.parse(contacto.payload);
    const contactosPayload = payloadObj.entry[0].changes[0].value.contacts;
    const mensajesPayload = payloadObj.entry[0].changes[0].value.messages;

    // Iterar sobre los contactos
    if (contactosPayload) {
      contactosPayload.forEach((contact) => {
        const waId = contact.wa_id;
        const nombre = contact.profile?.name || "Desconocido";
        if (!datosAgrupados[waId]) {
          datosAgrupados[waId] = {
            wa_id: waId,
            nombre: nombre,
            mensajes: [],
            lastMessageTimestamp: 0,
          };
        }
      });
    }

    // Iterar sobre los mensajes
    if (mensajesPayload) {
      mensajesPayload.forEach((mensaje) => {
        const waId = mensaje.from;
        if (
          mensaje.text != undefined &&
          mensaje.text != null &&
          mensaje.text.body != undefined
        ) {
          const messageTimestamp = parseInt(mensaje.timestamp); // Convertir el timestamp a entero
          const messagePosition = mensaje.posicion;
          if (datosAgrupados[waId] && messagePosition === posicion) {
            datosAgrupados[waId].lastMessageTimestamp = Math.max(
              messageTimestamp,
              datosAgrupados[waId].lastMessageTimestamp
            );
            // Agregar el mensaje al arreglo de mensajes del contacto
            datosAgrupados[waId].mensajes.push({
              texto: mensaje.text.body,
              timestamp: messageTimestamp,
              posicion: messagePosition,
            });
          }
        }
      });
    }
  });

  const contactosOrdenados = Object.values(datosAgrupados).sort(
    (a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp
  );

  return (
    <div className="sidebar bg-light">
      <div className="perfil d-flex align-items-center p-3">
        <img
          src={perfil_defecto}
          alt="Foto de perfil"
          className="foto-perfil rounded-circle mr-3"
        />
        <span className="nombre font-weight-bold">{phoneNumber}</span>
        <button type="button" className="btn btn-success text-center button-spacing">
        <FaIcons.FaWhatsapp/>
        </button>
        <button
          type="button"
          className="btn btn-primary text-center mr-2"
          onClick={handleModalOpen}
        >
          <FaIcons.FaAddressCard/>
        </button>
        <ModalContactar
          showModal={showModal}
          handleCloseModal={handleCloseModal}
        />
        <FaIcons.FaEllipsisV className="icono-menu ml-auto" />
      </div>

      <div className="busqueda p-3">
        <div className="input-group rounded-pill cursor-pointer">
          <div className="input-group-prepend">
            <span className="input-group-text bg-transparent border-0">
              <FaIcons.FaSearch />
            </span>
          </div>
          <input
            type="text"
            className="form-control border-0 rounded-pill"
            placeholder="Buscar..."
          />
          <div className="input-group-append">
            <span className="input-group-text bg-transparent border-0">
              <FaIcons.FaSortAmountDownAlt />
            </span>
          </div>
        </div>

        <div className="scrollable-content">
          <div className="lista-de-chat">
            {contactosOrdenados.map((datos, index) => (
              <ChatLista
                key={index}
                nombre={datos.nombre}
                waid={datos.wa_id}
                ultimoMensaje={mostrarUltimoMensajeDesdePosicion(
                  datos.mensajes,
                  posicion
                )}
              />
            ))}
          </div>
        </div>
      </div>
      {showModal && (
        <div className="modal-backdrop show" onClick={handleCloseModal}></div>
      )}
    </div>
  );
}
