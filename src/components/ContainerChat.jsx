import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import perfil_defecto from "../../public/img/perfil_defecto.jpg";
import * as FaIcons from "react-icons/fa";
import "./css/ContainerChat.css";
import ChatMensajes from "./ChatMensajes";
import EmojiPicker from "emoji-picker-react";
import { url } from "../api/api.whatsapp";
import axios from "axios";
import {registarContacto, multimedia, guardarMensaje, todosMensajes} from '../api/api.contacto';
import ModalRegistrarContacto from "./mod/ModalRegistrarContacto";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";

const ContainerChat = ({ phoneNumber }) => {
  const [abrirEmojiBox, setAbrirEmojiBox] = useState(false);
  const { wa_id } = useParams();
  const [mensajesUsuario, setMensajesUsuario] = useState([]);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [mensajes, setMensajes] = useState("");
  const chatDisplayRef = useRef(null); // Referencia al contenedor de mensajes
  const fileInputRef = useRef(null); // Referencia al input de tipo file
  const [mensajesEnviados, setMensajesEnviados] = useState([]);
  const [mediaUrls, setMediaUrls] = useState([]);
  const myBlob = useState("");
  const [showModal, setShowModal] = useState(false);
  const [archivos, setArchivos] = useState([]);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  


  useEffect(() => {
    async function cargarArchivos() {
      const res = await multimedia();
      setArchivos(res.data);
      console.log(res);
    };
    cargarArchivos();
  }, []);



  //Peticion para mostar los mensajes guardado en la base de dato 


  useEffect(() => {
    async function cargarMensajes() {
        try {
            // Obtener todos los mensajes
            const res = await todosMensajes();
            console.log("Datos obtenidos de la API:", res.data);

            // Filtrar los mensajes por 'wa_id' en el JSON
            const mensajesFiltrados = res.data.filter(mensaje => {
                const json = JSON.parse(mensaje.json);
                const contactos = json.contacts;
                // Verificar si hay contactos en el JSON
                if (contactos && contactos.length > 0) {
                    // Recorrer los contactos y comparar con wa_id
                    for (let i = 0; i < contactos.length; i++) {
                        if (contactos[i].wa_id === wa_id) {
                            // Si coincide el wa_id, devolver verdadero
                            return true;
                        }
                    }
                }
                // Si no se encontró el wa_id en ninguno de los contactos, devolver falso
                return false;
            });

            // Actualizar el estado con los mensajes filtrados
            setMensajesEnviados(mensajesFiltrados);
        } catch (error) {
            console.error('Error cargando mensajes:', error);
        }
    }

    // Cargar los mensajes al montar el componente
    cargarMensajes();
}, [wa_id]); // Vuelve a cargar los mensajes cuando cambia wa_id


  //fin del codigo 



  
 
  const tipoMensaje = "text"; 

  const token = "EAAFlhalgZBNQBO2LAmDZAoJAfSh9eJMBor6cYY3h4AEDBRRjAYWXoyl5GCZAGjJ5M28NVdcoJwwWjAPv536RuTkcLYy7ZASJiu4Jd9UzYYEWdHewl7Yvhyk8drdJYoJHZAr3fZAZBT1TPYK1sjWVCQdLntAJUlkzUT63UU5yk6926lWQJr8mZB6TxYxB6ZARwVC5y"; // Tu token de autenticación

  const enviarMensaje = async () => {
    if (mensajes.trim() === '') {
      toast.error('No puedes enviar un mensaje vacío');
      return;
    }

    try {
      const url = "https://graph.facebook.com/v18.0/259235733938525/messages";
      const token =
        "EAAFlhalgZBNQBO2LAmDZAoJAfSh9eJMBor6cYY3h4AEDBRRjAYWXoyl5GCZAGjJ5M28NVdcoJwwWjAPv536RuTkcLYy7ZASJiu4Jd9UzYYEWdHewl7Yvhyk8drdJYoJHZAr3fZAZBT1TPYK1sjWVCQdLntAJUlkzUT63UU5yk6926lWQJr8mZB6TxYxB6ZARwVC5y";

      
      // Creamos el objeto JSON para la solicitud
      const json = {
        messaging_product: "whatsapp",
        to: wa_id, // Reemplaza con el ID del destinatario
        type: tipoMensaje,
        text: {
          body: mensajes,
        },
      };

      // Realizamos la solicitud POST
      const response = await axios.post(url, json, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);


      const mensajeData = {
        textomensaje: mensajes,
        wanidmensaje: response.data.messages[0].id,
        fecharegistro: new Date().toISOString(),
        json: JSON.stringify(response.data),
        tipoMensaje: tipoMensaje,
        waid: wa_id,
      };
      console.log("Datos de mensaje a enviar:", mensajeData);
      await guardarMensaje(mensajeData);
      toast.success("mensaje enviado");
      

      guardarMensajeEnviado(mensajes, response.data.timestamp);
      // Limpiar el input después de enviar el mensaje
      setMensajes("");
    } catch (error) {
      console.error("Error enviando mensaje:", error);
    }
  };

  const guardarMensajeEnviado = (mensajes) => {
    // Agregar el nuevo mensaje enviado al array de mensajes enviados
    setMensajesEnviados([...mensajesEnviados, mensajes]);
  };


  //peticion al webhook para mostar los mensajes y wa_id y nombre en esta caso los perfiles
  useEffect(() => {
    
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        //console.log("Data recibida:", data); // Depuración
        if (data && data.webhookEventItem) {
          let mensajesUsuario = [];
          let mediaPromises = [];
          let imagenes = [];

          data.webhookEventItem.forEach((entry) => {
            const payload = JSON.parse(entry.payload);
            const contactosPayload = payload.entry[0].changes[0].value.contacts;
            const mensajesPayload = payload.entry[0].changes[0].value.messages;


            if (contactosPayload) {
              contactosPayload.forEach((contact) => {
                if (contact.wa_id === wa_id) {
                  const nombre = contact.profile?.name || "Desconocido";
                  setNombreUsuario(nombre);
                }
              });
            }

            if (mensajesPayload) {
              const mensajesFiltrados = mensajesPayload.filter(
                (mensaje) => mensaje.from === wa_id
              );
              mensajesUsuario = mensajesUsuario.concat(mensajesFiltrados);
            }
          });

          setMensajesUsuario(mensajesUsuario);
        } else {
          console.error(
            "El objeto de datos no tiene la propiedad 'webhookEventItem'"
          );
        }
      })
      .catch((error) => console.error("Error al obtener los datos:", error));
  }, [wa_id]);

  //fin del codigo




  const handleEmojiSeleccionado = (emojiObj) => {
    const emoji = emojiObj.emoji;
    setMensajes((prevMensaje) => prevMensaje + emoji);
  };

  // Efecto para desplazar automáticamente hacia abajo al agregar nuevos mensajes
  useEffect(() => {
    if (chatDisplayRef.current) {
      chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
    }
  }, [mensajes]);

  

  return (
    <div className="chat-container">
      <div className="chat-container-header">
        <div className="chat-user-info">
          <div className="chat-user-img">
            <img src={perfil_defecto} alt="" />
          </div>
          <p>{nombreUsuario}</p>
        </div>
        <div className="chat-container-header-btn">
        <button className="btn btn-primary" onClick={handleModalOpen}>
          <FaIcons.FaUserPlus/>
        </button>
        <ModalRegistrarContacto showModal={showModal}
          handleCloseModal={handleCloseModal}  nombreUsuario={nombreUsuario} wa_id={wa_id}/>
        </div>
      </div>

      {abrirEmojiBox && (
        <div className="emoji-picker-container">
          <EmojiPicker onEmojiClick={handleEmojiSeleccionado} />
        </div>
      )}

      {/* Agrega la referencia al contenedor de mensajes */}
      <div className="chat-display-container" ref={chatDisplayRef}>
      {mensajesUsuario.map((mensaje, index) => (
  <ChatMensajes
    key={index}
    timestamp={mensaje.timestamp}
    mensaje={
      mensaje.text ? (
        mensaje.text.body
      ) : mensaje.document ? (
        <a
          href={mensaje.archivos}
          target="_blank"
          rel="noopener noreferrer"
        >
          {mensaje.document.filename}
        </a>
      ) : mensaje.image ? (
        <img
          src={mensaje.archivos}
          alt="Imagen"
          style={{ maxWidth: "100%" }}
        />
      ) : mensaje.video ? (
        <video controls style={{ maxWidth: "100%" }}>
          <source src={mensaje.archivos} type="video/mp4" />
          Tu navegador no soporta la reproducción de videos.
        </video>
      ) : mensaje.sticker ? (
        <img
          src={mensaje.archivos}
          alt="Sticker"
          style={{ maxWidth: "100%" }}
        />
      ) : (
        "Mensaje vacío"
      )
    }
  />
))}

        {mensajesEnviados.map((mensaje, index) => (
          <ChatMensajes key={mensaje.id} mensaje={mensaje.textomensaje} fecharegistro={mensaje.fecharegistro} enviado={true} />
        ))}
        
        <div></div>
      </div>

      <div className="chat-input">
        <div className="chat-input-btn">
          <FaIcons.FaRegGrin onClick={() => setAbrirEmojiBox(!abrirEmojiBox)} />
          <FaIcons.FaPlus />
          {/* Input oculto de tipo file */}
          <input ref={fileInputRef} type="file" style={{ display: "none" }} />
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <input
            className="chat-input-field"
            type="text"
            placeholder="Escribe un mensaje"
            value={mensajes}
            onChange={(e) => setMensajes(e.target.value)}
            
          />
        </form>

        <div
          className="chat-input-send-btn bg-primary"
          onClick={enviarMensaje}
          style={{ cursor: "pointer" }}
        >
          <FaIcons.FaPaperPlane />
        </div>
      </div>
    </div>
  );
};

export default ContainerChat;