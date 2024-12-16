import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import HomeAdmin from "./pages/Home_A";
import HomeProfesor from "./pages/Home_P";
import HomeEstudiante from "./pages/Home_E";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Asignaturas from "./pages/Asignaturas";
import ClaseListView from "./components/ClaseListView";
import ClaseListViewProfesor from "./components/ClaseListViewProfesor"; // Nueva vista para el profesor
import ClaseListViewAlumno from "./components/ClaseListViewAlumno"; // Nueva vista para el alumno
import SolicitudesProfesorView from "./components/SolicitudesProfesorView"; // Nueva vista para solicitudes
import NotificacionesAlumnoView from "./components/NotificacionesAlumnoView"; // Nueva vista para notificaciones del alumno
import SolicitudesAdminView from "./components/SolicitudesAdminView"; // Nueva vista para notificaciones del administrador
import "./index.css";
import Reportes from "./components/Reportes";
import ParticipacionReporte from "./components/ParticipacionReporte";
import HistorialSolicitudes from "./components/HistorialSolicitudes";
import HistorialInsumos from "./components/HistorialInsumos";
import RegistroUsuarios from "./components/RegistroUsuarios";
import HistorialSolicitudesAlumno from "./components/HistorialSolicitudesAlumno";
import HistorialSolicitudesProfesor from "./components/HistorialSolicitudesProfesor"
import UsuariosAdmin from "./components/UsuariosAdmin";


function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta de redireccionamiento a login si la ruta raíz es "/" */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Rutas de login y logout */}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />

        {/* Ruta protegida para Asignaturas (Solo Administrador) */}
        <Route
          path="/asignaturas"
          element={
            <ProtectedRoute allowedRoles={["1"]}>
              <Asignaturas />
            </ProtectedRoute>
          }
        />

        {/* Ruta del profesor para ver clases */}
        <Route
          path="/profesor/asignatura/:asignaturaId/clases"
          element={
            <ProtectedRoute allowedRoles={["2"]}>
              <ClaseListViewProfesor />
            </ProtectedRoute>
          }
        />

        {/* Ruta del profesor para ver solicitudes */}
        <Route
          path="/profesor/solicitudes"
          element={
            <ProtectedRoute allowedRoles={["2"]}>
              <SolicitudesProfesorView />
            </ProtectedRoute>
          }
        />

        {/* Ruta protegida para ver clases dentro de una asignatura (Solo Administrador) */}
        <Route
          path="/asignatura/:asignaturaId/clases"
          element={
            <ProtectedRoute allowedRoles={["1"]}>
              <ClaseListView />
            </ProtectedRoute>
          }
        />

        {/* Ruta del alumno para ver clases */}
        <Route
          path="/alumno/asignatura/:asignaturaId/clases"
          element={
            <ProtectedRoute allowedRoles={["3"]}>
              <ClaseListViewAlumno />
            </ProtectedRoute>
          }
        />

        {/* Ruta del alumno para ver notificaciones */}
        <Route
          path="/alumno/notificaciones"
          element={
            <ProtectedRoute allowedRoles={["3"]}>
              <NotificacionesAlumnoView />
            </ProtectedRoute>
          }
        />

        {/* Ruta protegida para el panel de administración (Solo Administrador) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["1"]}>
              <HomeAdmin />
            </ProtectedRoute>
          }
        />

        {/* Ruta del administrador para ver notificaciones */}
        <Route
          path="/admin/solicitudes"
          element={
            <ProtectedRoute allowedRoles={["1"]}>
              <SolicitudesAdminView />
            </ProtectedRoute>
          }
        />

        {/* Ruta protegida para el panel del Profesor (Solo Profesor) */}
        <Route
          path="/profesor"
          element={
            <ProtectedRoute allowedRoles={["2"]}>
              <HomeProfesor />
            </ProtectedRoute>
          }
        />

        {/* Ruta protegida para el panel del Estudiante (Solo Estudiante) */}
        <Route
          path="/estudiante"
          element={
            <ProtectedRoute allowedRoles={["3"]}>
              <HomeEstudiante />
            </ProtectedRoute>
          }
        />
        <Route
            path="/reportes"
            element={
                <ProtectedRoute allowedRoles={["1"]}>
                    <Reportes />
                </ProtectedRoute>
            }
        />
        <Route
            path="/reportes/participacion"
            element={
                <ProtectedRoute allowedRoles={["1"]}>
                    <ParticipacionReporte />
                </ProtectedRoute>
            }
        />
        <Route
            path="/reportes/solicitudes"
            element={
                <ProtectedRoute allowedRoles={["1"]}>
                    <HistorialSolicitudes />
                </ProtectedRoute>
            }
        />
        <Route
            path="/reportes/insumos"
            element={
                <ProtectedRoute allowedRoles={["1"]}>
                    <HistorialInsumos />
                </ProtectedRoute>
            }
        />
        <Route
            path="/usuarios/registrar"
            element={
                <ProtectedRoute allowedRoles={["1"]}>
                    <RegistroUsuarios />
                </ProtectedRoute>
            }
        />
        <Route
            path="/alumno/historial-solicitudes"
            element={
                <ProtectedRoute allowedRoles={["3"]}>
                    <HistorialSolicitudesAlumno/>
                </ProtectedRoute>
            }
        />
        <Route
            path="/profesor/historial-solicitudes"
            element={
                <ProtectedRoute allowedRoles={["2"]}>
                    <HistorialSolicitudesProfesor/>
                </ProtectedRoute>
            }
        />
        <Route
            path="/admin/usuarios"
            element={
                <ProtectedRoute allowedRoles={["1"]}>
                    <UsuariosAdmin/>
                </ProtectedRoute>
            }
        />
        {/* Ruta para el manejo de errores de rutas no encontradas */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
