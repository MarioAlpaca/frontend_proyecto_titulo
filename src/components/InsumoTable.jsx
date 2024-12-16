import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

const UNIDAD_MEDIDA_MAP = {
    "1": "Kilo(s)",
    "2": "Gramo(s)",
    "3": "Litro(s)",
    "4": "Unidad(es)"
};

// Función para formatear números: enteros sin decimales y decimales con dos cifras
const formatNumber = (num) => {
    const parsedNum = parseFloat(num);
    if (isNaN(parsedNum)) return num; // Devuelve sin cambios si no es un número válido
    return Number.isInteger(parsedNum) ? parsedNum : parsedNum.toFixed(2);
};

function InsumoTable({ insumos, onEdit, onDelete }) {
    return (
        <table className="min-w-full bg-white border border-gray-200">
            <thead>
                <tr>
                    <th className="px-4 py-2 border">N°</th>
                    <th className="px-4 py-2 border">Nombre</th>
                    <th className="px-4 py-2 border">Cantidad</th>
                    <th className="px-4 py-2 border">Tipo</th>
                    <th className="px-4 py-2 border">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {insumos.map((insumo, index) => (
                    <tr key={insumo.id}>
                        <td className="px-4 py-2 border">{index + 1}</td>
                        <td className="px-4 py-2 border">{insumo.nombre}</td>
                        <td className="px-4 py-2 border">{formatNumber(insumo.cantidad_total)}</td>
                        <td className="px-4 py-2 border">
                            {UNIDAD_MEDIDA_MAP[insumo.unidad_medida] || insumo.unidad_medida}
                        </td>
                        <td className="px-0 py-2 border flex space-x-2 justify-center">
                            <button
                                className="flex items-center bg-white border border-gray-300 text-blue-500 px-2 py-1 rounded-full hover:bg-gray-100"
                                onClick={() => onEdit(insumo)}
                            >
                                <FontAwesomeIcon icon={faPen} className="mr-1" />
                                Editar
                            </button>
                            <button
                                className="flex items-center bg-white border border-gray-300 text-red-500 px-2 py-1 rounded-full hover:bg-red-100"
                                onClick={() => onDelete(insumo)}
                            >
                                <FontAwesomeIcon icon={faTrash} className="mr-1" />
                                Eliminar
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default InsumoTable;
