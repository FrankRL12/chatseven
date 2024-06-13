import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import './css/ModalRegistro.css';
import * as FaIcons from "react-icons/fa";
import {registarContacto} from '../../api/api.contacto';
import { useParams } from "react-router-dom";
import Swal from 'sweetalert2';

export default function ModalRegistroContacto({ showModal, handleCloseModal, nombreUsuario, wa_id }) {
    const [waId, setWaId] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellidoPaterno, setApellidoPaterno] = useState("");
    const [apellidoMaterno, setApellidoMaterno] = useState("");
    const [perfil, setPerfil] = useState("");

    const {register, handleSubmit, formState: { errors }, setValue, reset , clearErrors} = useForm();

    const params = useParams();

    const onSubmit = handleSubmit(async (data) => {
        try {
            // Aquí debes realizar tu lógica para registrar el contacto
            // Si el registro es exitoso, muestra un mensaje de éxito
            await registarContacto(data);
            console.log('Registro guardado:', data);
            Swal.fire({
                title: '¡Éxito!',
                text: 'El contacto ha sido registrado exitosamente.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            reset(); // Reinicia el formulario
            handleCloseModal(); // Cierra el modal
        } catch (error) {
            // Si el wa_id ya está registrado, simplemente limpia los campos y cierra la modal
            if (error.response && error.response.data && error.response.data.error === 'El wa_id ya está registrado.') {
                // Limpiar la cache del formulario
                clearErrors(); // Limpia los errores
                reset(); // Reinicia el formulario
                handleCloseModal(); // Cierra el modal
            } else {
                // Si ocurre un error diferente, muestra un mensaje de error con SweetAlert2
                Swal.fire({
                    title: 'Error',
                    text: error.response.data.error || 'Ocurrió un error inesperado. Por favor, intenta de nuevo.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                clearErrors(); // Limpia los errores
                reset(); // Reinicia el formulario
                handleCloseModal(); // Cierra el modal
            }
        }
    });

    return (
        <div>
            <div
                className={`modal fade ${showModal ? "show" : ""}`}
                style={{ display: showModal ? "block" : "none" }}
                tabIndex="-1"
                role="dialog"
                aria-labelledby="modalTitle"
                aria-hidden={!showModal}
            >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalTitle">Registrar Contacto</h5>
                            <button
                                type="button"
                                className="close"
                                aria-label="Close"
                                onClick={handleCloseModal}
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={onSubmit}>
                                <div className="form-group">
                                    <label htmlFor="waId">WA ID</label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                <FaIcons.FaIdCard />
                                            </span>
                                        </div>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="waId"
                                            placeholder="Ingrese WA ID"
                                            {...register("waid", { required: true })}
                                            value={wa_id}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="nombre">Nombre</label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                <FaIcons.FaUser />
                                            </span>
                                        </div>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="nombre"
                                            placeholder="Ingrese nombre"
                                            {...register("nombre", { required: true })}
                                            onChange={(e) => setNombre(e.target.value)}
                                
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="apellidoPaterno">Apellido Paterno</label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                <FaIcons.FaUser />
                                            </span>
                                        </div>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="apellidoPaterno"
                                            placeholder="Ingrese apellido paterno"
                                            {...register("apellidopaterno", { required: true })}
                                            onChange={(e) => setApellidoPaterno(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="apellidoMaterno">Apellido Materno</label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                <FaIcons.FaUser />
                                            </span>
                                        </div>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="apellidoMaterno"
                                            placeholder="Ingrese apellido materno"
                                            {...register("apellidomaterno", { required: true })}
                                            onChange={(e) => setApellidoMaterno(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="perfil">Perfil</label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                <FaIcons.FaBriefcase />
                                            </span>
                                        </div>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="perfil"
                                            placeholder="Ingrese perfil"
                                            value={nombreUsuario}
                                            {...register("nombreperfil", { required: true })}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Guardar
                            </button>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleCloseModal}
                            >
                                Cancelar
                            </button>
                            
                        </div>
                    </div>
                </div>
            </div>
            {showModal && (
                <div className="modal-backdrop fade show" onClick={handleCloseModal}></div>
            )}
        </div>
    );
}
