import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen, faBook, faEnvelope, faChartPie, faUserPlus, faUsers } from "@fortawesome/free-solid-svg-icons"; // Añadido faUserPlus para el icono de "Registrar Usuario"

function SidebarMenu() {
    const location = useLocation();

    // Función para determinar si una ruta está activa
    const isActive = (path) => location.pathname === path;

    return (
        <div className="w-full md:w-1/4 lg:w-1/5 h-screen bg-white text-gray-800 flex flex-col items-start py-6 px-4 shadow-lg border-r">
            {/* Logo / Header */}
            <h2 className="text-2xl font-bold text-gray-800 mb-8 w-full text-center">
                Administrador
            </h2>

            {/* Menu Items */}
            <ul className="w-full space-y-4">
                <li>
                    <Link
                        to="/admin"
                        className={`flex items-center p-3 rounded-lg transition duration-200 ${
                            isActive("/admin") ? "bg-blue-100 text-blue-600" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                    >
                        <FontAwesomeIcon icon={faBoxOpen} className="w-5 mr-3" />
                        <span>Insumos</span>
                    </Link>
                </li>
                <li>
                    <Link
                        to="/asignaturas"
                        className={`flex items-center p-3 rounded-lg transition duration-200 ${
                            isActive("/asignaturas") ? "bg-blue-100 text-blue-600" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                    >
                        <FontAwesomeIcon icon={faBook} className="w-5 mr-3" />
                        <span>Asignaturas</span>
                    </Link>
                </li>
                <li>
                    <Link
                        to="/admin/solicitudes"
                        className={`flex items-center p-3 rounded-lg transition duration-200 ${
                            isActive("/admin/solicitudes") ? "bg-blue-100 text-blue-600" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                    >
                        <FontAwesomeIcon icon={faEnvelope} className="w-5 mr-3" />
                        <span>Solicitudes</span>
                    </Link>
                </li>
                <li>
                    <Link
                        to="/reportes"
                        className={`flex items-center p-3 rounded-lg transition duration-200 ${
                            isActive("/reportes") ? "bg-blue-100 text-blue-600" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                    >
                        <FontAwesomeIcon icon={faChartPie} className="w-5 mr-3" />
                        <span>Reportes</span>
                    </Link>
                </li>
                <li>
                    <Link
                        to="/usuarios/registrar"
                        className={`flex items-center p-3 rounded-lg transition duration-200 ${
                            isActive("/usuarios/registrar") ? "bg-blue-100 text-blue-600" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                    >
                        <FontAwesomeIcon icon={faUserPlus} className="w-5 mr-3" />
                        <span>Registrar Usuario</span>
                    </Link>
                </li>
                <li>
                    <Link
                        to="/admin/usuarios"
                        className={`flex items-center p-3 rounded-lg transition duration-200 ${
                            isActive("/admin/usuarios") ? "bg-blue-100 text-blue-600" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                    >
                        <FontAwesomeIcon icon={faUsers} className="w-5 mr-3" />
                        <span>Usuarios</span>
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

export default SidebarMenu;
