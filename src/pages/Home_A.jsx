import React, { useState, useEffect } from "react";
import InsumoTable from "../components/InsumoTable";
import InsumoFormModal from "../components/InsumoFormModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import Header from "../components/Headers";
import SidebarMenu from "../components/Sidebar";
import api from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSearch } from "react-icons/fa"; // Importar el icono de búsqueda desde react-icons

function HomeAdmin() {
    const [insumos, setInsumos] = useState([]);
    const [filteredInsumos, setFilteredInsumos] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedInsumo, setSelectedInsumo] = useState(null);
    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [user, setUser] = useState(null);

    // Estados para paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
        fetchInsumos();
    }, [currentPage]);

    useEffect(() => {
        // Filtrar los insumos cuando el término de búsqueda cambia
        const results = insumos.filter((insumo) =>
            insumo.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredInsumos(results);
    }, [searchTerm, insumos]);

    const fetchInsumos = () => {
        api.get(`/insumos/insumos/?page=${currentPage}`)
            .then((res) => {
                setInsumos(res.data.results || []);
                setFilteredInsumos(res.data.results || []);
                const totalItems = res.data.count;
                const itemsPerPage = 10;
                setTotalPages(Math.ceil(totalItems / itemsPerPage));
            })
            .catch((err) => {
                console.error("Error al obtener los insumos:", err.message);
                toast.error(`Error al obtener los insumos: ${err.message}`, {
                    position: "top-center",
                });
            });
    };

    const handleAddInsumo = () => {
        setSelectedInsumo(null);
        setFormModalOpen(true);
    };

    const handleEditInsumo = (insumo) => {
        if (insumo.asignado_clase_iniciada) {
            setSelectedInsumo({ ...insumo, editCantidadOnly: true });
        } else {
            setSelectedInsumo({ ...insumo, editCantidadOnly: false });
        }
        setFormModalOpen(true);
    };

    const handleDeleteInsumo = (insumo) => {
        if (insumo.asignado_clase_iniciada) {
            toast.error("No se puede eliminar el insumo ya que se encuentra asignado a una clase", {
                position: "top-center",
            });
        } else {
            setSelectedInsumo(insumo);
            setDeleteModalOpen(true);
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Header user={user} />
            <div className="flex flex-grow">
                <SidebarMenu />
                <div className="flex-grow p-6">
                    <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
                        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Gestión de Insumos</h1>

                        {/* Barra de búsqueda */}
                        <div className="flex justify-center items-center">
                            <div className="relative w-full max-w-lg">
                                <input
                                    type="text"
                                    placeholder="Buscar insumo por nombre"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full border border-gray-300 rounded-full pl-4 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                                />
                                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent p-2 focus:outline-none">
                                    <FaSearch className="text-gray-500" />
                                </button>
                            </div>
                        </div>

                        {/* Mensaje de no resultados */}
                        {filteredInsumos.length === 0 ? (
                            <div className="text-center text-gray-600 mt-6">
                                {insumos.length === 0
                                    ? "No hay insumos disponibles."
                                    : "No se han encontrado insumos que coincidan con el término de búsqueda."}
                            </div>
                        ) : (
                            <InsumoTable
                                insumos={filteredInsumos}
                                onEdit={handleEditInsumo}
                                onDelete={handleDeleteInsumo}
                            />
                        )}

                        {/* Botón para añadir insumo */}
                        <div className="flex justify-center">
                            <button
                                className="bg-green-500 text-white px-6 py-3 rounded-lg shadow hover:bg-green-600 transition-all duration-200"
                                onClick={handleAddInsumo}
                            >
                                + Agregar Insumo
                            </button>
                        </div>

                        {/* Paginación */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center mt-6 space-x-4 text-gray-700">
                                <button
                                    className={`px-4 py-2 rounded ${
                                        currentPage === 1
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : "bg-blue-500 text-white hover:bg-blue-600"
                                    }`}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Anterior
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        className={`px-3 py-2 rounded ${
                                            currentPage === i + 1
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-200 hover:bg-gray-300"
                                        }`}
                                        onClick={() => handlePageChange(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    className={`px-4 py-2 rounded ${
                                        currentPage === totalPages
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : "bg-blue-500 text-white hover:bg-blue-600"
                                    }`}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Siguiente
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Modales */}
                    {isFormModalOpen && (
                        <InsumoFormModal
                            insumo={selectedInsumo}
                            onClose={() => setFormModalOpen(false)}
                            refreshInsumos={fetchInsumos}
                        />
                    )}
                    {isDeleteModalOpen && (
                        <DeleteConfirmModal
                            insumo={selectedInsumo}
                            onClose={() => setDeleteModalOpen(false)}
                            refreshInsumos={fetchInsumos}
                        />
                    )}
                </div>
            </div>
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

export default HomeAdmin;
