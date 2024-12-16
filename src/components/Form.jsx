import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function decodeToken(token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
    );

    return JSON.parse(jsonPayload);
}

function Form({ route, method }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const name = method === "login" ? "Iniciar Sesión" : "Iniciar Sesión";

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const res = await api.post(route, { email, password });
            if (method === "login" && res.data.access) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

                // Decodificar el token usando la función personalizada
                const decodedToken = decodeToken(res.data.access);
                const userRole = decodedToken.rol;

                const user = {
                    nombre: decodedToken.nombre, // Asegúrate de que esta clave coincida con tu token
                    email: decodedToken.email,  // Asegúrate de que esta clave coincida con tu token
                };

                localStorage.setItem("user", JSON.stringify(user));

                toast.success("Inicio de sesión exitoso");

                // Redirigir basado en el rol del usuario
                if (userRole === "1") {
                    navigate("/admin");
                } else if (userRole === "2") {
                    navigate("/profesor");
                } else if (userRole === "3") {
                    navigate("/estudiante");
                } else {
                    navigate("/"); // Redirige a una página predeterminada en caso de rol desconocido
                }
            } else {
                toast.error("Credenciales incorrectas");
            }
        } catch (error) {
            toast.error("Error en el inicio de sesión, email o contraseña incorrecta");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Contenedor para las notificaciones */}
            <ToastContainer position="top-center" autoClose={3000} />
            
            <form onSubmit={handleSubmit}>
                <div className="flex items-center justify-center h-screen bg-gray-100">
                    <div className="w-full max-w-xs">
                        <img
                            src="/image/inacap.png"
                            alt="Inacap"
                            className="mx-auto mb-8 w-auto"
                        />

                        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="email"
                                >
                                    Correo Electrónico
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    placeholder="Correo Electrónico"
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="password"
                                >
                                    Contraseña
                                </label>
                                <input
                                    className="shadow appearance-none border border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    placeholder="Contraseña"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-center">
                                <button
                                    className={`bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-3 px-16 rounded-full focus:outline-none focus:shadow-outline ${
                                        loading ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? "Cargando..." : name}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}

export default Form;
