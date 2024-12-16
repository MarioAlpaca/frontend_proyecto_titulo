import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarMenu from "../components/Sidebar";
import AsignaturaCard from "../components/AsignaturaCard";
import Header from "../components/Headers";
import AsignaturaFormModal from "../components/AsignaturaFormModal";
import DeleteConfirmModalAsignatura from "../components/DeleteAsignatura";
import api from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function Asignaturas() {
    const [asignaturas, setAsignaturas] = useState([]);
    const [user, setUser] = useState(null);
    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [selectedAsignatura, setSelectedAsignatura] = useState(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
        fetchAsignaturas();
    }, []);

    const fetchAsignaturas = () => {
        api.get("/subjects/asignaturas/")
            .then((res) => setAsignaturas(res.data))
            .catch((err) => alert("Error al obtener las asignaturas: " + err.message));
    };

    const handleAddAsignatura = () => {
        setSelectedAsignatura(null);
        setFormModalOpen(true);
    };

    const handleViewClases = (asignatura) => {
        console.log("Navegando a clases de la asignatura con ID:", asignatura.id);
        navigate(`/asignatura/${asignatura.id}/clases`); // Navega a la ruta de clases
    };

    const handleEditAsignatura = (asignatura) => {
        setSelectedAsignatura(asignatura);
        setFormModalOpen(true);
    };

    const handleDeleteAsignatura = (asignatura) => {
        setSelectedAsignatura(asignatura);
        setDeleteModalOpen(true);
    };

    const confirmDeleteAsignatura = () => {
        if (!selectedAsignatura) return;

        api.delete(`/subjects/asignaturas/${selectedAsignatura.id}/`)
            .then(() => {
                fetchAsignaturas();
                setDeleteModalOpen(false);
            })
            .catch((err) => alert("Error al eliminar la asignatura: " + err.message));
    };

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Header user={user} />
            <div className="flex min-h-screen bg-gray-100">
                <SidebarMenu />
                <div className="flex-grow p-6">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                            Asignaturas
                        </h1>
                        {asignaturas.length === 0 ? (
                            <p className="text-center text-gray-600 text-lg italic">
                                No hay asignaturas registradas en este momento.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {asignaturas.map((asignatura) => (
                                    <AsignaturaCard
                                        key={asignatura.id}
                                        id={asignatura.id}
                                        nombre={asignatura.nombre}
                                        numeroClases={asignatura.numero_clases}
                                        profesor={asignatura.profesor_nombre}
                                        numeroAlumnos={asignatura.alumnos_nombres ? asignatura.alumnos_nombres.length : 0}
                                        userRole="1"
                                        onView={() => handleViewClases(asignatura)}
                                        onEdit={() => handleEditAsignatura(asignatura)}
                                        onDelete={() => handleDeleteAsignatura(asignatura)}
                                    />
                                ))}
                            </div>
                        )}
                        <div className="flex justify-center mt-8">
                            <button
                                className="flex items-center bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 shadow-md transition-transform transform hover:scale-105"
                                onClick={handleAddAsignatura}
                            >
                                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                Añadir Asignatura
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Añadir/Editar Asignatura */}
            {isFormModalOpen && (
                <AsignaturaFormModal
                    onClose={() => setFormModalOpen(false)}
                    refreshAsignaturas={fetchAsignaturas}
                    asignatura={selectedAsignatura}
                />
            )}

            {/* Modal de Confirmación de Eliminación */}
            {isDeleteModalOpen && (
                <DeleteConfirmModalAsignatura
                    asignatura={selectedAsignatura}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={confirmDeleteAsignatura}
                />
            )}
        </div>
    );
}

export default Asignaturas;
