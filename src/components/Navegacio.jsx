import { useState, useEffect } from "react";
import { Link } from 'react-router-dom'; // Importa el componente Link de React Router
import * as FaIcons from "react-icons/fa";
import './css/Navegacion.css'; // Archivo CSS para estilos personalizados de navegación
import ModalContactos from './mod/ModalContactos';

export default function Navegacion() {
  const [showModal, setShowModal] = useState(false);

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="navegacion">
      <ul className="list-unstyled components">
        <li>
          <Link to="#" title="Mensajes">
            <FaIcons.FaCommentAlt/>
          </Link>
        </li>
        <li className="mt-5">
          <Link to="#" title="Contactos" onClick={handleModalOpen}>
            <FaIcons.FaAddressBook />
          </Link>
          <ModalContactos showModal={showModal}
          handleCloseModal={handleCloseModal}/>
        </li>
        <li className="mt-5">
          <Link to="#" title="Usuarios">
            <FaIcons.FaUsers />
          </Link>
        </li>
        <li className="mt-5">
          <Link to="#" title="Perfil">
            <FaIcons.FaUser />
          </Link>
        </li>
        <li className="mt-5">
          <Link to="#" title="Agente">
            <FaIcons.FaUserTie/>
          </Link>
        </li>
        <li className="mt-5">
          <Link to="#" title="Configuración">
            <FaIcons.FaCog />
          </Link>
        </li>
        {/* Agrega más íconos y enlaces según tus necesidades */}
      </ul>
    </div>
  );
}
