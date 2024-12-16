import React from "react";

function NotFound() {
    return (
        <div
            className="flex items-center justify-center h-screen bg-gray-200"
            style={{ fontFamily: "'Arial', sans-serif" }}
        >
            <div className="text-center">
                <h1 className="text-9xl font-extrabold flex justify-center items-center">
                    <span className="text-red-600">4</span>
                    <span className="text-white bg-red-600 px-4 rounded-md">0</span>
                    <span className="text-red-600">4</span>
                </h1>
                <p className="mt-6 text-2xl font-bold text-gray-800">
                    404 - Página no encontrada
                </p>
                <p className="mt-2 text-gray-600">
                    La página a la cual intentas acceder no existe o ha sido movida.
                </p>
                <div className="mt-8">
                    <a
                        href="/"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition duration-200"
                    >
                        Volver al inicio
                    </a>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
