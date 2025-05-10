import React, { useEffect, useState } from "react";
import axios from "axios";

const HelpDesk = () => {
  const [helpDesks, setHelpDesks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [replyTexts, setReplyTexts] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [replies, setReplies] = useState({});
  const [loadingReplies, setLoadingReplies] = useState({});
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editTexts, setEditTexts] = useState({});

  // Get current user ID from localStorage
  const currentUserId = JSON.parse(localStorage.getItem('user'))?.id || 0;

  useEffect(() => {
    const fetchAllHelpDesks = async () => {
      try {
        const response = await axios.get("http://localhost:8080/helps");
        setHelpDesks(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching help desks:", err);
        setError("Failed to fetch help desk questions.");
        setLoading(false);
      }
    };

    fetchAllHelpDesks();
  }, []);

  const handleReplyChange = (helpDeskId, text) => {
    setReplyTexts((prev) => ({ ...prev, [helpDeskId]: text }));
  };

  const handleSubmitReply = async (helpDeskId) => {
    const reply_text = replyTexts[helpDeskId];

    if (!reply_text?.trim()) {
      alert("Please enter a reply.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/replies`,
        { reply_text },
        {
          params: {
            userId: currentUserId,
            helpDeskId: helpDeskId,
          },
        }
      );

      setSuccessMessage("Reply sent successfully.");
      setReplyTexts((prev) => ({ ...prev, [helpDeskId]: "" }));
      fetchRepliesByHelpDesk(helpDeskId);
    } catch (error) {
      console.error("Error submitting reply:", error);
      alert(error?.response?.data || "Failed to submit reply.");
    }
  };

  const fetchRepliesByHelpDesk = async (helpDeskId) => {
    if (loadingReplies[helpDeskId]) return;

    setLoadingReplies((prev) => ({ ...prev, [helpDeskId]: true }));
    try {
      const response = await axios.get(`http://localhost:8080/replies/helpdesk/${helpDeskId}`);
      setReplies((prev) => ({ ...prev, [helpDeskId]: response.data }));
    } catch (error) {
      console.error("Error fetching replies:", error);
    } finally {
      setLoadingReplies((prev) => ({ ...prev, [helpDeskId]: false }));
    }
  };

  const handleDeleteReply = async (replyId, helpDeskId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this reply?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8080/replies/${replyId}`, {
        params: { userId: currentUserId },
      });
      fetchRepliesByHelpDesk(helpDeskId);
    } catch (error) {
      console.error("Error deleting reply:", error);
      alert(error?.response?.data || "Failed to delete reply.");
    }
  };

  const handleEditReply = (replyId, replyText) => {
    setEditingReplyId(replyId);
    setEditTexts((prev) => ({ ...prev, [replyId]: replyText }));
  };

  const handleUpdateReply = async (replyId, helpDeskId) => {
    const newText = editTexts[replyId];

    if (!newText?.trim()) {
      alert("Please enter a reply.");
      return;
    }

    try {
      await axios.put(`http://localhost:8080/replies/${replyId}`, {
        reply_text: newText,
        userId: currentUserId,
      });

      setEditingReplyId(null);
      fetchRepliesByHelpDesk(helpDeskId);
    } catch (error) {
      console.error("Error updating reply:", error);
      alert(error?.response?.data || "Failed to update reply.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">All Help Desk Questions</h2>

      {helpDesks.length === 0 ? (
        <p>No help desk questions found.</p>
      ) : (
        helpDesks.map((help) => (
          <div key={help.id} className="p-4 border rounded shadow-sm mb-6">
            <p className="font-semibold">Question:</p>
            <p>{help.question}</p>
            <p className="text-sm text-gray-500 mt-2">
              Asked by: {help.userName} (User ID: {help.userId})
            </p>

            <div className="mt-4">
              <textarea
                value={replyTexts[help.id] || ""}
                onChange={(e) => handleReplyChange(help.id, e.target.value)}
                className="w-full border rounded p-2"
                rows={3}
                placeholder="Type your reply here..."
              />
              <button
                onClick={() => handleSubmitReply(help.id)}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Submit Reply
              </button>
            </div>

            <div className="mt-4">
              <button
                onClick={() => fetchRepliesByHelpDesk(help.id)}
                className="text-sm text-blue-600 hover:underline"
              >
                {loadingReplies[help.id] ? "Loading replies..." : "Show Replies"}
              </button>

              {replies[help.id] && replies[help.id].length > 0 && (
                <ul className="mt-2 pl-4">
                  {replies[help.id].map((reply) => (
                    <li key={reply.id} className="border-b pb-2 mb-2">
                      <p className="font-semibold">User ID: {reply.username}</p>

                      {editingReplyId === reply.id ? (
                        <>
                          <textarea
                            value={editTexts[reply.id] || ""}
                            onChange={(e) =>
                              setEditTexts((prev) => ({ ...prev, [reply.id]: e.target.value }))
                            }
                            className="w-full border rounded p-2 mt-1"
                            rows={2}
                          />
                          <button
                            onClick={() => handleUpdateReply(reply.id, help.id)}
                            className="mt-1 mr-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingReplyId(null)}
                            className="mt-1 text-gray-500 hover:underline text-sm"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <p>{reply.replyText}</p>
                      )}

                      {reply.userId === currentUserId && editingReplyId !== reply.id && (
                        <div className="mt-1 flex gap-2 text-sm">
                          <button
                            onClick={() => handleEditReply(reply.id, reply.replyText)}
                            className="text-blue-500 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteReply(reply.id, help.id)}
                            className="text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))
      )}

      {successMessage && <div className="text-green-600 mt-4">{successMessage}</div>}
    </div>
  );
};

export default HelpDesk;
