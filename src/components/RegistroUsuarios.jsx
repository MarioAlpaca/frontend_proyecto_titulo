import React, { useState } from "react";
import SidebarMenu from "../components/Sidebar";
import Header from "../components/Headers";
import api from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

function RegistroUsuarios() {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rol, setRol] = useState("");
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nombre || !email || !password || !rol) {
            toast.error("Por favor, completa todos los campos.");
            return;
        }

        if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
            toast.error("La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.");
            return;
        }

        try {
            const response = await api.post("usuario/usuario/registrar/", {
                nombre,
                email,
                password,
                rol,
            });
            if (response.status === 201) {
                toast.success("Usuario registrado con éxito.");
                setNombre("");
                setEmail("");
                setPassword("");
                setRol("");
            }
        } catch (error) {
            console.error(error);
            toast.error(
                error.response?.data?.email?.[0] || "Ocurrió un error al registrar el usuario."
            );
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header user={user} />
            <div className="flex flex-grow">
                <SidebarMenu />
                <div className="flex-grow p-6">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
                        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                            Registrar Usuario
                        </h1>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nombre del usuario"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Correo electrónico"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Contraseña"
                                />
                                <small className="text-gray-500 text-sm">
                                    La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.
                                </small>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rol
                                </label>
                                <select
                                    value={rol}
                                    onChange={(e) => setRol(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Seleccione un rol</option>
                                    <option value="1">Administrador</option>
                                    <option value="2">Profesor</option>
                                    <option value="3">Estudiante</option>
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-red-300 flex items-center justify-center"
                                >
                                    <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                                    Registrar Usuario
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    );
}

export default RegistroUsuarios;
