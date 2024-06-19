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
  const [mensajesRecibidos, setMensajesRecibidos] = useState([]);

  const [mensajesUnidos, setMensajesUnidos] = useState([]);

  

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
    const fetchMensajes = async () => {
        try {
            const response = await todosMensajes();
            const mensajesOrdenados = response.data.sort((a, b) => {
                // Ordena los mensajes por fecharegistro en orden ascendente
                return new Date(a.fecharegistro) - new Date(b.fecharegistro);
            });

            // Filtra los mensajes por wa_id y ordena por estado y timestamp
            const mensajesFiltrados = mensajesOrdenados.filter(mensaje => {
                const json_data = JSON.parse(mensaje.json);
                const mensaje_wa_id = json_data.from || (json_data.contacts && json_data.contacts[0].wa_id);
                return mensaje_wa_id === wa_id;
            });
            console.log('Mensajes filtrados:', mensajesFiltrados);

            setMensajesUnidos(mensajesFiltrados);
        } catch (error) {
            console.error('Error al obtener mensajes:', error);
        }
    };

    fetchMensajes();
}, [wa_id]);



  
 
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
        estado: 'enviado',
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

          mensajesUsuario.sort((a, b) => a.timestamp - b.timestamp);

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
      {mensajesUnidos.map((mensaje) => (
                <ChatMensajes  key={mensaje.id} mensaje={mensaje} enviado={mensaje.estado === 'enviado'}/>
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
