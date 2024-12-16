import React, { useState, useEffect } from "react";
import api from "../api";
import { toast } from "react-toastify";

function AsignarInsumosModal({ isOpen, onClose, onSubmit, claseId }) {
    const [insumos, setInsumos] = useState([]);
    const [selectedInsumos, setSelectedInsumos] = useState({});

    useEffect(() => {
        if (isOpen) {
            fetchInsumos();
        } else {
            resetModalState();
        }
    }, [isOpen]);

    const fetchInsumos = async () => {
        try {
            const res = await api.get("/insumos/insumos/");
            setInsumos(res.data.results || []);
            toast.info("Insumos cargados correctamente.");
        } catch (err) {
            toast.error("Error al obtener insumos: " + err.message);
            setInsumos([]);
        }
    };

    const resetModalState = () => {
        setSelectedInsumos({});
    };

    const handleCheckboxChange = (insumoId) => {
        setSelectedInsumos((prev) => ({
            ...prev,
            [insumoId]: prev[insumoId] ? undefined : { cantidad: "0.00" },
        }));
    };

    const handleQuantityChange = (insumoId, value) => {
        const parsedValue = parseFloat(value);
        const maxValue = insumos.find((insumo) => insumo.id === insumoId)?.cantidad_total || 0;

        if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= maxValue) {
            setSelectedInsumos((prev) => ({
                ...prev,
                [insumoId]: { ...prev[insumoId], cantidad: value },
            }));
        } else {
            toast.warning("Cantidad inválida o excede el stock disponible.");
        }
    };

    const handleConfirm = () => {
        const insumosToAssign = Object.entries(selectedInsumos)
            .filter(([_, value]) => value && parseFloat(value.cantidad) > 0)
            .map(([id, data]) => ({ insumo_id: id, cantidad: parseFloat(data.cantidad) }));

        if (insumosToAssign.length > 0) {
            onSubmit(insumosToAssign);
            toast.success("Insumos asignados correctamente.");
        } else {
            toast.error("No se seleccionaron cantidades válidas para asignar.");
        }
        resetModalState();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Asignar Insumos</h2>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {insumos.length === 0 ? (
                        <p className="text-gray-500 text-center">No hay insumos disponibles para asignar.</p>
                    ) : (
                        insumos.map((insumo) => (
                            <div key={insumo.id} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={!!selectedInsumos[insumo.id]}
                                        onChange={() => handleCheckboxChange(insumo.id)}
                                        className="mr-3 accent-red-500"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-800">
                                            {insumo.nombre} -{" "}
                                            <span className="text-sm text-gray-500">
                                                {insumo.unidad_medida_descripcion}
                                            </span>
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Disponible: {insumo.cantidad_total}
                                        </p>
                                    </div>
                                </div>
                                {selectedInsumos[insumo.id] && (
                                    <div className="flex items-center space-x-2">
                                        <button
                                            type="button"
                                            className="bg-gray-200 text-black px-2 py-1 rounded hover:bg-gray-300"
                                            onClick={() =>
                                                handleQuantityChange(
                                                    insumo.id,
                                                    (parseFloat(selectedInsumos[insumo.id].cantidad) - 0.1).toFixed(2)
                                                )
                                            }
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={selectedInsumos[insumo.id].cantidad}
                                            step="0.1" // Permite pasos de 0.1
                                            min="0"
                                            max={insumo.cantidad_total}
                                            onChange={(e) => handleQuantityChange(insumo.id, e.target.value)}
                                            className="border border-gray-300 p-1 w-20 text-center rounded"
                                        />
                                        <button
                                            type="button"
                                            className="bg-gray-200 text-black px-2 py-1 rounded hover:bg-gray-300"
                                            onClick={() =>
                                                handleQuantityChange(
                                                    insumo.id,
                                                    (parseFloat(selectedInsumos[insumo.id].cantidad) + 0.1).toFixed(2)
                                                )
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
                <div className="flex justify-end mt-6 space-x-2">
                    <button
                        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition"
                        onClick={handleConfirm}
                    >
                        Confirmar
                    </button>
                    <button
                        className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 transition"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AsignarInsumosModal;
