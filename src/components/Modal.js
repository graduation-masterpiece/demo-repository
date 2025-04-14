import React from "react";

const Modal = ({ message, onClose, showSpinner, children }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded p-6 text-center max-w-sm w-full shadow-lg">
                {showSpinner && (
                    <div className="mb-4">
                        <div className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                    </div>
                )}
                <p className="text-gray-700">{message}</p>
                {children}
                <button
                    onClick={onClose}
                    className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
                >
                    닫기
                </button>
            </div>
        </div>
    );
};

export default Modal;
