import React, { useEffect, useState } from "react";
import api from "../api";
import Header from "../components/Headers"; // Header del sistema
import SidebarMenu from "../components/Sidebar"; // Sidebar del administrador
import EditUserModal from "../components/EditarUsuarioModal"; // Modal reutilizable para editar
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UsuariosAdmin() {
    const [usuarios, setUsuarios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Estados para el modal de edición
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState(null);

    // Estados para el modal de confirmación de eliminación
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [usuarioToDelete, setUsuarioToDelete] = useState(null);

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("usuario/usuario/listar_usuarios/");
            setUsuarios(response.data);
        } catch (err) {
            console.error("Error al cargar usuarios:", err.message);
            toast.error("No se pudo cargar la lista de usuarios.");
        } finally {
            setIsLoading(false);
        }
    };

    // Función para abrir el modal de edición
    const handleEditUsuario = (usuario) => {
        setSelectedUsuario(usuario);
        setIsModalOpen(true);
    };

    // Función para cerrar el modal de edición
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUsuario(null);
    };

    // Guardar cambios de usuario (desde el modal de edición)
    const handleSaveUsuario = async (formData) => {
        try {
            await api.put(`usuario/usuario/${selectedUsuario.id}/editar/`, formData);
            toast.success("Usuario actualizado correctamente.");
            handleCloseModal();
            fetchUsuarios(); // Recargar la lista de usuarios
        } catch (err) {
            console.error("Error al actualizar el usuario:", err.message);
            toast.error("No se pudo actualizar el usuario.");
        }
    };

    // Abrir el modal de confirmación de eliminación
    const handleDeleteUsuario = (usuario) => {
        setUsuarioToDelete(usuario);
        setIsDeleteModalOpen(true);
    };

    // Confirmar eliminación del usuario
    const confirmDeleteUsuario = async () => {
        try {
            await api.delete(`usuario/usuario/${usuarioToDelete.id}/`);
            toast.success("Usuario eliminado correctamente.");
            setIsDeleteModalOpen(false);
            fetchUsuarios(); // Recargar la lista de usuarios
        } catch (err) {
            console.error("Error al eliminar el usuario:", err.message);
            toast.error("No se pudo eliminar el usuario.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <Header user={JSON.parse(localStorage.getItem("user"))} />
            <div className="flex flex-grow">
                {/* Sidebar */}
                <SidebarMenu />
                {/* Contenido principal */}
                <div className="flex-grow p-6">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Usuarios Registrados</h1>
                        {isLoading ? (
                            <p className="text-gray-500 text-center">Cargando usuarios...</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-300 rounded-lg shadow-md">
                                    <thead className="bg-red-600 text-white">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">Nombre</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">Correo</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">Rol</th>
                                            <th className="px-4 py-3 text-center text-sm font-semibold">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usuarios.map((usuario, index) => (
                                            <tr
                                                key={usuario.id}
                                                className={`hover:bg-red-100 ${
                                                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                                                }`}
                                            >
                                                <td className="px-4 py-2 text-gray-700 text-sm">{usuario.id}</td>
                                                <td className="px-4 py-2 text-gray-700 text-sm">{usuario.nombre}</td>
                                                <td className="px-4 py-2 text-gray-700 text-sm">{usuario.email}</td>
                                                <td className="px-4 py-2 text-gray-700 text-sm">
                                                    {usuario.rol === "1"
                                                        ? "Administrador"
                                                        : usuario.rol === "2"
                                                        ? "Profesor"
                                                        : "Estudiante"}
                                                </td>
                                                <td className="px-4 py-2 text-center space-x-2">
                                                    <button
                                                        className="bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow hover:scale-105 transition-transform duration-300 hover:bg-green-700"
                                                        onClick={() => handleEditUsuario(usuario)}
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow hover:scale-105 transition-transform duration-300 hover:bg-red-700"
                                                        onClick={() => handleDeleteUsuario(usuario)}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de edición */}
            {isModalOpen && (
                <EditUserModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    user={selectedUsuario}
                    onSave={handleSaveUsuario} // Pasar la función de guardar al modal
                />
            )}

            {/* Modal de confirmación de eliminación */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Confirmar Eliminación</h2>
                        <p className="text-gray-700 mb-6">
                            ¿Estás seguro de que deseas eliminar al usuario{" "}
                            <span className="font-bold">{usuarioToDelete?.nombre}</span>? Esta acción no se puede
                            deshacer.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 hover:scale-105 transition-transform duration-300"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDeleteUsuario}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:scale-105 transition-transform duration-300"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ToastContainer para notificaciones */}
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                draggable
                theme="colored"
            />
        </div>
    );
}

export default UsuariosAdmin;
