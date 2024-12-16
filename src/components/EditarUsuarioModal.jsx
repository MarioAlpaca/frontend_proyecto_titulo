import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditUserModal({ isOpen, onClose, user, onSave }) {
    const [nombre, setNombre] = useState(user?.nombre || "");
    const [password, setPassword] = useState("");

    // Validación de la contraseña
    const isValidPassword = (password) => {
        return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
    };

    const handleSave = () => {
        // Validar la contraseña solo si se cambió
        if (password && !isValidPassword(password)) {
            toast.error("La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
            return; // Evitar que se guarde si no es válida
        }

        // Si todo es válido, proceder con la acción
        onSave({ nombre, password: password || undefined }); // Solo envía la contraseña si se cambió
        toast.success("Usuario actualizado correctamente.", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
        });
        onClose(); // Cerrar el modal
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-lg transform transition-all">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Editar Usuario</h2>
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Nombre</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                        placeholder="Nombre del usuario"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Nueva Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                        placeholder="Deja vacío si no deseas cambiarla"
                    />
                    <small className="text-gray-500 text-sm block mt-1">
                        La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.
                    </small>
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg shadow-md hover:bg-gray-300 transition-transform transform hover:scale-105"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition-transform transform hover:scale-105"
                    >
                        Guardar
                    </button>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default EditUserModal;
