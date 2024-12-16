import React, { useState, useEffect } from "react";
import api from "../api";
import { toast } from "react-toastify";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

function InsumoFormModal({ insumo, onClose, refreshInsumos }) {
    const [nombre, setNombre] = useState("");
    const [cantidad, setCantidad] = useState("0");
    const [unidadMedida, setUnidadMedida] = useState("");
    const editCantidadOnly = insumo?.editCantidadOnly || false;

    useEffect(() => {
        if (insumo) {
            setNombre(insumo.nombre);
            setCantidad(formatNumber(insumo.cantidad_total));
            setUnidadMedida(insumo.unidad_medida);
        }
    }, [insumo]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (cantidad < 0) {
            toast.error("La cantidad no puede ser negativa.");
            return;
        }

        if (!unidadMedida && !editCantidadOnly) {
            toast.error("Por favor, selecciona una unidad de medida válida.");
            return;
        }

        const insumoData = {
            ...(editCantidadOnly ? {} : { nombre }),
            cantidad_total: parseFloat(cantidad),
            ...(editCantidadOnly ? {} : { unidad_medida: unidadMedida }),
        };

        const apiCall = insumo
            ? api.put(`/insumos/insumos/${insumo.id}/`, insumoData)
            : api.post("/insumos/insumos/", insumoData);

        apiCall
            .then(() => {
                refreshInsumos();
                onClose();
                toast.success(
                    insumo ? "Insumo editado exitosamente." : "Insumo agregado exitosamente."
                );
            })
            .catch((err) => {
                console.error("Error al guardar el insumo:", err.response?.data || err.message);
                const errorMessage = err.response?.data?.error || "Error al guardar el insumo. Verifica si el insumo está asignado a una clase iniciada.";
                toast.error(errorMessage, {
                    position: "top-center",
                });
            });
    };

    const handleCantidadChange = (value) => {
        const parsedValue = parseFloat(value);
        if (!isNaN(parsedValue) && parsedValue >= 0) {
            setCantidad(value);
        }
    };

    const handleIncrement = () => {
        const parsedValue = parseFloat(cantidad);
        if (!isNaN(parsedValue)) {
            const entero = Math.floor(parsedValue);
            const decimal = parsedValue - entero;
            setCantidad((entero + 1 + decimal).toFixed(2));
        }
    };

    const handleDecrement = () => {
        const parsedValue = parseFloat(cantidad);
        if (!isNaN(parsedValue)) {
            const entero = Math.floor(parsedValue);
            const decimal = parsedValue - entero;
            if (entero > 0) {
                setCantidad((entero - 1 + decimal).toFixed(2));
            }
        }
    };

    const formatNumber = (num) => {
        const parsedNum = parseFloat(num);
        return isNaN(parsedNum) ? "" : Number.isInteger(parsedNum) ? parsedNum.toString() : parsedNum.toFixed(2);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
                    {insumo ? "Editar Insumo" : "Agregar Insumo"}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Nombre</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nombre del insumo"
                            required
                            disabled={editCantidadOnly}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Cantidad</label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="number"
                                min="0"
                                step="0.10"
                                value={cantidad}
                                onChange={(e) => handleCantidadChange(e.target.value)}
                                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Cantidad"
                                required
                            />
                            <button
                                type="button"
                                className="bg-gray-300 text-gray-700 px-3 py-2 rounded hover:bg-gray-400 transition flex items-center justify-center"
                                onClick={handleIncrement}
                            >
                                <FaArrowUp />
                            </button>
                            <button
                                type="button"
                                className="bg-gray-300 text-gray-700 px-3 py-2 rounded hover:bg-gray-400 transition flex items-center justify-center"
                                onClick={handleDecrement}
                            >
                                <FaArrowDown />
                            </button>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Unidad de Medida</label>
                        <select
                            value={unidadMedida}
                            onChange={(e) => setUnidadMedida(e.target.value)}
                            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={editCantidadOnly}
                        >
                            <option value="">Seleccionar unidad de medida</option>
                            <option value="1">Kilo(s)</option>
                            <option value="2">Gramo(s)</option>
                            <option value="3">Litro(s)</option>
                            <option value="4">Unidad(es)</option>
                        </select>
                        {!editCantidadOnly && unidadMedida === "" && (
                            <p className="text-red-500 text-sm mt-2">* Seleccione una unidad de medida válida</p>
                        )}
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                        >
                            {insumo ? "Guardar" : "Agregar"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default InsumoFormModal;
