import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function AsignaturaCard({ id, nombre, numeroClases, profesor, numeroAlumnos, userRole, onEdit, onDelete }) {
    const navigate = useNavigate();

    // Función para redirigir a la vista de clases de la asignatura
    const handleViewClases = () => {
        if (userRole === "1") { // Si es administrador
            navigate(`/asignatura/${id}/clases`);
        } else if (userRole === "2") { // Si es profesor
            navigate(`/profesor/asignatura/${id}/clases`);
        } else if (userRole === "3") { // Si es alumno
            navigate(`/alumno/asignatura/${id}/clases`);
        }
    };

    return (
        <div className="flex flex-col md:flex-row justify-between items-start bg-gray-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex-grow">
                <h3 className="font-semibold text-xl text-gray-800 mb-2">{nombre}</h3>
                <p className="text-sm text-gray-600">N° de Clases: {numeroClases}</p>
                <p className="text-sm text-gray-600">Profesor: {profesor || "No asignado"}</p>
                <p className="text-sm text-gray-600">Cantidad de Alumnos: {numeroAlumnos}</p>
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
                {/* Botón "Ver Asignatura" para redirigir a la vista de clases */}
                <button
                    onClick={handleViewClases}
                    className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300"
                >
                    <FontAwesomeIcon icon={faEye} className="text-white mr-2" />
                    Ver Asignatura
                </button>

                {/* Mostrar botón Editar solo si onEdit está definido */}
                {onEdit && (
                    <button
                        onClick={onEdit}
                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
                    >
                        <FontAwesomeIcon icon={faEdit} className="text-white mr-2" />
                        Editar
                    </button>
                )}

                {/* Mostrar botón Eliminar solo si onDelete está definido */}
                {onDelete && (
                    <button
                        onClick={onDelete}
                        className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition-all duration-300"
                    >
                        <FontAwesomeIcon icon={faTrash} className="text-white mr-2" />
                        Eliminar
                    </button>
                )}
            </div>
        </div>
    );
}

export default AsignaturaCard;
