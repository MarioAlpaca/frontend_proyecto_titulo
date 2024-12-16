import React, { useEffect, useState } from "react";
import api from "../api";
import Header from "./Headers";
import SidebarAlumno from "./SidebarAlumno";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function NotificacionesAlumnoView() {
    const [notificaciones, setNotificaciones] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        fetchNotificaciones();
    }, []);

    const fetchNotificaciones = async () => {
        setIsLoading(true);
        try {
            const res = await api.get("/subjects/notificaciones/alumno/");
            setNotificaciones(res.data);
        } catch (err) {
            toast.error("Error al obtener las notificaciones: " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const eliminarNotificacion = async (notificacionId) => {
        setIsProcessing(true);
        try {
            await api.delete(`/subjects/notificaciones/${notificacionId}/eliminar/`);
            setNotificaciones((prev) =>
                prev.filter((notificacion) => notificacion.id !== notificacionId)
            );
            toast.success("Notificación eliminada correctamente.");
        } catch (err) {
            toast.error("Error al eliminar la notificación: " + err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const marcarComoLeida = async (notificacionId) => {
        setIsProcessing(true);
        try {
            await api.post(`/subjects/notificaciones/${notificacionId}/marcar_leida/`);
            setNotificaciones((prev) =>
                prev.map((notificacion) =>
                    notificacion.id === notificacionId
                        ? { ...notificacion, leida: true }
                        : notificacion
                )
            );
            toast.info("Notificación marcada como leída.");
        } catch (err) {
            toast.error("Error al marcar la notificación como leída: " + err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col">
            <Header user={JSON.parse(localStorage.getItem("user"))} />
            <div className="flex min-h-screen bg-gray-100">
                <SidebarAlumno />
                <div className="flex-grow p-6">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h1 className="text-2xl font-bold mb-4 text-center">Notificaciones</h1>
                        {isLoading ? (
                            <p className="text-center text-gray-500">Cargando notificaciones...</p>
                        ) : notificaciones.length === 0 ? (
                            <p className="text-center text-gray-500">No tienes notificaciones.</p>
                        ) : (
                            <ul className="space-y-4">
                                {notificaciones.map((notificacion) => (
                                    <li
                                        key={notificacion.id}
                                        className={`border p-4 rounded-lg shadow ${
                                            notificacion.leida ? "bg-gray-50" : "bg-white"
                                        }`}
                                    >
                                        <div className="flex flex-col sm:flex-row justify-between items-center">
                                            <div className="text-center sm:text-left">
                                                <p className="font-semibold">{notificacion.titulo}</p>
                                                <p className="text-gray-600">{notificacion.mensaje}</p>
                                                {notificacion.motivo_rechazo ? (
                                                    <p className="text-gray-500 text-sm mt-2">
                                                        Motivo del rechazo: {notificacion.motivo_rechazo}
                                                    </p>
                                                ) : (
                                                    <p className="text-gray-500 text-sm mt-2">
                                                        Motivo del rechazo: Sin motivo específico.
                                                    </p>
                                                )}
                                                <p className="text-gray-400 text-sm mt-2">
                                                    Fecha: {new Date(notificacion.fecha_creacion).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="flex space-x-2 mt-3 sm:mt-0">
                                                {!notificacion.leida && (
                                                    <button
                                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none"
                                                        onClick={() => marcarComoLeida(notificacion.id)}
                                                        disabled={isProcessing}
                                                    >
                                                        Marcar como Leída
                                                    </button>
                                                )}
                                                {notificacion.leida && (
                                                    <button
                                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none"
                                                        onClick={() => eliminarNotificacion(notificacion.id)}
                                                        disabled={isProcessing}
                                                    >
                                                        Eliminar
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
            {/* React-Toastify Container */}
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    );
}

export default NotificacionesAlumnoView;
