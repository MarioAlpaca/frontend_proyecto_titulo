import React from "react";
import api from "../api";
import { toast } from "react-toastify";

function DeleteConfirmModal({ insumo, onClose, refreshInsumos }) {
    const handleDelete = () => {
        api.delete(`/insumos/insumos/${insumo.id}/`)
            .then(() => {
                refreshInsumos();
                onClose();
                toast.success("Insumo eliminado correctamente.");
            })
            .catch((err) => {
                console.error("Error al eliminar el insumo:", err.response?.data || err.message);
                const errorMessage = err.response?.data?.error || "Error al eliminar el insumo. Verifica si el insumo está asignado a una clase iniciada.";
                toast.error(errorMessage, {
                    position: "top-center",
                });
            });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
                    Confirmar eliminación
                </h2>
                <p className="text-gray-600 text-center mb-6">
                    ¿Estás seguro de que deseas eliminar el insumo{" "}
                    <span className="font-semibold">{insumo.nombre}</span>? Esta acción no se puede deshacer.
                </p>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={handleDelete}
                        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition duration-200"
                    >
                        Sí, eliminar
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition duration-200"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmModal;
