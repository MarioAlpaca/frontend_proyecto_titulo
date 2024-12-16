import React from "react";

function DeleteConfirmModalAsignatura({ asignatura, onClose, onConfirm }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-md mx-auto">
                <h2 className="text-xl font-semibold mb-4">Eliminar Asignatura</h2>
                <p className="mb-4">
                    ¿Estás seguro de que deseas eliminar la asignatura "
                    <span className="font-bold">{asignatura.nombre}</span>"?
                </p>
                <p className="text-gray-600 text-sm">
                    Los insumos asignados a las clases de esta asignatura serán devueltos al inventario general,
                    excepto para aquellas clases en estado <strong>"iniciada"</strong> o <strong>"finalizada"</strong>.
                </p>
                <div className="flex justify-end space-x-2 mt-4">
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={onConfirm} // Llama a la función confirmDeleteAsignatura
                    >
                        Eliminar
                    </button>
                    <button
                        className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                        onClick={onClose} // Cierra el modal
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmModalAsignatura;
