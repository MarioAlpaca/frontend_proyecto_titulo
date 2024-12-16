import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";  // Asegúrate de tener importado jwtDecode correctamente
import { useEffect, useState } from "react";
import { ACCESS_TOKEN } from "../constants";

function ProtectedRoute({ children, allowedRoles }) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
            return;
        }

        try {
            const decodedToken = jwtDecode(token);  // Decodifica el token directamente
            const userRole = decodedToken.rol;

            // Verifica si el rol está permitido
            if (allowedRoles.includes(userRole)) {
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
        } catch (error) {
            console.log("Error al decodificar el token:", error);
            setIsAuthorized(false);
        }
    }, [allowedRoles]);

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;

