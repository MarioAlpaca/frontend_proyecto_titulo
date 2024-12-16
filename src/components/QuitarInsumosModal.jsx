import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

function QuitarInsumosModal({ isOpen, onClose, insumos, onRemoveInsumo }) {
    const [cantidadQuitar, setCantidadQuitar] = useState({});
    const [insumosDisponibles, setInsumosDisponibles] = useState([]);

    useEffect(() => {
        if (isOpen) {
            const initialCantidad = {};
            insumos.forEach((insumo) => {
                initialCantidad[insumo.id] = "0"; // Inicializamos con 0
            });
            setCantidadQuitar(initialCantidad);
            setInsumosDisponibles(insumos);
        }
    }, [isOpen, insumos]);

    const handleInputChange = (insumoId, value) => {
        const parsedValue = parseFloat(value);
        const insumo = insumosDisponibles.find((i) => i.id === insumoId);

        if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= insumo.total_cantidad) {
            setCantidadQuitar((prev) => ({ ...prev, [insumoId]: value }));
        } else {
            toast.error("La cantidad ingresada no puede superar la cantidad disponible.", {
                position: "top-center",
                autoClose: 3000,
            });
        }
    };

    const handleIncrement = (insumoId) => {
        const insumo = insumosDisponibles.find((i) => i.id === insumoId);
        const current = parseFloat(cantidadQuitar[insumoId] || 0);

        if (!isNaN(current) && current + 1 <= insumo.total_cantidad) {
            setCantidadQuitar((prev) => ({
                ...prev,
                [insumoId]: (current + 1).toFixed(2),
            }));
        } else {
            toast.error("No puedes incrementar más allá de la cantidad disponible.", {
                position: "top-center",
                autoClose: 3000,
            });
        }
    };

    const handleDecrement = (insumoId) => {
        const current = parseFloat(cantidadQuitar[insumoId] || 0);
        if (!isNaN(current) && current > 0.01) {
            setCantidadQuitar((prev) => ({
                ...prev,
                [insumoId]: (current - 1 > 0 ? (current - 1).toFixed(2) : "0.01"),
            }));
        }
    };

    const handleRemove = async (insumoId) => {
        const cantidad = parseFloat(cantidadQuitar[insumoId]);
        const insumo = insumos.find((insumo) => insumo.id === insumoId);

        if (cantidad >= 0.01 && insumo && cantidad <= insumo.total_cantidad) {
            await onRemoveInsumo(insumoId, cantidad);

            // Actualizar la lista de insumos disponibles después de quitar uno
            setInsumosDisponibles((prev) =>
                prev.filter((i) => !(i.id === insumoId && cantidad >= i.total_cantidad))
            );

            // Restablecer la cantidad a "0"
            setCantidadQuitar((prev) => ({ ...prev, [insumoId]: "0" }));
            toast.success("Cantidad eliminada correctamente.", {
                position: "top-center",
                autoClose: 3000,
            });
        } else {
            toast.error("Por favor ingresa una cantidad válida para quitar.", {
                position: "top-center",
                autoClose: 3000,
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-lg sm:max-w-3xl transition-all duration-300">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Quitar Insumos
                </h2>
                {insumosDisponibles.length === 0 ? (
                    <div className="text-center text-gray-600 py-4">
                        <p>No hay insumos asignados a esta clase.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="text-left px-4 py-3 text-gray-800 font-semibold">
                                        Nombre
                                    </th>
                                    <th className="text-center px-4 py-3 text-gray-800 font-semibold">
                                        Cantidad Disponible
                                    </th>
                                    <th className="text-center px-4 py-3 text-gray-800 font-semibold">
                                        Quitar Cantidad
                                    </th>
                                    <th className="text-center px-4 py-3 text-gray-800 font-semibold">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {insumosDisponibles.map((insumo) => (
                                    <tr key={insumo.id} className="border-b hover:bg-gray-50 transition">
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-gray-700">
                                                {insumo.nombre}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {insumo.unidad_medida}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center text-gray-700">
                                            {insumo.total_cantidad}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <input
                                                type="number"
                                                step="0.10"
                                                min="0"
                                                max={insumo.total_cantidad}
                                                value={cantidadQuitar[insumo.id] || "0"}
                                                onChange={(e) => handleInputChange(insumo.id, e.target.value)}
                                                className="border p-2 rounded w-20 text-right focus:outline-none focus:ring focus:ring-blue-200"
                                            />
                                        </td>
                                        <td className="px-4 py-3 flex items-center justify-center gap-2">
                                            <button
                                                type="button"
                                                className="bg-green-500 text-white px-3 py-2 rounded-full hover:bg-green-600 transition"
                                                onClick={() => handleIncrement(insumo.id)}
                                            >
                                                +
                                            </button>
                                            <button
                                                type="button"
                                                className="bg-red-500 text-white px-3 py-2 rounded-full hover:bg-red-600 transition"
                                                onClick={() => handleDecrement(insumo.id)}
                                            >
                                                -
                                            </button>
                                            <button
                                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                                                onClick={() => handleRemove(insumo.id)}
                                            >
                                                Quitar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="flex justify-center mt-6">
                    <button
                        className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition"
                        onClick={onClose}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default QuitarInsumosModal;
