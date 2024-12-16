import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faArrowLeft, faEye } from "@fortawesome/free-solid-svg-icons";
import api from "../api";
import Header from "./Headers";
import SidebarProfesor from "./SidebarProfesor";
import ConfirmModal from "./ConfirmModalClases";
import VerInsumosModal from "./VerInsumosModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ClaseListViewProfesor() {
    const { asignaturaId } = useParams();
    const navigate = useNavigate();
    const [asignatura, setAsignatura] = useState(null);
    const [clases, setClases] = useState([]);
    const [numeroClases, setNumeroClases] = useState(0);
    const [user, setUser] = useState(null);
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState("");
    const [isVerInsumosModalOpen, setVerInsumosModalOpen] = useState(false);
    const [insumosAsignados, setInsumosAsignados] = useState([]);
    const [selectedClaseId, setSelectedClaseId] = useState(null);
    const [selectedClaseEstado, setSelectedClaseEstado] = useState(null);

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
            setClases(res.data.clases);
            setNumeroClases(res.data.numero_clases);
        } catch (err) {
            toast.error("Error al obtener las clases: " + err.message);
        }
    };

    const handleChangeEstadoClase = (claseId, nuevoEstado) => {
        setConfirmMessage(`¿Está seguro de que desea cambiar el estado de la clase a "${nuevoEstado}"?`);
        setConfirmAction(() => async () => {
            try {
                await api.post(`/subjects/clases/${claseId}/cambiar_estado/`, { estado: nuevoEstado });
                fetchClases();
                toast.success("Estado de la clase cambiado correctamente.");
            } catch (err) {
                toast.error("Error al cambiar el estado de la clase: " + err.message);
            }
        });
        setConfirmModalOpen(true);
    };

    const handleFinalizarClase = (claseId) => {
        setConfirmMessage("¿Está seguro de que desea finalizar la clase? Esto devolverá los insumos no utilizados al inventario y rechazará las solicitudes pendientes.");
        setConfirmAction(() => async () => {
            try {
                await api.post(`/subjects/clases/${claseId}/finalizar_clase/`);
                toast.success("Clase finalizada correctamente. Las solicitudes pendientes han sido rechazadas.");
                fetchClases();
            } catch (err) {
                toast.error("Error al finalizar la clase: " + err.message);
            }
        });
        setConfirmModalOpen(true);
    };

    const handleViewInsumos = async (claseId, estadoClase) => {
        try {
            let res;
            let insumos = []; // Inicializar insumos vacío
    
            if (estadoClase === "finalizada") {
                res = await api.get(`/subjects/clases/${claseId}/historial_insumos/`);
                insumos = res.data; // Directo del historial
            } else {
                res = await api.get(`/subjects/clases/${claseId}/insumos_asignados/`);
                insumos = res.data.insumos || []; // Obtener insumos o vacío si no existen
            }
    
            setInsumosAsignados(insumos); // Establecer los insumos obtenidos
            setSelectedClaseEstado(estadoClase); // Almacenar el estado actual de la clase
            setVerInsumosModalOpen(true);
        } catch (err) {
            toast.error("Error al obtener los insumos: " + (err.response?.data?.error || err.message));
        }
    };
    
    return (
        <div className="flex min-h-screen flex-col">
            <Header user={user} />
            <div className="flex min-h-screen bg-gray-100">
                <SidebarProfesor />
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
                                        {clase.solicitudes_pendientes && (
                                            <p className="text-red-500 italic">Hay solicitudes de insumos pendientes.</p>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {clase.estado === "asignada" ? (
                                            <button
                                                className="flex items-center bg-white border border-gray-300 text-green-600 px-3 py-1 rounded-full hover:bg-green-100"
                                                onClick={() => handleChangeEstadoClase(clase.id, "iniciada")}
                                            >
                                                <FontAwesomeIcon icon={faCheck} className="text-green-600 mr-1" />
                                                Iniciar Clase
                                            </button>
                                        ) : clase.estado === "iniciada" ? (
                                            <button
                                                className="flex items-center bg-white border border-gray-300 text-red-600 px-3 py-1 rounded-full hover:bg-red-100"
                                                onClick={() => handleFinalizarClase(clase.id)}
                                            >
                                                <FontAwesomeIcon icon={faCheck} className="text-red-600 mr-1" />
                                                Finalizar Clase
                                            </button>
                                        ) : clase.estado === "finalizada" ? (
                                            <p className="text-gray-500 italic">La clase ya ha finalizado.</p>
                                        ) : (
                                            <p className="text-gray-500 italic">No se puede iniciar todavía.</p>
                                        )}
                                        <button
                                            className="flex items-center bg-white border border-gray-300 text-orange-600 px-3 py-1 rounded-full hover:bg-orange-100"
                                            onClick={() => handleViewInsumos(clase.id, clase.estado)} // Pasa el estado actual de la clase
                                        >
                                            <FontAwesomeIcon icon={faEye} className="text-orange-600 mr-1" />
                                            Ver Insumos
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-start mt-6">
                            <button
                                className="flex items-center bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
                                onClick={() => navigate("/profesor")}
                            >
                                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                                Volver a Asignaturas
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={confirmAction}
                title="Confirmación"
                message={confirmMessage}
            />
            <VerInsumosModal
                isOpen={isVerInsumosModalOpen}
                onClose={() => setVerInsumosModalOpen(false)}
                insumos={insumosAsignados}
                isFinalizada={selectedClaseEstado === "finalizada"} // Según el estado de la clase
                isIniciada={selectedClaseEstado === "iniciada"}
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

export default ClaseListViewProfesor;
