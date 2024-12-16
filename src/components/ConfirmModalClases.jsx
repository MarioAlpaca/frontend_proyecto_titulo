import React from 'react';

function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                <p className="mb-4">{message}</p>
                <p className="text-gray-600 text-sm">
                    Los insumos asignados a esta clase serán devueltos al inventario general, excepto si la clase se encuentra en estado <strong>"iniciada"</strong> o <strong>"finalizada"</strong>.
                </p>
                <div className="flex justify-end space-x-2 mt-4">
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-semibold"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        Confirmar
                    </button>
                    <button
                        className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 font-semibold"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;
