import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Función para formatear números
function formatNumber(value) {
    if (value === null || value === undefined) return "N/A";
    const numberValue = parseFloat(value);
    if (isNaN(numberValue)) return "N/A";
    return Number.isInteger(numberValue) ? numberValue : numberValue.toFixed(2);
}

function VerInsumosAsignadosModal({
    isOpen,
    onClose,
    insumos = [],
    onSolicitarInsumos,
    selectedClaseId, // Identificador de la clase
    isFinalizada = false,
}) {
    const [solicitudes, setSolicitudes] = useState([]); // Estado inicial correcto

    useEffect(() => {
        if (!isOpen) {
            setSolicitudes([]); // Resetear solicitudes al cerrar el modal
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Manejo del cambio de selección en el checkbox
    const handleCheckboxChange = (insumoId) => {
        setSolicitudes((prev) => {
            const exists = prev.find((sol) => sol.insumoId === insumoId);
            if (exists) {
                return prev.filter((sol) => sol.insumoId !== insumoId); // Eliminar si ya está seleccionado
            } else {
                const insumo = insumos.find((i) => i.insumo === insumoId);
                if (!insumo) {
                    toast.error("Insumo no encontrado.");
                    return prev;
                }
                return [
                    ...prev,
                    { insumoId, cantidadSolicitada: 0, maxCantidad: insumo.cantidad_asignada },
                ];
            }
        });
    };

    // Manejo del cambio en la cantidad solicitada
    const handleCantidadChange = (insumoId, cantidad) => {
        setSolicitudes((prev) =>
            prev.map((sol) =>
                sol.insumoId === insumoId
                    ? { ...sol, cantidadSolicitada: Math.min(Math.max(0, cantidad), sol.maxCantidad) }
                    : sol
            )
        );
    };

    // Verificar si el insumo está seleccionado en las solicitudes
    const isInsumoSelected = (insumoId) => {
        return solicitudes.some((sol) => sol.insumoId === insumoId);
    };

    // Envío de las solicitudes
    const handleSubmitSolicitudes = () => {
        const solicitudesFiltradas = solicitudes.filter((sol) => sol.cantidadSolicitada > 0);

        if (solicitudesFiltradas.length === 0) {
            toast.error("Debes seleccionar al menos una cantidad válida para enviar la solicitud.", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        const errores = solicitudesFiltradas.filter((sol) => sol.cantidadSolicitada > sol.maxCantidad);

        if (errores.length > 0) {
            errores.forEach((error) => {
                const insumo = insumos.find((i) => i.insumo === error.insumoId);
                if (insumo) {
                    toast.error(
                        `Cantidad solicitada de ${insumo.insumo} excede la cantidad asignada (${formatNumber(
                            error.maxCantidad
                        )}).`,
                        { position: "top-center", autoClose: 3000 }
                    );
                }
            });
            return;
        }

        onSolicitarInsumos(solicitudesFiltradas);
        setSolicitudes([]); // Resetear las solicitudes
    };

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full mx-4 md:mx-auto overflow-y-auto max-h-[90vh]">
                    <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
                        {isFinalizada ? "Historial de Insumos Asignados" : "Insumos Asignados"}
                    </h2>
                    {isFinalizada && (
                        <p className="text-center text-gray-600 italic mb-6">
                            Clase finalizada: Estos son los insumos que se te asignaron durante la clase.
                        </p>
                    )}
                    {insumos.length === 0 ? (
                        <p className="text-gray-700 text-center">No se te asignaron insumos para la clase.</p>
                    ) : (
                        <table className="w-full border-collapse border border-gray-300 text-sm">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="text-center px-6 py-3 border border-gray-300">Insumo</th>
                                    <th className="text-center px-6 py-3 border border-gray-300">Tipo</th>
                                    <th className="text-center px-6 py-3 border border-gray-300">Cantidad Asignada</th>
                                    <th className="text-center px-6 py-3 border border-gray-300">Extra Solicitado</th>
                                    {!isFinalizada && (
                                        <th className="text-center px-6 py-3 border border-gray-300">Solicitar</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {insumos.map((insumo, index) => (
                                    <tr
                                        key={index}
                                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                    >
                                        <td className="px-6 py-4 text-center border border-gray-300">
                                            {insumo.insumo}
                                        </td>
                                        <td className="px-6 py-4 text-center border border-gray-300">
                                            {insumo.unidad_medida}
                                        </td>
                                        <td className="px-6 py-4 text-center border border-gray-300">
                                            {formatNumber(insumo.cantidad_asignada)}
                                        </td>
                                        <td className="px-6 py-4 text-center border border-gray-300">
                                            {formatNumber(insumo.cantidad_extra_asignada || 0)}
                                        </td>
                                        {!isFinalizada && (
                                            <td className="px-6 py-4 text-center border border-gray-300">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <label className="flex items-center space-x-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={isInsumoSelected(insumo.insumo)}
                                                            onChange={() => handleCheckboxChange(insumo.insumo)}
                                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                                                        />
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max={insumo.cantidad_asignada}
                                                        step="0.10"
                                                        placeholder="Cantidad"
                                                        className="border rounded px-2 py-1 w-32"
                                                        value={
                                                            isInsumoSelected(insumo.insumo)
                                                                ? solicitudes.find((sol) => sol.insumoId === insumo.insumo)?.cantidadSolicitada || ""
                                                                : ""
                                                        }
                                                        onChange={(e) =>
                                                            handleCantidadChange(
                                                                insumo.insumo,
                                                                parseFloat(e.target.value)
                                                            )
                                                        }
                                                        disabled={!isInsumoSelected(insumo.insumo)}
                                                    />
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    <div className={`flex mt-8 ${isFinalizada ? "justify-center" : "justify-between"}`}>
                        {!isFinalizada && (
                            <button
                                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-200"
                                onClick={handleSubmitSolicitudes}
                            >
                                Enviar Solicitud
                            </button>
                        )}
                        <button
                            className="bg-gray-400 text-white px-8 py-3 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition ease-in-out duration-200"
                            onClick={onClose}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default VerInsumosAsignadosModal;
