import React, { useEffect, useState } from 'react';

const ErrorReportModal = ({ onClose, onSubmit }) => {
  const [selectedError, setSelectedError] = useState("");

  const errorOptions = [
    "Content is weird.",
    "Image is weird.",
    "Content is exceeding the screen.",
    "Some sentence is not written in black.",
    "Numbering is taking a whole page.",
    "There is an awkward punctuation mark (*, \", etc.).",
    "Other error has occurred."
  ];

  const handleSubmit = () => {
    if (!selectedError) {
      alert("Please select an error type.");
      return;
    }
    onSubmit(selectedError);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div onClick={(e) => e.stopPropagation()} className="bg-white p-6 rounded-xl shadow-md w-[300px]">
        <h2 className="text-xl font-bold mb-4">Select The Error Type Below:</h2>
        <select
          value={selectedError}
          onChange={(e) => setSelectedError(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="">-- SELECT --</option>
          {errorOptions.map((error, index) => (
            <option key={index} value={error}>
              {error}
            </option>
          ))}
        </select>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          <button onClick={handleSubmit} disabled={!selectedError} className="bg-blue-500 text-white px-4 py-2 rounded">Report</button>
        </div>
      </div>
    </div>
  );
};

export default ErrorReportModal;
