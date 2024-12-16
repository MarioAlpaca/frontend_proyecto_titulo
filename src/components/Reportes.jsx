import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SidebarMenu from "../components/Sidebar";
import Header from "../components/Headers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faFileAlt, faTable } from "@fortawesome/free-solid-svg-icons";

function Reportes() {
    const [user, setUser] = useState(null);

    // Recuperar información del usuario desde el localStorage
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <Header user={user} />
            <div className="flex flex-grow">
                {/* Sidebar */}
                <SidebarMenu />
                {/* Contenido principal */}
                <div className="flex-grow p-6">
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                            Reportes del Sistema
                        </h1>
                        <div className="flex flex-col gap-6">
                            <Link
                                to="/reportes/participacion"
                                className="flex items-center bg-gradient-to-r from-red-500 to-red-600 text-white py-6 px-6 rounded-lg hover:scale-105 transition duration-300 ease-in-out shadow-lg"
                            >
                                <FontAwesomeIcon icon={faChartLine} className="text-4xl mr-4" />
                                <span className="text-lg font-semibold">
                                    Participación por Asignatura
                                </span>
                            </Link>
                            <Link
                                to="/reportes/solicitudes"
                                className="flex items-center bg-gradient-to-r from-red-500 to-red-600 text-white py-6 px-6 rounded-lg hover:scale-105 transition duration-300 ease-in-out shadow-lg"
                            >
                                <FontAwesomeIcon icon={faFileAlt} className="text-4xl mr-4" />
                                <span className="text-lg font-semibold">
                                    Historial de Solicitudes
                                </span>
                            </Link>
                            <Link
                                to="/reportes/insumos"
                                className="flex items-center bg-gradient-to-r from-red-500 to-red-600 text-white py-6 px-6 rounded-lg hover:scale-105 transition duration-300 ease-in-out shadow-lg"
                            >
                                <FontAwesomeIcon icon={faTable} className="text-4xl mr-4" />
                                <span className="text-lg font-semibold">
                                    Historial de Insumos
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Reportes;
