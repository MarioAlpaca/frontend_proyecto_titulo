import React, { useEffect, useState } from "react";
import api from "../api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SidebarMenu from "../components/Sidebar";
import Header from "../components/Headers";

function HistorialSolicitudes() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filtros
    const [estado, setEstado] = useState("");
    const [fechaInicio, setFechaInicio] = useState(null);
    const [fechaFin, setFechaFin] = useState(null);

    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
        fetchHistorialSolicitudes();
    }, []);

    // Fetch data
    const fetchHistorialSolicitudes = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("subjects/solicitudes/historial_solicitudes/");
            const data = response.data?.solicitudes || [];
            setSolicitudes(data);
            setFilteredSolicitudes(data); // Inicialmente, mostrar todas las solicitudes
        } catch (error) {
            console.error("Error al obtener historial de solicitudes:", error);
            setError("No se pudieron cargar las solicitudes.");
        } finally {
            setLoading(false);
        }
    };

    // Función para formatear fechas al formato DD/MM/YYYY
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    // Aplicar filtros
    const applyFilters = () => {
        let filtered = [...solicitudes];

        if (estado) {
            filtered = filtered.filter((solicitud) => solicitud.estado === estado);
        }

        if (fechaInicio && fechaFin) {
            filtered = filtered.filter((solicitud) => {
                const fechaSolicitud = new Date(solicitud.fecha);
                return fechaSolicitud >= fechaInicio && fechaSolicitud <= fechaFin;
            });
        }

        setFilteredSolicitudes(filtered);
        setCurrentPage(1); // Reiniciar a la primera página al aplicar filtros
    };

    // Paginación
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedSolicitudes = filteredSolicitudes.slice(startIndex, endIndex);

    const totalPages = Math.ceil(filteredSolicitudes.length / itemsPerPage);

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <Header user={user} />
            <div className="flex flex-grow">
                {/* Sidebar */}
                <SidebarMenu />
                {/* Contenido principal */}
                <div className="flex-grow p-6">
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold">Historial de Solicitudes de Insumos</h1>
                            <button
                                onClick={() => window.history.back()}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600 transition"
                            >
                                Volver a Reportes
                            </button>
                        </div>

                        {loading ? (
                            <p className="text-gray-600">Cargando datos...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : (
                            <>
                                {/* Filtros */}
                                <div className="bg-gray-50 p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Estado</label>
                                        <select
                                            value={estado}
                                            onChange={(e) => setEstado(e.target.value)}
                                            className="border rounded px-4 py-2 w-full"
                                        >
                                            <option value="">Todos</option>
                                            <option value="aprobado">Aprobado</option>
                                            <option value="rechazado">Rechazado</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Fecha Inicio</label>
                                        <DatePicker
                                            selected={fechaInicio}
                                            onChange={(date) => setFechaInicio(date)}
                                            className="border rounded px-4 py-2 w-full"
                                            placeholderText="DD/MM/AAAA"
                                            dateFormat="dd/MM/yyyy"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Fecha Fin</label>
                                        <DatePicker
                                            selected={fechaFin}
                                            onChange={(date) => setFechaFin(date)}
                                            className="border rounded px-4 py-2 w-full"
                                            placeholderText="DD/MM/AAAA"
                                            dateFormat="dd/MM/yyyy"
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
                                <div className="bg-white p-6 rounded-lg shadow overflow-auto">
                                    <table className="table-auto w-full border-collapse border border-gray-200">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="border border-gray-200 px-4 py-2">Alumno</th>
                                                <th className="border border-gray-200 px-4 py-2">Insumo</th>
                                                <th className="border border-gray-200 px-4 py-2">Cantidad Solicitada</th>
                                                <th className="border border-gray-200 px-4 py-2">Cantidad Aprobada</th>
                                                <th className="border border-gray-200 px-4 py-2">Estado</th>
                                                <th className="border border-gray-200 px-4 py-2">Fecha</th>
                                                <th className="border border-gray-200 px-4 py-2">Clase</th>
                                                <th className="border border-gray-200 px-4 py-2">Asignatura</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedSolicitudes.map((solicitud, idx) => (
                                                <tr
                                                    key={idx}
                                                    className={`${
                                                        solicitud.estado === "aprobado"
                                                            ? "bg-green-50"
                                                            : "bg-red-50"
                                                    }`}
                                                >
                                                    <td className="border border-gray-200 px-4 py-2">
                                                        {solicitud.alumno}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-2">
                                                        {solicitud.insumo}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-2">
                                                        {solicitud.cantidad_solicitada}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-2">
                                                        {solicitud.cantidad_aprobada || "N/A"}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-2">
                                                        {solicitud.estado}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-2">
                                                        {formatDate(solicitud.fecha)}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-2">
                                                        {solicitud.clase}
                                                    </td>
                                                    <td className="border border-gray-200 px-4 py-2">
                                                        {solicitud.asignatura}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Paginación */}
                                <div className="flex justify-center items-center space-x-2 mt-4">
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                                        disabled={currentPage === 1}
                                    >
                                        Anterior
                                    </button>
                                    <span>
                                        Página {currentPage} de {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                                        disabled={currentPage === totalPages}
                                    >
                                        Siguiente
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

export default HistorialSolicitudes;
