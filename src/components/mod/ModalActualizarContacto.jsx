import { useState, useEffect } from 'react';
import * as FaIcons from "react-icons/fa";
import { useForm } from "react-hook-form";
import './css/ModalRegistro.css';
import {peticionContacto, actualizarContacto} from '../../api/api.contacto';
import Swal from 'sweetalert2';

export default function ModalActualizarContacto({ showModal, handleCloseModal, contactoId }) {
    const [contacto, setContacto] = useState(null);
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();

    const onSubmit = handleSubmit(async (data) => {
        try{
            await actualizarContacto(contactoId, data);
            console.log(actualizarContacto)
            handleCloseModal();
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Contacto actualizado correctamente',
                confirmButtonText: 'Aceptar'
            });
        } catch (error) {
            console.error("error al actualizar el contacto", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al actualizar el contacto. Por favor, inténtalo de nuevo más tarde.',
                confirmButtonText: 'Aceptar'
            });
        }
    })

    useEffect(() => {
        async function cargarPeticion() {
            if(contactoId) {
                const res = await peticionContacto(contactoId);
                setValue("waid", res.data.waid);
                setValue("nombre", res.data.nombre);
                setValue("apellidopaterno", res.data.apellidopaterno);
                setValue("apellidomaterno", res.data.apellidomaterno);
                setValue("nombreperfil", res.data.nombreperfil);
                console.log(res);
            }
        }
        cargarPeticion();
    }, [contactoId]);


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
                            <h5 className="modal-title" id="modalTitle">Actualizar Contacto</h5>
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
                            {/* Contenido de la modal */}
                            <form onSubmit={onSubmit}>
                                <div className="form-group">
                                    <label htmlFor="waId">WA ID</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="waId"
                                        placeholder="Ingrese WA ID"
                                        {...register("waid", { required: true })}
                                    />
                                    {errors.waid && <span>Este campo es requerido</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="nombre">Nombre</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nombre"
                                        placeholder="Ingrese nombre"
                                        {...register("nombre", { required: true })}
                                    />
                                    {errors.nombre && <span>Este campo es requerido</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="apellidoPaterno">Apellido Paterno</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="apellidoPaterno"
                                        placeholder="Ingrese apellido paterno"
                                        {...register("apellidopaterno", { required: true })}
                                    />
                                    {errors.apellidopaterno && <span>Este campo es requerido</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="apellidoMaterno">Apellido Materno</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="apellidoMaterno"
                                        placeholder="Ingrese apellido materno"
                                        {...register("apellidomaterno", { required: true })}
                                    />
                                    {errors.apellidomaterno && <span>Este campo es requerido</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="perfil">Perfil</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="perfil"
                                        placeholder="Ingrese perfil"
                                        {...register("nombreperfil", { required: true })}
                                    />
                                    {errors.nombreperfil && <span>Este campo es requerido</span>}
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleCloseModal}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                    >
                                        Actualizar
                                    </button>
                                </div>
                            </form>
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
