import React, { useState } from "react";
import axios from "axios";

const HelpDeskEditForm = ({ help, onClose, onUpdate }) => {
  const [question, setQuestion] = useState(help.question);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    setUpdating(true);
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
    }
    setUpdating(false);
  };

  return (
    <div className="p-4 border mt-2 bg-gray-50 rounded">
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full p-2 border rounded"
        rows="3"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      <div className="mt-2 space-x-2">
        <button
          onClick={handleUpdate}
          disabled={updating}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {updating ? "Updating..." : "Update"}
        </button>
        <button
          onClick={onClose}
          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default HelpDeskEditForm;
