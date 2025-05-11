import React, { useEffect, useState } from "react";
import axios from "axios";
import HelpDeskEditForm from "../../components/HelpDeskEditForm";

const MyHelpDesk = () => {
  const [helpDesks, setHelpDesks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      setError("User ID not found in local storage.");
      setLoading(false);
      return;
    }

    const fetchHelpDesks = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/helps/user/${userId}`);
        setHelpDesks(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching help desk data:", err);
        setError("Failed to fetch help desk entries.");
        setLoading(false);
      }
    };

    fetchHelpDesks();
  }, [userId]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await axios.delete(`http://localhost:8080/helps/${id}`);
        setHelpDesks(helpDesks.filter((help) => help.id !== id));
        setSuccessMessage("Question deleted successfully");
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } catch (err) {
        console.error("Error deleting help desk entry:", err);
        alert("Failed to delete the help desk question.");
      }
    }
  };

  const handleUpdateLocal = (updatedHelp) => {
    setHelpDesks((prev) =>
      prev.map((help) => (help.id === updatedHelp.id ? updatedHelp : help))
    );
    setSuccessMessage("Question updated successfully");
    
    // Auto-hide success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">My Help Desk Questions</h2>
      
      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded shadow-sm transition-all duration-300">
          {successMessage}
        </div>
      )}
      
      {helpDesks.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg shadow-sm">
          <p className="text-gray-500 text-lg">No help desk questions found.</p>
          <p className="text-gray-400 mt-2">Create a new question to get started.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {helpDesks.map((help) => (
            <div key={help.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">Question:</h3>
                  <p className="text-gray-700 mb-3">{help.question}</p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">ID: {help.id}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-500 mt-2 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p>Asked by: <span className="font-medium">{help.userName}</span></p>
              </div>
              
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setEditingId(help.id)}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(help.id)}
                  className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>

              {editingId === help.id && (
                <div className="mt-6 border-t pt-4 border-gray-100">
                  <h4 className="font-medium text-gray-700 mb-2">Edit Question</h4>
                  <HelpDeskEditForm
                    help={help}
                    onClose={() => setEditingId(null)}
                    onUpdate={handleUpdateLocal}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyHelpDesk;
