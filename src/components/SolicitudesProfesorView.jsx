import React, { useState, useEffect } from "react";
import api from "../api";
import Header from "./Headers";
import SidebarProfesor from "./SidebarProfesor";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SolicitudesProfesorView() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        fetchSolicitudes();
    }, []);

    const fetchSolicitudes = async () => {
        setIsLoading(true);
        try {
            const res = await api.get("/subjects/solicitudes/profesor/");
            setSolicitudes(res.data);
        } catch (err) {
            toast.error("Error al obtener las solicitudes: " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAccion = async (solicitudId, accion) => {
        try {
            setIsProcessing(true);
    
            // Aprobar o rechazar la solicitud
            const payload = { accion };
            const res = await api.post(`/subjects/solicitudes/${solicitudId}/gestionar_solicitud/`, payload);
    
            if (accion === "aprobar") {
                toast.success("Solicitud aprobada y enviada al administrador para su aprobación final.");
            } else if (accion === "rechazar") {
                toast.success("Solicitud rechazada y el alumno ha sido notificado.");
            }
    
            fetchSolicitudes(); // Actualizar la lista de solicitudes
        } catch (err) {
            toast.error("Error al gestionar la solicitud: " + (err.response?.data?.error || err.message));
        } finally {
            setIsProcessing(false);
        }
    };
    

    return (
        <div className="flex min-h-screen flex-col">
            <Header user={JSON.parse(localStorage.getItem("user"))} />
            <div className="flex min-h-screen bg-gray-100">
                <SidebarProfesor />
                <div className="flex-grow p-6">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Solicitudes de Insumos</h1>
                        {isLoading ? (
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
                                                Alumno: <span className="font-normal">{solicitud.alumno}</span>
                                            </p>
                                            <p className="text-lg font-semibold text-gray-700">
                                                Insumo: <span className="font-normal">{solicitud.insumo}</span> - {solicitud.cantidad_solicitada} {solicitud.unidad_medida}
                                            </p>
                                        </div>
                                        <div className="flex space-x-4">
                                            <button
                                                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                                                onClick={() => handleAccion(solicitud.id, "aprobar")}
                                                disabled={isProcessing}
                                            >
                                                Aprobar
                                            </button>
                                            <button
                                                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                                                onClick={() => handleAccion(solicitud.id, "rechazar")}
                                                disabled={isProcessing}
                                            >
                                                Rechazar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
        </div>
    );
}

export default SolicitudesProfesorView;
