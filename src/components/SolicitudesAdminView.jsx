import React, { useState, useEffect } from "react";
import api from "../api";
import Header from "./Headers"; // Componente del header
import SidebarMenu from "./Sidebar"; // Sidebar del administrador
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SolicitudesAdminView() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [isLoadingSolicitudes, setIsLoadingSolicitudes] = useState(false);
    const [isProcessingId, setIsProcessingId] = useState(null); // Indicador de acción en curso para cada solicitud

    useEffect(() => {
        fetchSolicitudes();
    }, []);

    // Fetch de solicitudes pendientes
    const fetchSolicitudes = async () => {
        setIsLoadingSolicitudes(true);
        try {
            // Obtiene las solicitudes en estado "pendiente_admin" directamente desde el backend
            const res = await api.get("/subjects/solicitudes/solicitudes_administrador/");
            setSolicitudes(res.data);
        } catch (err) {
            toast.error("Error al obtener las solicitudes: " + err.message);
        } finally {
            setIsLoadingSolicitudes(false);
        }
    };

    // Aprobar o rechazar una solicitud
    const handleAccion = async (solicitudId, accion) => {
        try {
            setIsProcessingId(solicitudId);

            // Aprobar o rechazar la solicitud
            const payload = { accion };
            const res = await api.post(`/subjects/solicitudes/${solicitudId}/gestionar_solicitud/`, payload);

            if (accion === "aprobar") {
                toast.success("Solicitud aprobada correctamente y enviada al alumno.");
            } else if (accion === "rechazar") {
                toast.error("Solicitud rechazada y el alumno ha sido notificado.");
            }

            // Si la solicitud fue aprobada, intentar registrar la participación del alumno
            if (accion === "aprobar" && res.data.alumno_id && res.data.clase_id) {
                try {
                    const participationRes = await api.post(`/subjects/clases/${res.data.clase_id}/participar/`, {
                        alumno_id: res.data.alumno_id,
                    });
            
                    if (participationRes.data.status === "Ya estás participando en esta clase.") {
                        console.log("Participación ya registrada:", participationRes.data.status);
                    } else {
                        toast.success("Participación del alumno registrada correctamente.");
                    }
                } catch (participationError) {
                    console.error("Error al registrar la participación del alumno:", participationError);
                    toast.error("La solicitud fue aprobada, pero hubo un error al registrar la participación del alumno.");
                }
            }
            

            fetchSolicitudes(); // Actualizar la lista de solicitudes
        } catch (err) {
            console.error("Error al gestionar la solicitud:", err);
            toast.error("Error al gestionar la solicitud: " + (err.response?.data?.error || err.message));
        } finally {
            setIsProcessingId(null);
        }
    };

    return (
        <div className="flex min-h-screen flex-col">
            <Header user={JSON.parse(localStorage.getItem("user"))} />
            <div className="flex min-h-screen bg-gray-100">
                <SidebarMenu />
                <div className="flex-grow p-6">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Solicitudes de Insumos</h1>
                        {isLoadingSolicitudes ? (
                            <p className="text-center text-gray-500">Cargando solicitudes...</p>
                        ) : solicitudes.length === 0 ? (
                            <p className="text-center text-gray-500">No hay solicitudes pendientes.</p>
                        ) : (
                            <div className="space-y-4">
                                {solicitudes.map((solicitud) => (
                                    <div
                                        key={solicitud.id}
                                        className="border p-6 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 shadow-md hover:shadow-lg transition"
                                    >
                                        <div className="flex-1 mb-4 md:mb-0">
                                            <p className="text-lg font-semibold text-gray-700">
                                                Alumno: <span className="font-normal">{solicitud.alumno_nombre}</span>
                                            </p>
                                            <p className="text-lg font-semibold text-gray-700">
                                                Insumo: <span className="font-normal">{solicitud.insumo}</span> - {solicitud.cantidad_solicitada} {solicitud.unidad_medida}
                                            </p>
                                        </div>
                                        <div className="flex space-x-4">
                                            <button
                                                className={`px-6 py-2 rounded-lg transition ${
                                                    isProcessingId === solicitud.id
                                                        ? "bg-gray-400 text-white cursor-not-allowed"
                                                        : "bg-green-600 text-white hover:bg-green-700"
                                                }`}
                                                onClick={() => handleAccion(solicitud.id, "aprobar")}
                                                disabled={isProcessingId === solicitud.id}
                                            >
                                                {isProcessingId === solicitud.id ? "Procesando..." : "Aprobar"}
                                            </button>
                                            <button
                                                className={`px-6 py-2 rounded-lg transition ${
                                                    isProcessingId === solicitud.id
                                                        ? "bg-gray-400 text-white cursor-not-allowed"
                                                        : "bg-red-600 text-white hover:bg-red-700"
                                                }`}
                                                onClick={() => handleAccion(solicitud.id, "rechazar")}
                                                disabled={isProcessingId === solicitud.id}
                                            >
                                                {isProcessingId === solicitud.id ? "Procesando..." : "Rechazar"}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <ToastContainer
                position="top-center"
                autoClose={3000}
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

export default SolicitudesAdminView;
