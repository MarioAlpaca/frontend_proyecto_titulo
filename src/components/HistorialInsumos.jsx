import React, { useState, useEffect } from "react";
import SidebarMenu from "../components/Sidebar";
import Header from "../components/Headers";
import api from "../api";
import { useNavigate } from "react-router-dom";  // Asegúrate de importar useNavigate

function HistorialInsumos() {
    const [historial, setHistorial] = useState([]);
    const [filteredHistorial, setFilteredHistorial] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filtros
    const [searchInsumo, setSearchInsumo] = useState("");
    const [searchAsignatura, setSearchAsignatura] = useState("");

    const navigate = useNavigate();  // Usamos el hook navigate
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
        fetchHistorialInsumos();
    }, []);

    // Obtener historial de insumos
    const fetchHistorialInsumos = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("subjects/clases/reporte_insumos/");
            const data = response.data?.historial || [];
            setHistorial(data);
            setFilteredHistorial(data);
        } catch (error) {
            console.error("Error al obtener historial de insumos:", error);
            setError("No se pudo cargar el historial de insumos.");
        } finally {
            setLoading(false);
        }
    };

    // Aplicar filtros
    const applyFilters = () => {
        let filtered = [...historial];

        if (searchInsumo) {
            filtered = filtered.filter((item) =>
                item.insumo.toLowerCase().includes(searchInsumo.toLowerCase())
            );
        }

        if (searchAsignatura) {
            filtered = filtered.filter((item) =>
                item.asignatura.toLowerCase().includes(searchAsignatura.toLowerCase())
            );
        }

        setFilteredHistorial(filtered);
    };

    // Cambiar página
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // Datos de la página actual
    const currentData = filteredHistorial.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Header user={user} />
            <div className="flex flex-grow">
                <SidebarMenu />
                <div className="flex-grow p-6">
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h1 className="text-3xl font-bold text-center mb-6">Historial de Insumos</h1>

                        {loading ? (
                            <p className="text-gray-600 text-center">Cargando datos...</p>
                        ) : error ? (
                            <p className="text-red-500 text-center">{error}</p>
                        ) : (
                            <>
                                {/* Filtros */}
                                <div className="bg-gray-50 p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4">
                                    <div className="flex-grow">
                                        <label className="block text-sm font-semibold mb-2">Buscar Insumo</label>
                                        <input
                                            type="text"
                                            value={searchInsumo}
                                            onChange={(e) => setSearchInsumo(e.target.value)}
                                            className="border rounded px-4 py-2 w-full"
                                            placeholder="Nombre del insumo"
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <label className="block text-sm font-semibold mb-2">Buscar Asignatura</label>
                                        <input
                                            type="text"
                                            value={searchAsignatura}
                                            onChange={(e) => setSearchAsignatura(e.target.value)}
                                            className="border rounded px-4 py-2 w-full"
                                            placeholder="Nombre de la asignatura"
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <button
                                            onClick={applyFilters}
                                            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
                                        >
                                            Aplicar Filtros
                                        </button>
                                    </div>
                                </div>

                                {/* Tabla */}
                                <div className="overflow-auto">
                                    <table className="table-auto w-full border-collapse border border-gray-200">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="border border-gray-200 px-4 py-2">Insumo</th>
                                                <th className="border border-gray-200 px-4 py-2">Asignatura</th>
                                                <th className="border border-gray-200 px-4 py-2">Clase</th>
                                                <th className="border border-gray-200 px-4 py-2">Total Asignado</th>
                                                <th className="border border-gray-200 px-4 py-2">Utilizado</th>
                                                <th className="border border-gray-200 px-4 py-2">Devuelto</th>
                                                <th className="border border-gray-200 px-4 py-2">Extra</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentData.map((item, idx) => (
                                                <tr key={idx} className="text-center">
                                                    <td className="border border-gray-200 px-4 py-2">{item.insumo}</td>
                                                    <td className="border border-gray-200 px-4 py-2">{item.asignatura}</td>
                                                    <td className="border border-gray-200 px-4 py-2">{item.clase}</td>
                                                    <td className="border border-gray-200 px-4 py-2">{item.cantidad_total}</td>
                                                    <td className="border border-gray-200 px-4 py-2">{item.cantidad_utilizada}</td>
                                                    <td className="border border-gray-200 px-4 py-2">{item.cantidad_devuelta}</td>
                                                    <td className="border border-gray-200 px-4 py-2">{item.cantidad_extra}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Paginación */}
                                <div className="flex justify-center items-center mt-6 space-x-4">
                                    {Array.from(
                                        { length: Math.ceil(filteredHistorial.length / itemsPerPage) },
                                        (_, index) => (
                                            <button
                                                key={index + 1}
                                                onClick={() => handlePageChange(index + 1)}
                                                className={`px-4 py-2 rounded shadow ${
                                                    currentPage === index + 1
                                                        ? "bg-blue-500 text-white"
                                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                }`}
                                            >
                                                {index + 1}
                                            </button>
                                        )
                                    )}
                                </div>

                                {/* Botón Volver */}
                                <div className="mt-6 flex justify-center">
                                    <button
                                        onClick={() => navigate("/reportes")}
                                        className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
                                    >
                                        Volver a Reportes
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HistorialInsumos;
