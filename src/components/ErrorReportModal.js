import React from 'react';

const ErrorReportModal = ({ onClose, onSubmit }) => {
  const [selectedError, setSelectedError] = React.useState("");

  const errorOptions = [
    "Content is weird.",
    "Image is weird.",
    "Content is exceeding the screen.",
    "Some sentence is not written in black.",
    "Numbering is taking a whole page.",
    "There is an awkward punctuation mark (\*, \", etc.).",
    "Other error has occurred."
  ];

  const handleSubmit = () => {
    if (!selectedError) {
      alert("Please select an error type.");
      return;
    }
    onSubmit(selectedError);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-md w-[300px]">
        <h2 className="text-xl font-bold mb-4">Please Select An Error Type</h2>
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
          <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">Report</button>
        </div>
      </div>
    </div>
  );
};

export default ErrorReportModal;
