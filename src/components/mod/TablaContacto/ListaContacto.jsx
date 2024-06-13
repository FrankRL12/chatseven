import {useState} from 'react';
import * as FaIcons from "react-icons/fa";
import {eliminarContacto} from '../../../api/api.contacto';
import Swal from 'sweetalert2';
import ModalActualizarContacto from '../ModalActualizarContacto';
import axios from 'axios';
import { toast } from "react-hot-toast";
import {token, contactar} from '../../../api/api.mensaje';
import {guardarMensaje} from '../../../api/api.contacto';

export default function ListaContacto({ contacto }) {

  const [showModal, setShowModal] = useState(false);
  const [contactoId, setContactoId] = useState(null);

    const handleModalOpen = (id) => {
        setContactoId(id); // Establece el ID del contacto seleccionado
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };
  

  const handleEliminarContacto = async () => {
    // Usamos SweetAlert en lugar de window.confirm
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Estas seguro de eliminar este contacto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      // Si el usuario confirma la eliminación
      try {
        await eliminarContacto(contacto.id);
        // Mostramos un mensaje con SweetAlert para confirmar la eliminación
        Swal.fire(
          '¡Eliminado!',
          'El contacto ha sido eliminado.',
          'success'
        );
        // No necesitas recargar la página aquí, ya que probablemente haya un estado que actualice la lista de contactos.
      } catch (error) {
        // Manejo de errores
        console.error('Error eliminando contacto:', error);
        Swal.fire(
          'Error',
          'Hubo un problema al intentar eliminar el contacto.',
          'error'
        );
      }
    }
  }


  const enviarMensaje = async (wa_id) => {
    const encabezado = "🌟 Buenas tardes mi amigo  🌟\n";
    const cuerpo = "Our summer sale is on! Shop now through the end of August and use code 25OFF to get 25% off all merchandise.";
    const pieDePagina = "\n\nManage your marketing subscriptions via our website.";

    const mensajeCompleto = `${encabezado}${cuerpo}${pieDePagina}`;

    if (mensajeCompleto.trim() === '') {
      toast.error('No puedes enviar un mensaje vacío');
      return;
    }

    try {
      const url = contactar;
      const autorizacion = token; // Reemplaza con tu token de acceso válido

      const json = {
        messaging_product: "whatsapp",
        to: wa_id,
        type: "text",
        text: {
          body: mensajeCompleto,
        },
      };

      const response = await axios.post(url, json, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${autorizacion}`,
        },
      });
      console.log(response.data);

      const mensajeData = {
        textomensaje: mensajeCompleto,
        wanidmensaje: response.data.messages[0].id,
        fecharegistro: new Date().toISOString(),
        json: JSON.stringify(response.data),
        tipoMensaje: "text",
        waid: wa_id,
      };
      console.log("Datos de mensaje a enviar:", mensajeData);
      // Aquí debes implementar guardarMensaje(mensajeData) para almacenar los datos
      await guardarMensaje(mensajeData);
      toast.success("Mensaje enviado");

    } catch (error) {
      console.error("Error enviando mensaje:", error);
    }
  };
 
  return (
    <tr>
        <td>{contacto.waid}</td>
        <td>{contacto.nombre}</td>
        <td>{contacto.apellidopaterno}</td>
        <td>{contacto.apellidomaterno}</td>
        <td>{contacto.nombreperfil}</td>
        <td>{contacto.fecharegistro}</td>
        <td><button className="btn btn-success" onClick={() => enviarMensaje(contacto.waid)}><FaIcons.FaWhatsapp/></button></td>
        <td><button className="btn btn-primary" onClick={() => handleModalOpen(contacto.id)}><FaIcons.FaMarker/></button><ModalActualizarContacto showModal={showModal}
          handleCloseModal={handleCloseModal} contactoId={contactoId} contacto={contacto}/></td>
        <td><button className="btn btn-danger" onClick={handleEliminarContacto}><FaIcons.FaTrash/></button></td>
    </tr>
  )
}
