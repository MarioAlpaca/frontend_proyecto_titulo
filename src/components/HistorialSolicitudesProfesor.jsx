import React, { useState, useEffect } from "react";
import api from "../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Headers"; // Importar el Header
import SidebarProfesor from "./SidebarProfesor"; // Importar el Sidebar del profesor

function HistorialSolicitudesProfesor() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null); // Obtener datos del usuario

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
        fetchHistorialSolicitudes();
    }, []);

    const fetchHistorialSolicitudes = async () => {
        setIsLoading(true);
        try {
            const res = await api.get("subjects/solicitudes/historial_profesor/");
            setSolicitudes(res.data);
        } catch (err) {
            toast.error("Error al cargar el historial de solicitudes: " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <Header user={user} />
            <div className="flex flex-grow">
                {/* Sidebar */}
                <SidebarProfesor />
                {/* Contenido principal */}
                <div className="flex-grow p-6">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h1 className="text-2xl font-bold mb-4 text-center">Historial de Solicitudes</h1>
                        {isLoading ? (
                            <p className="text-gray-500 text-center">Cargando historial...</p>
                        ) : solicitudes.length === 0 ? (
                            <p className="text-gray-500 italic text-center">
                                No hay solicitudes registradas.
                            </p>
                        ) : (
                            <div className="w-full overflow-x-auto">
                                <table className="table-auto w-full border-collapse border border-gray-300">
                                    <thead className="bg-gray-200">
                                        <tr>
                                            <th className="text-left px-4 py-2 border border-gray-300">Alumno</th>
                                            <th className="text-left px-4 py-2 border border-gray-300">Insumo</th>
                                            <th className="text-left px-4 py-2 border border-gray-300">Clase</th>
                                            <th className="text-center px-4 py-2 border border-gray-300">Cantidad</th>
                                            <th className="text-center px-4 py-2 border border-gray-300">Estado</th>
                                            <th className="text-center px-4 py-2 border border-gray-300">Motivo</th>
                                            <th className="text-center px-4 py-2 border border-gray-300">Fecha</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {solicitudes.map((solicitud) => (
                                            <tr key={solicitud.id} className="hover:bg-gray-100">
                                                <td className="px-4 py-2 border border-gray-300">
                                                    {solicitud.alumno}
                                                </td>
                                                <td className="px-4 py-2 border border-gray-300">
                                                    {solicitud.insumo}
                                                </td>
                                                <td className="px-4 py-2 border border-gray-300">
                                                    {solicitud.clase}
                                                </td>
                                                <td className="px-4 py-2 border border-gray-300 text-center">
                                                    {solicitud.cantidad_solicitada}
                                                </td>
                                                <td className="px-4 py-2 border border-gray-300 text-center">
                                                    {solicitud.estado === "aprobado" && (
                                                        <span className="text-green-600 font-semibold">
                                                            Aprobado
                                                        </span>
                                                    )}
                                                    {solicitud.estado === "rechazado" && (
                                                        <span className="text-red-600 font-semibold">
                                                            Rechazado
                                                        </span>
                                                    )}
                                                    {solicitud.estado === "pendiente" && (
                                                        <span className="text-yellow-600 font-semibold">
                                                            Pendiente
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2 border border-gray-300 text-center">
                                                    {solicitud.estado === "aprobado"
                                                        ? "Esta solicitud fue aprobada"
                                                        : solicitud.motivo_rechazo || "Sin motivo especificado"}
                                                </td>
                                                <td className="px-4 py-2 border border-gray-300 text-center">
                                                    {new Date(solicitud.fecha_solicitud).toLocaleDateString(
                                                        "es-ES",
                                                        {
                                                            day: "2-digit",
                                                            month: "2-digit",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HistorialSolicitudesProfesor;
