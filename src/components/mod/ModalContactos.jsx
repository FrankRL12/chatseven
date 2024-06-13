import { useState, useEffect } from 'react';
import { todosContacto, eliminarContacto } from '../../api/api.contacto';
import ListaContacto from './TablaContacto/ListaContacto';
import * as FaIcons from "react-icons/fa";
import Pagination from 'react-responsive-pagination';
import './css/ModalContactar.css'; // Asegúrate de tener esta hoja de estilos

export default function ModalContactos({ showModal, handleCloseModal }) {
    const [contacto, setContacto] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [contactsPerPage, setContactsPerPage] = useState(7);



    useEffect(() => {
        async function cargarContacto() {
            const res = await todosContacto();
            setContacto(res.data);
        }
        cargarContacto();
    }, []);



    const handleBusquedaChange = (e) => {
        setBusqueda(e.target.value);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const indexOfLastContact = currentPage * contactsPerPage;
    const indexOfFirstContact = indexOfLastContact - contactsPerPage;
    const currentContacts = contacto.slice(indexOfFirstContact, indexOfLastContact);

    const handleContactoFiltrado = () => {
        return currentContacts.filter(contacto => {
            const waId = contacto.waid ? contacto.waid : ""; // Convertir wa_id a cadena o establecer una cadena vacía
            const nombre = contacto.nombre ? contacto.nombre.toLowerCase() : ""; // Convertir nombre a minúsculas o establecer una cadena vacía
            const apellidopaterno = contacto.apellidopaterno ? contacto.apellidopaterno.toLowerCase() : ""; // Convertir apellidoPaterno a minúsculas o establecer una cadena vacía
            const apellidomaterno = contacto.apellidomaterno ? contacto.apellidomaterno.toLowerCase() : ""; // Convertir apellidoMaterno a minúsculas o establecer una cadena vacía
            const nombreperfil = contacto.nombreperfil ? contacto.nombreperfil.toLowerCase() : "";
            return waId.includes(busqueda) ||
                nombre.includes(busqueda.toLowerCase()) ||
                apellidopaterno.includes(busqueda.toLowerCase()) ||
                nombreperfil.includes(busqueda.toLowerCase()) ||
                apellidomaterno.includes(busqueda.toLowerCase());
        });
    };
    

    const contactosFiltrados = handleContactoFiltrado();

    return (
        <div>
            <div
                className={`modal ${showModal ? "show" : ""}`}
                style={{ display: showModal ? "block" : "none" }}
            >
                <div className="modal-dialog modal-xl text-center">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Mis Contactos</h5>
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
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">
                                        <FaIcons.FaSearch />
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    className="form-control form-control-lg"
                                    placeholder="Buscar contactos..."
                                    value={busqueda} // Conecta el valor del input con el estado
                                    onChange={handleBusquedaChange} 
                                />
                            </div>
                            <div className="table-responsive">
                                <table className="table table-striped table-bordered">
                                    <thead className="table-primary">
                                        <tr>
                                            <th scope="col">Wa_id</th>
                                            <th scope="col">Nombre</th>
                                            <th scope="col">Apellido Paterno</th>
                                            <th scope="col">Apellido Materno</th>
                                            <th scope="col">Perfil</th>
                                            <th scope="col">Fecha Registro</th>
                                            <th scope="col">Enviar Mensaje</th>
                                            <th colSpan="2">Opciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contactosFiltrados.map((contacto) => (
                                            <ListaContacto key={contacto.id} contacto={contacto}/>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="pagination-container">
                                <Pagination
                                    current={currentPage}
                                    total={Math.ceil(contacto.length / contactsPerPage)}
                                    onPageChange={handlePageChange}
                                />
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
