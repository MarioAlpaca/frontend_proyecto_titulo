// ClaseListView.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEye, faMinus, faArrowLeft } from "@fortawesome/free-solid-svg-icons"; // Añade los iconos
import api from "../api";
import Header from "./Headers";
import SidebarMenu from "./Sidebar";
import ConfirmModal from "./ConfirmModalClases";
import AsignarInsumosModal from "./AsignarInsumosModal";
import VerInsumosModal from "./VerInsumosModal";
import QuitarInsumosModal from "./QuitarInsumosModal"; // Importa el nuevo modal para quitar insumos
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ClaseListView() {
    const { asignaturaId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const refreshAsignaturas = location.state?.refreshAsignaturas;
    const [asignatura, setAsignatura] = useState(null);
    const [clases, setClases] = useState([]);
    const [numeroClases, setNumeroClases] = useState(0);
    const [user, setUser] = useState(null);
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState("");
    const [isInsumoModalOpen, setInsumoModalOpen] = useState(false);
    const [isQuitarInsumoModalOpen, setQuitarInsumoModalOpen] = useState(false);
    const [selectedClaseId, setSelectedClaseId] = useState(null);
    const [isVerInsumosModalOpen, setVerInsumosModalOpen] = useState(false);
    const [insumosAsignados, setInsumosAsignados] = useState([]);
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

    const fetchInsumosAsignados = async (claseId) => {
        try {
            const res = await api.get(`/subjects/clases/${claseId}/insumos_asignados/`);
            setInsumosAsignados(res.data.insumos);
        } catch (err) {
            toast.error("Error al obtener insumos asignados: " + err.message);
        }
    };

    const handleAddClase = () => {
        setConfirmMessage("¿Está seguro de que desea añadir una nueva clase?");
        setConfirmAction(() => async () => {
            try {
                const nuevaClaseNombre = `Clase ${numeroClases + 1}`;
                const res = await api.post(`/subjects/asignaturas/${asignaturaId}/agregar_clase/`, {
                    nombre: nuevaClaseNombre,
                    estado: "pendiente",
                    profesor: asignatura.profesor,
                });
                setClases([...clases, res.data.clase]);
                setNumeroClases(res.data.numero_clases);
                toast.success("Clase añadida con éxito.");
                refreshAsignaturas && refreshAsignaturas();
            } catch (err) {
                toast.error("Error al añadir la clase: " + err.message);
            }
        });
        setConfirmModalOpen(true);
    };

    const handleDeleteClase = (claseId) => {
        setConfirmMessage("¿Está seguro de que desea eliminar esta clase?");
        setConfirmAction(() => async () => {
            try {
                await api.delete(`/subjects/clases/${claseId}/`);
                setClases(clases.filter((clase) => clase.id !== claseId));
                setNumeroClases(numeroClases - 1);
                toast.success("Clase eliminada con éxito.");
                refreshAsignaturas && refreshAsignaturas();
            } catch (err) {
                toast.error("Error al eliminar la clase: " + err.message);
            }
        });
        setConfirmModalOpen(true);
    };

    const handleOpenInsumoModal = (claseId) => {
        setSelectedClaseId(claseId);
        setInsumoModalOpen(true);
    };

    const handleAssignInsumos = async (insumosToAssign) => {
        try {
            const formattedInsumos = insumosToAssign.map((insumo) => ({
                insumo_id: parseInt(insumo.insumo_id, 10),
                cantidad: parseFloat(insumo.cantidad),
            }));
            await api.post(`/subjects/clases/${selectedClaseId}/asignar_insumos/`, {
                insumos: formattedInsumos,
            });
            setInsumoModalOpen(false);
            toast.success("Insumos asignados con éxito.");
            fetchClases();
        } catch (err) {
            toast.error(`Error al asignar insumos: ${err.response?.data?.error || err.message}`);
        }
    };

    const handleViewInsumos = async (claseId, estadoClase) => {
        try {
            let res;
            let insumos = [];
            if (estadoClase === "finalizada") {
                res = await api.get(`/subjects/clases/${claseId}/historial_insumos/`);
                insumos = res.data;
            } else {
                res = await api.get(`/subjects/clases/${claseId}/insumos_asignados/`);
                insumos = res.data.insumos || [];
            }
            setInsumosAsignados(insumos);
            setSelectedClaseEstado(estadoClase);
            setVerInsumosModalOpen(true);
        } catch (err) {
            toast.error("Error al obtener los insumos: " + (err.response?.data?.error || err.message));
        }
    };

    const handleQuitarInsumos = async (insumoId, cantidad) => {
        if (!insumoId || !cantidad || cantidad <= 0) {
            toast.warning("Por favor ingresa un ID de insumo válido y una cantidad positiva.");
            return;
        }
    
        try {
            await api.post(`/subjects/clases/${selectedClaseId}/quitar_insumos/`, {
                insumo_id: insumoId,
                cantidad: cantidad,
            });
    
            // Después de quitar insumos, verificar cuántos quedan
            const res = await api.get(`/subjects/clases/${selectedClaseId}/insumos_asignados/`);
            const remainingInsumos = res.data.insumos || [];
    
            // Si no quedan insumos asignados, cambiar el estado a pendiente
            if (remainingInsumos.length === 0) {
                await api.patch(`/subjects/clases/${selectedClaseId}/`, {
                    estado: "pendiente",
                });
                toast.info("Clase marcada como pendiente debido a la falta de insumos.");
                fetchClases(); // Refrescar las clases después del cambio de estado
            } else {
                setInsumosAsignados(remainingInsumos); // Actualizar insumos asignados en el estado
            }
            toast.success("Insumos quitados con éxito.");
        } catch (err) {
            toast.error("Error al obtener los insumos: " + (err.response?.data?.error || err.message));
        }
    };

    const handleOpenQuitarInsumoModal = async (claseId) => {
        await fetchInsumosAsignados(claseId);
        setSelectedClaseId(claseId);
        setQuitarInsumoModalOpen(true);
    };

    return (
        <div className="flex min-h-screen flex-col">
            <Header user={user} />
            <div className="flex min-h-screen bg-gray-100">
                <SidebarMenu />
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
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {clase.estado !== "finalizada" && (
                                            <>
                                                <button
                                                    className={`flex items-center px-3 py-1 rounded-full ${
                                                        clase.estado === "iniciada"
                                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                            : "bg-white border border-gray-300 text-blue-600 hover:bg-blue-100"
                                                    }`}
                                                    onClick={() => handleOpenInsumoModal(clase.id)}
                                                    disabled={clase.estado === "iniciada"}
                                                >
                                                    <FontAwesomeIcon icon={faPlus} className="mr-1" />
                                                    Añadir insumos
                                                </button>

                                                <button
                                                    className={`flex items-center px-3 py-1 rounded-full ${
                                                        clase.estado === "iniciada"
                                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                            : "bg-white border border-gray-300 text-red-600 hover:bg-red-100"
                                                    }`}
                                                    onClick={() => handleOpenQuitarInsumoModal(clase.id)}
                                                    disabled={clase.estado === "iniciada"}
                                                >
                                                    <FontAwesomeIcon icon={faMinus} className="mr-1" />
                                                    Quitar insumos
                                                </button>

                                                <button
                                                    className={`flex items-center px-3 py-1 rounded-full ${
                                                        clase.estado === "iniciada"
                                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                            : "bg-white border border-gray-300 text-red-600 hover:bg-red-100"
                                                    }`}
                                                    onClick={() => handleDeleteClase(clase.id)}
                                                    disabled={clase.estado === "iniciada"}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} className="mr-1" />
                                                    Eliminar
                                                </button>
                                            </>
                                        )}
                                        <button
                                            className="flex items-center bg-white border border-gray-300 text-orange-600 px-3 py-1 rounded-full hover:bg-orange-100"
                                            onClick={() => handleViewInsumos(clase.id, clase.estado)}
                                        >
                                            <FontAwesomeIcon icon={faEye} className="text-orange-600 mr-1" />
                                            Ver Insumos
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex space-x-4 mt-4">
                            <button
                                className="flex items-center bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600"
                                onClick={handleAddClase}
                            >
                                <FontAwesomeIcon icon={faPlus} className="mr-1" />
                                Añadir Clase
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
                                onClick={() => navigate("/asignaturas")}
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

            <AsignarInsumosModal
                isOpen={isInsumoModalOpen}
                onClose={() => setInsumoModalOpen(false)}
                claseId={selectedClaseId}
                onSubmit={handleAssignInsumos}
            />

            <VerInsumosModal
                isOpen={isVerInsumosModalOpen}
                onClose={() => setVerInsumosModalOpen(false)}
                insumos={insumosAsignados}
                isFinalizada={selectedClaseEstado === "finalizada"}
                isIniciada={selectedClaseEstado === "iniciada"}
            />

            <QuitarInsumosModal
                isOpen={isQuitarInsumoModalOpen}
                onClose={() => setQuitarInsumoModalOpen(false)}
                insumos={insumosAsignados}
                onRemoveInsumo={handleQuitarInsumos}
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

export default ClaseListView;
