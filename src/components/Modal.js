import React from 'react';

const Modal = ({ message, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded shadow-lg mt-20 w-3/4 max-w-lg relative">
                <p>{message}</p>
                <div className="flex justify-end mt-6"> {/* 버튼을 오른쪽으로 정렬 */}
                    <button 
                        onClick={onClose} 
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;