import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Filler,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import SidebarMenu from "../components/Sidebar";
import Header from "../components/Headers";
import { XMarkIcon } from "@heroicons/react/24/solid";
import api from "../api";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Filler,
    Title,
    Tooltip,
    Legend
);

function ParticipacionReporte() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedChart, setExpandedChart] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [alumnos, setAlumnos] = useState([]);
    const [selectedAlumno, setSelectedAlumno] = useState(null);
    const [alumnoParticipacion, setAlumnoParticipacion] = useState([]);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
        fetchParticipationData();
    }, []);

    const fetchParticipationData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("subjects/asignaturas/reporte_participacion_general");
            const data = response.data?.reporte || [];
            setReportData(data);
        } catch (error) {
            console.error("Error al obtener los datos de participación:", error);
            setError("No se pudieron cargar los datos de participación.");
        } finally {
            setLoading(false);
        }
    };

    const fetchAlumnos = async () => {
        try {
            const response = await api.get("usuario/usuarios_por_rol/?rol=3");
            setAlumnos(response.data);
        } catch (error) {
            console.error("Error al obtener alumnos:", error);
        }
    };

    const fetchAlumnoParticipacion = async (alumnoId) => {
        try {
            const response = await api.get(`subjects/asignaturas/reporte_participacion_alumno/?alumno_id=${alumnoId}`);
            setAlumnoParticipacion(response.data.participacion || []);
        } catch (error) {
            console.error("Error al obtener participación del alumno:", error);
        }
    };

    const handleOpenModal = () => {
        fetchAlumnos();
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedAlumno(null);
        setAlumnoParticipacion([]);
    };

    const handleAlumnoSelect = (alumno) => {
        setSelectedAlumno(alumno);
        fetchAlumnoParticipacion(alumno.id);
    };

    const prepareChartData = () => {
        const labels = reportData.map((item) => item.asignatura);
        const participationRates = reportData.map((item) => item.porcentaje);
        const totalClasses = reportData.map((item) => item.total_clases);
        const totalParticipations = reportData.map((item) => item.total_participaciones);

        return {
            barChartData: {
                labels,
                datasets: [
                    {
                        label: "Porcentaje de Participación",
                        data: participationRates,
                        backgroundColor: "rgba(54, 162, 235, 0.6)",
                        borderColor: "rgba(54, 162, 235, 1)",
                        borderWidth: 1,
                    },
                ],
            },
            lineChartData: {
                labels,
                datasets: [
                    {
                        label: "Tendencia de Participación",
                        data: participationRates,
                        borderColor: "rgba(75,192,192,1)",
                        tension: 0.1,
                        fill: false,
                    },
                ],
            },
            totalClassesData: {
                labels,
                datasets: [
                    {
                        label: "Clases Totales",
                        data: totalClasses,
                        backgroundColor: "rgba(153, 102, 255, 0.6)",
                    },
                    {
                        label: "Total Participaciones",
                        data: totalParticipations,
                        backgroundColor: "rgba(255, 159, 64, 0.6)",
                    },
                ],
            },
        };
    };

    const { barChartData, lineChartData, totalClassesData } = prepareChartData();

    const openChartModal = (chartComponent) => {
        setExpandedChart(chartComponent);
    };

    const closeChartModal = () => {
        setExpandedChart(null);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Header user={user} />
            <div className="flex flex-grow">
                <SidebarMenu />
                <div className="flex-grow p-6">
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h1 className="text-3xl font-bold text-center mb-6">Reporte de Participación</h1>
                        {loading ? (
                            <p className="text-center text-gray-600">Cargando datos...</p>
                        ) : error ? (
                            <p className="text-center text-red-500">{error}</p>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div
                                        className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
                                        onClick={() =>
                                            openChartModal(<Bar data={barChartData} options={{ responsive: true }} />)
                                        }
                                    >
                                        <h3 className="text-center text-sm font-semibold mb-4">
                                            Participación por Asignatura
                                        </h3>
                                        <Bar data={barChartData} height={200} />
                                    </div>
                                    <div
                                        className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
                                        onClick={() =>
                                            openChartModal(<Line data={lineChartData} options={{ responsive: true }} />)
                                        }
                                    >
                                        <h3 className="text-center text-sm font-semibold mb-4">
                                            Tendencia de Participación
                                        </h3>
                                        <Line data={lineChartData} height={200} />
                                    </div>
                                    <div
                                        className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
                                        onClick={() =>
                                            openChartModal(<Bar data={totalClassesData} options={{ responsive: true }} />)
                                        }
                                    >
                                        <h3 className="text-center text-sm font-semibold mb-4">
                                            Clases Totales y Participaciones
                                        </h3>
                                        <Bar data={totalClassesData} height={200} />
                                    </div>
                                </div>
                                <div className="flex justify-center space-x-4 mt-6">
                                    <button
                                        onClick={() => navigate(-1)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
                                    >
                                        Volver a Reportes
                                    </button>
                                    <button
                                        onClick={handleOpenModal}
                                        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
                                    >
                                        Participación por Alumno
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {expandedChart && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={closeChartModal}
                >
                    <div
                        className="bg-white rounded-lg shadow-lg p-4 max-w-3xl w-full relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Botón de cierre */}
                        <button
                            className="absolute top-4 right-4 text-red-500"
                            onClick={closeChartModal}
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                        {/* Contenido del gráfico */}
                        {expandedChart}
                    </div>
                </div>
            )}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full relative">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 text-red-500"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                        {!selectedAlumno ? (
                            <div>
                                <h2 className="text-xl font-bold mb-4">Lista de Alumnos</h2>
                                <ul className="space-y-2">
                                    {alumnos.map((alumno) => (
                                        <li
                                            key={alumno.id}
                                            className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                                            onClick={() => handleAlumnoSelect(alumno)}
                                        >
                                            {alumno.email}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-xl font-bold mb-4">
                                    Participación de {selectedAlumno.email}
                                </h2>
                                <ul className="space-y-2">
                                    {alumnoParticipacion.map((asignatura, idx) => (
                                        <li
                                            key={idx}
                                            className="border p-2 rounded-md bg-gray-50 shadow-sm"
                                        >
                                            <span className="font-semibold">
                                                {asignatura.asignatura}
                                            </span>
                                            : {asignatura.porcentaje_participacion}% (
                                            {asignatura.clases_participadas}/
                                            {asignatura.total_clases})
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => setSelectedAlumno(null)}
                                    className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600 transition"
                                >
                                    Volver a Lista
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ParticipacionReporte;
