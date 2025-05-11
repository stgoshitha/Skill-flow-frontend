import React, { useState } from "react";
import axios from "axios";

const HelpDeskEditForm = ({ help, onClose, onUpdate }) => {
  const [question, setQuestion] = useState(help.question);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    if (!question.trim()) {
      setError("Question cannot be empty");
      return;
    }
    
    setUpdating(true);
    setError("");
    
    try {
      const response = await axios.put(`http://localhost:8080/helps/${help.id}`, {
        ...help,
        question,
      });
      onUpdate(response.data); // update in parent
      onClose(); // close form
    } catch (err) {
      console.error("Update failed:", err);
      setError("Failed to update the help desk question.");
      setUpdating(false);
    }
  };

  return (
    <div className="p-5 border mt-2 bg-gray-50 rounded-md shadow-sm">
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        rows="4"
        placeholder="Edit your question here..."
      />
      
      {error && (
        <div className="mt-3 p-2 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
          <p>{error}</p>
        </div>
      )}
      
      <div className="mt-4 flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleUpdate}
          disabled={updating}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {updating ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  );
};

export default HelpDeskEditForm;
