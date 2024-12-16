import React, { useEffect, useState } from "react";
import api from "../api";
import Header from "../components/Headers";
import SidebarAlumno from "../components/SidebarAlumno"; // Importa el sidebar para alumno
import AsignaturaCard from "../components/AsignaturaCard"; // Reutiliza AsignaturaCard para mostrar las asignaturas

function HomeAlumno() {
    const [asignaturas, setAsignaturas] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
        fetchAsignaturas();
    }, []);

    const fetchAsignaturas = async () => {
        try {
            const res = await api.get('/subjects/asignaturas/');
            setAsignaturas(res.data);
        } catch (err) {
            alert("Error al obtener asignaturas: " + err.message);
        }
    };

    return (
        <div className="flex min-h-screen flex-col">
            <Header user={user} />
            <div className="flex min-h-screen bg-gray-100">
                <SidebarAlumno /> {/* Sidebar exclusivo para el rol de alumno */}
                <div className="flex-grow p-6">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h1 className="text-2xl font-bold mb-6 text-center">Mis Asignaturas</h1>
                        {asignaturas.length === 0 ? (
                            <p className="text-center text-gray-600 text-lg italic">
                                No hay asignaturas disponibles en este momento.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {asignaturas.map((asignatura) => (
                                    <AsignaturaCard
                                        key={asignatura.id}
                                        id={asignatura.id}
                                        nombre={asignatura.nombre}
                                        numeroClases={asignatura.numero_clases}
                                        profesor={asignatura.profesor_nombre}
                                        numeroAlumnos={asignatura.cantidad_alumnos}
                                        userRole="3" // Rol de alumno
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeAlumno;
