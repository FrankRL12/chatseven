import axios from 'axios';


const contactoApi = axios.create ({
    baseURL: "http://127.0.0.1:8000/api/api/v1/contacto/"
})

const multimediaApi = axios.create ({
    baseURL: "http://127.0.0.1:8000/api/api/v1/archivo/"
})

const guardarMensajeApi = axios.create({
    baseURL: "http://127.0.0.1:8000/api/api/v1/mensaje/"
})

const usuarioApi = axios.create({
    baseURL: "http://127.0.0.1:8000/api/api/v1/usuario/"
})

export const todosContacto = () => contactoApi.get("/");

export const peticionContacto = (id) => contactoApi.get(`/${id}/`);

export const eliminarContacto = (id) => contactoApi.delete(`/${id}`);

export const registarContacto = (contacto) => contactoApi.post("/", contacto);

export const actualizarContacto = (id, contacto) => contactoApi.put(`/${id}/`, contacto);

export const multimedia = () => multimediaApi.get("/");

export const guardarMensaje = (mensaje) => guardarMensajeApi.post("/", mensaje);

export const todosMensajes = () => guardarMensajeApi.get("/");

//Usuario 
export const usuarioMultiuso = (usuario) => usuarioApi.post("/", usuario);

