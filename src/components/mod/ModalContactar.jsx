import { useState } from "react";
import "./css/ModalContactar.css";
import * as FaIcons from "react-icons/fa";
import { contactar, token } from "../../api/api.mensaje";
import axios from "axios";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

const enviarMensaje = async (numero, mensaje) => {
  try {
    const json = {
      messaging_product: "whatsapp",
      to: numero,
      type: "text",
      text: {
        body: mensaje,
      },
    };

    const response = await axios.post(contactar, json, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response.data);
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Mensaje enviado",
      showConfirmButton: false,
      timer: 1500
    });

  } catch (error) {
    console.error("Error enviando mensaje:", error);
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Error enviando mensaje",
      showConfirmButton: false,
      timer: 1500
    });
  }
};



export default function ModalContactar({ showModal, handleCloseModal }) {
  const [numero, setNumero] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [bandera, setBandera] = useState("🇲🇽");
  const navigate = useNavigate();

  const handleNumeroChange = (e) => {
    const numeroIngresado = e.target.value;
    setNumero(numeroIngresado);

    if (numeroIngresado.startsWith("+52")) {
      setBandera("🇲🇽");
    } else {
      setBandera("🇲🇽");
    }
  };

  const handleMensajeChange = (e) => {
    setMensaje(e.target.value);
  };

  const handleEnviarMensaje = () => {
    if (numero.length === 13 && mensaje.trim() !== "") {
      enviarMensaje(numero, mensaje);
      setMensaje("");
      setNumero("");
      handleCloseModal();
    } else {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, asegúrate de que ambos campos estén llenos y que el número de teléfono tenga 13 caracteres.',
        showConfirmButton: true
      });
    }
  };

  return (
    <div>
      <div
        className={`modal ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Contactar Cliente</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={handleCloseModal}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="numero">Ingresa número</label>
                <div className="input-group">
                  <span className={`input-group-text flag ${numero.startsWith("+52") ? "flag-mexico" : ""}`}>{bandera}</span>
                  <input
                    type="text"
                    className="form-control"
                    id="numero"
                    placeholder="Ingresa número telefónico"
                    value={numero}
                    onChange={handleNumeroChange}
                  />
                </div>
              </div>
              <div className="form-group mt-4">
                <label htmlFor="mensaje">Escribe un mensaje</label>
                <div className="input-group">
                  <textarea
                    className="form-control"
                    id="mensaje"
                    rows="3"
                    placeholder="Escribe un mensaje..."
                    value={mensaje}
                    onChange={handleMensajeChange}
                  ></textarea>
                  <div className="input-group-append">
                    <button className="btn btn-success" onClick={handleEnviarMensaje}>
                      <FaIcons.FaPaperPlane />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="modal-backdrop show" onClick={handleCloseModal}></div>
      )}
    </div>
  );
}
