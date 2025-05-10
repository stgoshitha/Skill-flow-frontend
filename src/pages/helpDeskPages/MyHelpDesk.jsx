import React, { useEffect, useState } from "react";
import axios from "axios";
import HelpDeskEditForm from "../../components/HelpDeskEditForm";

const MyHelpDesk = () => {
  const [helpDesks, setHelpDesks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

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
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Help Desk Questions</h2>
      {helpDesks.length === 0 ? (
        <p>No help desk questions found.</p>
      ) : (
        <ul className="space-y-3">
          {helpDesks.map((help) => (
            <li key={help.id} className="p-4 border rounded shadow-sm">
              <p className="font-semibold">Question:</p>
              <p>{help.question}</p>
              <p className="text-sm text-gray-500 mt-2">
                Asked by: {help.userName} (User ID: {help.userId})
              </p>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => setEditingId(help.id)}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(help.id)}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>

              {editingId === help.id && (
                <HelpDeskEditForm
                  help={help}
                  onClose={() => setEditingId(null)}
                  onUpdate={handleUpdateLocal}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyHelpDesk;
