import React, { useEffect, useState } from "react";
import api from "../api";

function AsignaturaFormModal({ onClose, refreshAsignaturas, asignatura }) {
    const isEditing = !!asignatura;
    const [nombre, setNombre] = useState(asignatura ? asignatura.nombre : "");
    const [numeroClases, setNumeroClases] = useState(asignatura ? asignatura.numero_clases : 1);
    const [profesor, setProfesor] = useState(asignatura ? asignatura.profesor : "");
    const [alumnos, setAlumnos] = useState(
        asignatura && Array.isArray(asignatura.alumnos) ? asignatura.alumnos.map((alumno) => alumno.id) : []
    );
    const [profesores, setProfesores] = useState([]);
    const [alumnosOpciones, setAlumnosOpciones] = useState([]);
    const [loadingProfesores, setLoadingProfesores] = useState(true);
    const [loadingAlumnos, setLoadingAlumnos] = useState(true);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchProfesores();
        fetchAlumnos();
    }, []);

    const fetchProfesores = async () => {
        setLoadingProfesores(true);
        try {
            const res = await api.get("/usuario/usuarios_por_rol/?rol=2");
            setProfesores(res.data);
        } catch (err) {
            alert("Error al obtener los profesores: " + err.message);
        } finally {
            setLoadingProfesores(false);
        }
    };

    const fetchAlumnos = async () => {
        setLoadingAlumnos(true);
        try {
            const res = await api.get("/usuario/usuarios_por_rol/?rol=3");
            setAlumnosOpciones(res.data);
        } catch (err) {
            alert("Error al obtener los alumnos: " + err.message);
        } finally {
            setLoadingAlumnos(false);
        }
    };

    const validateFields = () => {
        const newErrors = {};
        if (!nombre.trim()) newErrors.nombre = "El nombre de la asignatura es obligatorio";
        if (!profesor) newErrors.profesor = "Debe seleccionar un profesor";
        if (!isEditing && numeroClases < 1) newErrors.numeroClases = "Debe haber al menos 1 clase";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateFields()) return;

        try {
            const data = {
                nombre,
                numero_clases: parseInt(numeroClases, 10),
                profesor,
                alumnos,
            };

            if (isEditing) {
                await api.put(`subjects/asignaturas/${asignatura.id}/`, data);
            } else {
                await api.post("subjects/asignaturas/", data);
            }

            refreshAsignaturas();
            onClose();
        } catch (err) {
            alert("Error al guardar la asignatura: " + err.message);
        }
    };

    const toggleAlumnoSelection = (alumnoId) => {
        setAlumnos((prevAlumnos) =>
            prevAlumnos.includes(alumnoId)
                ? prevAlumnos.filter((id) => id !== alumnoId)
                : [...prevAlumnos, alumnoId]
        );
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
                <h2 className="text-2xl font-semibold mb-6 text-center">
                    {isEditing ? "Editar Asignatura" : "Añadir Asignatura"}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre de la asignatura */}
                    <div>
                        <label className="block font-semibold mb-2">Nombre de la Asignatura:</label>
                        <input
                            className={`border w-full p-3 rounded-lg ${errors.nombre ? "border-red-500" : ""}`}
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ingrese el nombre de la asignatura"
                        />
                        {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
                    </div>

                    {/* Número de clases (solo para creación) */}
                    {!isEditing && (
                        <div>
                            <label className="block font-semibold mb-2">Número de Clases:</label>
                            <input
                                className={`border w-full p-3 rounded-lg ${errors.numeroClases ? "border-red-500" : ""}`}
                                value={numeroClases}
                                onChange={(e) => setNumeroClases(e.target.value)}
                                placeholder="Número de clases"
                                type="number"
                                min="1"
                            />
                            {errors.numeroClases && <p className="text-red-500 text-sm">{errors.numeroClases}</p>}
                        </div>
                    )}

                    {/* Profesor */}
                    <div>
                        <label className="block font-semibold mb-2">Profesor:</label>
                        <select
                            className={`border w-full p-3 rounded-lg ${errors.profesor ? "border-red-500" : ""}`}
                            onChange={(e) => setProfesor(e.target.value || "")}
                            value={profesor || ""}
                        >
                            <option value="">Seleccionar Profesor</option>
                            {loadingProfesores ? (
                                <option>Cargando profesores...</option>
                            ) : (
                                profesores.map((prof) => (
                                    <option key={prof.id} value={prof.id}>
                                        {prof.nombre}
                                    </option>
                                ))
                            )}
                        </select>
                        {errors.profesor && <p className="text-red-500 text-sm">{errors.profesor}</p>}
                    </div>

                    {/* Alumnos */}
                    <div className="col-span-2">
                        <label className="block font-semibold mb-2">Seleccionar Alumnos:</label>
                        <div className="border p-3 rounded-lg h-48 overflow-y-scroll">
                            {loadingAlumnos ? (
                                <p>Cargando alumnos...</p>
                            ) : (
                                alumnosOpciones.map((alumno) => (
                                    <label key={alumno.id} className="flex items-center mb-2">
                                        <input
                                            type="checkbox"
                                            checked={alumnos.includes(alumno.id)}
                                            onChange={() => toggleAlumnoSelection(alumno.id)}
                                            className="mr-2"
                                        />
                                        {alumno.email} {/* Mostrar el correo en lugar del nombre */}
                                    </label>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Botones */}
                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all"
                        onClick={handleSubmit}
                    >
                        {isEditing ? "Guardar Cambios" : "Guardar Asignatura"}
                    </button>
                    <button
                        className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-all"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AsignaturaFormModal;
