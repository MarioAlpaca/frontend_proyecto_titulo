import React from "react";

function formatNumber(value) {
    if (value === null || value === undefined) return "N/A";
    const numberValue = parseFloat(value);
    if (isNaN(numberValue)) return "N/A";
    return Number.isInteger(numberValue) ? numberValue : numberValue.toFixed(2);
}

function normalizeInsumo(insumo, isFinalizada, isIniciada) {
    return {
        nombre: insumo.insumo || insumo.nombre || "Desconocido",
        unidad: insumo.unidad_medida || "N/A",
        total: insumo.cantidad_total_asignada || insumo.total_cantidad || 0,
        utilizado: insumo.cantidad_utilizada || 0,
        devuelto: insumo.cantidad_devuelta || 0,
        extra: insumo.cantidad_extra_asignada || 0,
        repartida: insumo.cantidad_repartida || 0,
        restante: insumo.cantidad_restante || 0,
    };
}

function VerInsumosModal({ isOpen, onClose, insumos = [], isFinalizada = false, isIniciada = false }) {
    if (!isOpen) return null;

    // Asegurar que `insumos` sea siempre un array
    const insumosArray = Array.isArray(insumos) ? insumos : insumos.insumos || [];

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl max-w-4xl w-full mx-6 md:mx-auto overflow-y-auto max-h-[90vh]">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    {isFinalizada
                        ? "Historial de Insumos"
                        : isIniciada
                        ? "Insumos en Clase"
                        : "Insumos Asignados"}
                </h2>
                {insumosArray.length === 0 ? (
                    <p className="text-gray-600 text-center text-lg">No hay insumos asignados a la clase.</p>
                ) : (
                    <table className="w-full border-collapse border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-center px-6 py-3 border border-gray-300 text-sm font-medium">Nombre</th>
                                <th className="text-center px-6 py-3 border border-gray-300 text-sm font-medium">Unidad</th>
                                {isFinalizada && (
                                    <>
                                        <th className="text-center px-6 py-3 border border-gray-300 text-sm font-medium">
                                            Cantidad Total
                                        </th>
                                        <th className="text-center px-6 py-3 border border-gray-300 text-sm font-medium">
                                            Utilizado
                                        </th>
                                        <th className="text-center px-6 py-3 border border-gray-300 text-sm font-medium">
                                            Devuelto
                                        </th>
                                        <th className="text-center px-6 py-3 border border-gray-300 text-sm font-medium">
                                            Extra Solicitado
                                        </th>
                                    </>
                                )}
                                {isIniciada && (
                                    <>
                                        <th className="text-center px-6 py-3 border border-gray-300 text-sm font-medium">Total</th>
                                        <th className="text-center px-6 py-3 border border-gray-300 text-sm font-medium">
                                            Repartida
                                        </th>
                                        <th className="text-center px-6 py-3 border border-gray-300 text-sm font-medium">
                                            Restante
                                        </th>
                                    </>
                                )}
                                {!isFinalizada && !isIniciada && (
                                    <th className="text-center px-6 py-3 border border-gray-300 text-sm font-medium">Cantidad</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {insumosArray.map((insumo, index) => {
                                const data = normalizeInsumo(insumo, isFinalizada, isIniciada);

                                return (
                                    <tr
                                        key={index}
                                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                    >
                                        <td className="px-6 py-3 text-center border border-gray-300 text-sm text-gray-800">
                                            {data.nombre}
                                        </td>
                                        <td className="px-6 py-3 text-center border border-gray-300 text-sm">{data.unidad}</td>
                                        {isFinalizada && (
                                            <>
                                                <td className="px-6 py-3 text-center border border-gray-300 text-sm">
                                                    {formatNumber(data.total)}
                                                </td>
                                                <td className="px-6 py-3 text-center border border-gray-300 text-sm">
                                                    {formatNumber(data.utilizado)}
                                                </td>
                                                <td className="px-6 py-3 text-center border border-gray-300 text-sm">
                                                    {formatNumber(data.devuelto)}
                                                </td>
                                                <td className="px-6 py-3 text-center border border-gray-300 text-sm">
                                                    {formatNumber(data.extra)}
                                                </td>
                                            </>
                                        )}
                                        {isIniciada && (
                                            <>
                                                <td className="px-6 py-3 text-center border border-gray-300 text-sm">
                                                    {formatNumber(data.total)}
                                                </td>
                                                <td className="px-6 py-3 text-center border border-gray-300 text-sm">
                                                    {formatNumber(data.repartida)}
                                                </td>
                                                <td className="px-6 py-3 text-center border border-gray-300 text-sm">
                                                    {formatNumber(data.restante)}
                                                </td>
                                            </>
                                        )}
                                        {!isFinalizada && !isIniciada && (
                                            <>
                                                <td className="px-6 py-3 text-center border border-gray-300 text-sm">
                                                    {formatNumber(data.total)}
                                                </td>
                        
                                            </>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
                <div className="flex justify-end mt-8">
                    <button
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                        onClick={onClose}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VerInsumosModal;
