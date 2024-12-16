import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

function Header({ user }) {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef(null);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login"); // Redirigir a la página de login después de cerrar sesión
    };

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    const handleClickOutside = (event) => {
        // Si el clic fue fuera del menú, cerrar el menú
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setMenuOpen(false);
        }
    };

    useEffect(() => {
        // Escuchar el evento de clic en el documento
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Limpiar el evento al desmontar el componente
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-red-800 text-white p-4 flex items-center justify-between">
            <div className="flex items-center">
                <img src="/image/logo-inacap-blanco.png" alt="Logo" className="w-48 mr-4" /> {/* Logo */}
            </div>
            <div className="flex items-center relative" ref={menuRef}>
                <div className="mr-4 text-right">
                    <p className="text-sm font-semibold">{user?.nombre || "Usuario"}</p>
                    <p className="text-xs">{user?.email || "usuario@ejemplo.com"}</p>
                </div>
                <button onClick={toggleMenu} className="relative">
                    <span className="text-4xl">
                        <FontAwesomeIcon icon={faUser} />
                    </span>
                </button>
                {isMenuOpen && (
                    <div className="absolute right-0 mt-24 w-40 bg-white text-black rounded shadow-lg z-10">
                        <ul>
                            <li
                                className="px-4 py-2 cursor-pointer rounded hover:bg-gray-200"
                                onClick={handleLogout}
                            >
                                Cerrar sesión
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
