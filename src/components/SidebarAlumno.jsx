import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faBell, faClipboardList } from "@fortawesome/free-solid-svg-icons";

function SidebarAlumno() {
    const location = useLocation();

    // Función para determinar si una ruta está activa
    const isActive = (path) => location.pathname === path;

    return (
        <div className="w-full md:w-1/4 lg:w-1/5 h-screen bg-white text-gray-800 flex flex-col items-start py-6 px-4 shadow-lg border-r">
            {/* Header del Sidebar */}
            <h2 className="text-2xl font-bold text-gray-800 mb-8 w-full text-center">
                Menú Alumno
            </h2>

            {/* Opciones del Menú */}
            <ul className="w-full space-y-4">
                <li>
                    <Link
                        to="/estudiante"
                        className={`flex items-center p-3 rounded-lg transition duration-200 ${
                            isActive("/estudiante") ? "bg-blue-100 text-blue-600" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                    >
                        <FontAwesomeIcon icon={faBook} className="w-5 mr-3" />
                        <span>Asignaturas</span>
                    </Link>
                </li>
                <li>
                    <Link
                        to="/alumno/notificaciones"
                        className={`flex items-center p-3 rounded-lg transition duration-200 ${
                            isActive("/alumno/notificaciones") ? "bg-blue-100 text-blue-600" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                    >
                        <FontAwesomeIcon icon={faBell} className="w-5 mr-3" />
                        <span>Notificaciones</span>
                    </Link>
                </li>
                <li>
                    <Link
                        to="/alumno/historial-solicitudes"
                        className={`flex items-center p-3 rounded-lg transition duration-200 ${
                            isActive("/alumno/historial-solicitudes") ? "bg-blue-100 text-blue-600" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                    >
                        <FontAwesomeIcon icon={faClipboardList} className="w-5 mr-3" />
                        <span>Historial de Solicitudes</span>
                    </Link>
                </li>
            </ul>

            {/* Footer */}
            <div className="mt-auto w-full text-center text-gray-500 text-sm border-t pt-4">
                <p>&copy; 2024 Sistema de Gestión</p>
            </div>
        </div>
    );
}

export default SidebarAlumno;
