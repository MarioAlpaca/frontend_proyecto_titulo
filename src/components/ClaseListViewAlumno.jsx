import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPlay, faClipboardList } from "@fortawesome/free-solid-svg-icons";
import api from "../api";
import Header from "./Headers";
import SidebarAlumno from "./SidebarAlumno";
import VerInsumosAsignadosModal from "./InsumosAsignadosAlumnos";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ClaseListViewAlumno() {
    const { asignaturaId } = useParams();
    const navigate = useNavigate();
    const [asignatura, setAsignatura] = useState(null);
    const [clases, setClases] = useState([]);
    const [numeroClases, setNumeroClases] = useState(0);
    const [user, setUser] = useState(null);
    const [isInsumosAsignadosModalOpen, setIsInsumosAsignadosModalOpen] = useState(false);
    const [insumosAsignados, setInsumosAsignados] = useState([]);
    const [isFinalizada, setIsFinalizada] = useState(false);
    const [selectedClaseId, setSelectedClaseId] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
        fetchAsignatura();
        fetchClases();
    }, []);

    const fetchAsignatura = async () => {
        try {
            const res = await api.get(`/subjects/asignaturas/${asignaturaId}/`);
            setAsignatura(res.data);
            setNumeroClases(res.data.numero_clases);
        } catch (err) {
            toast.error("Error al obtener la asignatura: " + err.message);
        }
    };

    const fetchClases = async () => {
        try {
            const res = await api.get(`/subjects/asignaturas/${asignaturaId}/clases/`);
            setClases(res.data.clases); // Asegúrate de que incluye el campo `ya_participa`
            setNumeroClases(res.data.numero_clases);
        } catch (err) {
            toast.error("Error al obtener las clases: " + err.message);
        }
    };

    const handleParticipar = async (claseId) => {
        try {
            await api.post(`/subjects/clases/${claseId}/participar/`);
            toast.success("Has ingresado a la clase.");
            fetchClases(); // Refresca las clases después de participar
        } catch (err) {
            if (err.response && err.response.data.error === "Ya estás participando en esta clase.") {
                toast.warn("Ya estás participando en esta clase.");
            } else {
                toast.error("Error al participar en la clase: " + err.message);
            }
        }
    };

    const handleSolicitarInsumos = async (solicitudes) => {
        if (!Array.isArray(solicitudes) || solicitudes.length === 0) {
            toast.error("No hay solicitudes válidas.");
            return;
        }

        try {
            await api.post(`/subjects/clases/${selectedClaseId}/solicitar_insumo/`, { solicitudes });
            toast.success("Solicitudes enviadas correctamente.", {
                position: "top-center",
                autoClose: 2000,
            });
            setIsInsumosAsignadosModalOpen(false); // Cierra el modal
            fetchClases(); // Actualiza la lista de clases
        } catch (err) {
            console.error("Error al enviar las solicitudes:", err.message);
            toast.error("Hubo un problema al enviar las solicitudes.");
        }
    };

    const handleViewInsumosAsignados = async (claseId, estadoClase) => {
        try {
            let endpoint = `/subjects/clases/${claseId}/mis_insumos/`;
            if (estadoClase === "finalizada") {
                endpoint = `/subjects/clases/${claseId}/historial_insumos_alumno/`;
                setIsFinalizada(true);
            } else {
                setIsFinalizada(false);
            }

            const res = await api.get(endpoint);
            setInsumosAsignados(res.data.insumos); // Actualizar el estado con los insumos asignados
            setSelectedClaseId(claseId); // **Actualiza el ID de la clase seleccionada**
            setIsInsumosAsignadosModalOpen(true); // Abrir el modal
        } catch (err) {
            toast.error("Error al obtener los insumos asignados: " + err.message);
        }
    };

    return (
        <div className="flex min-h-screen flex-col">
            <Header user={user} />
            <div className="flex min-h-screen bg-gray-100">
                <SidebarAlumno />
                <div className="flex-grow p-6">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h1 className="text-2xl font-bold my-4 text-center">
                            Asignatura: {asignatura?.nombre} (N° de Clases: {numeroClases})
                        </h1>
                        <div className="space-y-4">
                            {clases.map((clase) => (
                                <div
                                    key={clase.id}
                                    className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow"
                                >
                                    <div>
                                        <h3 className="font-bold text-lg">{clase.nombre}</h3>
                                        <p className="text-gray-600">Estado: {clase.estado}</p>
                                        <p className="text-gray-600">Asistencia: {clase.asistencia}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {clase.estado !== "finalizada" && (
                                            <button
                                                className={`flex items-center px-3 py-1 rounded-full ${
                                                    clase.estado === "iniciada" && !clase.ya_participa
                                                        ? "bg-green-500 text-white hover:bg-green-600"
                                                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                                                }`}
                                                onClick={() => handleParticipar(clase.id)}
                                                disabled={clase.estado !== "iniciada" || clase.ya_participa}
                                            >
                                                <FontAwesomeIcon icon={faPlay} className="mr-2" />
                                                Participar
                                            </button>
                                        )}
                                        {(clase.ya_participa || clase.estado === "finalizada") && (
                                            <button
                                                className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600"
                                                onClick={() => handleViewInsumosAsignados(clase.id, clase.estado)}
                                            >
                                                <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                                                {clase.estado === "finalizada" ? "Ver Insumos" : "Ver Insumos Asignados"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-start mt-6">
                            <button
                                className="flex items-center bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
                                onClick={() => navigate("/estudiante")}
                            >
                                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                                Volver a Asignaturas
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para mostrar insumos asignados */}
            <VerInsumosAsignadosModal
                isOpen={isInsumosAsignadosModalOpen}
                onClose={() => setIsInsumosAsignadosModalOpen(false)}
                insumos={insumosAsignados}
                selectedClaseId={selectedClaseId}
                onSolicitarInsumos={handleSolicitarInsumos}
                isFinalizada={isFinalizada}
            />
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                draggable
                theme="colored"
            />
        </div>
    );
}

export default ClaseListViewAlumno;
