import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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
  const [expandedQuestions, setExpandedQuestions] = useState({});

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
      // Submit the reply
      const response = await axios.post(
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
      
      // Always show replies after submitting
      setExpandedQuestions(prev => ({
        ...prev,
        [helpDeskId]: true
      }));
      
      // Get all replies and filter by helpdesk ID
      await loadAllRepliesAndFilter();
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error submitting reply:", error);
      alert(error?.response?.data || "Failed to submit reply.");
    }
  };

  // Load all replies and filter them by helpdesk ID
  const loadAllRepliesAndFilter = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/replies`);
      
      // Group replies by helpdesk ID
      const repliesByHelpDesk = response.data.reduce((acc, reply) => {
        const helpDeskId = reply.helpDeskId;
        if (!acc[helpDeskId]) {
          acc[helpDeskId] = [];
        }
        acc[helpDeskId].push(reply);
        return acc;
      }, {});
      
      setReplies(repliesByHelpDesk);
    } catch (error) {
      console.error("Error fetching all replies:", error);
    }
  };

  const loadReplies = async (helpDeskId) => {
    setLoadingReplies((prev) => ({ ...prev, [helpDeskId]: true }));
    
    try {
      // Get all replies and filter by helpdesk ID
      const response = await axios.get(`http://localhost:8080/replies`);
      
      // Filter replies for the specific helpdesk ID
      const filteredReplies = response.data.filter(reply => reply.helpDeskId === helpDeskId);
      
      // Update the replies state
      setReplies(prev => ({
        ...prev,
        [helpDeskId]: filteredReplies
      }));
    } catch (error) {
      console.error("Error fetching replies:", error);
    } finally {
      setLoadingReplies((prev) => ({ ...prev, [helpDeskId]: false }));
    }
  };

  const toggleReplies = async (helpDeskId) => {
    // If we're closing the replies section, just toggle the state
    if (expandedQuestions[helpDeskId]) {
      setExpandedQuestions(prev => ({
        ...prev,
        [helpDeskId]: false
      }));
      return;
    }
    
    // If we're opening the replies section, load the replies first
    await loadReplies(helpDeskId);
    
    // Then expand the section
    setExpandedQuestions(prev => ({
      ...prev,
      [helpDeskId]: true
    }));
  };

  const handleDeleteReply = async (replyId, helpDeskId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this reply?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8080/replies/${replyId}`);
      loadReplies(helpDeskId);
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
        reply_text: newText
      });

      setEditingReplyId(null);
      loadReplies(helpDeskId);
    } catch (error) {
      console.error("Error updating reply:", error);
      alert(error?.response?.data || "Failed to update reply.");
    }
  };

  // Load all replies when component mounts
  useEffect(() => {
    loadAllRepliesAndFilter();
  }, []);

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
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h2 className="text-3xl font-bold text-gray-800">All Help Desk Questions</h2>
        <Link 
          to="/helps" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create New Question
        </Link>
      </div>

      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded shadow-sm transition-all duration-300">
          {successMessage}
        </div>
      )}

      {helpDesks.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg shadow-sm">
          <p className="text-gray-500 text-lg">No help desk questions found.</p>
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

              <div className="mt-4 bg-gray-50 p-4 rounded-md">
                <textarea
                  value={replyTexts[help.id] || ""}
                  onChange={(e) => handleReplyChange(help.id, e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  rows={3}
                  placeholder="Type your reply here..."
                />
                <button
                  onClick={() => handleSubmitReply(help.id)}
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
                >
                  Submit Reply
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => toggleReplies(help.id)}
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {loadingReplies[help.id] ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading replies...
                    </span>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-1 transition-transform ${expandedQuestions[help.id] ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      {expandedQuestions[help.id] ? "Hide Replies" : "Show Replies"}
                    </>
                  )}
                </button>

                {expandedQuestions[help.id] && (
                  <div className="mt-3 pl-4 border-l-2 border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Replies ({replies[help.id]?.length || 0})
                    </h4>
                    {replies[help.id]?.length > 0 ? (
                      <ul className="space-y-4">
                        {replies[help.id].map((reply) => (
                          <li key={reply.id} className="bg-gray-50 p-3 rounded-md">
                            <div className="flex justify-between items-center mb-2">
                              <p className="font-medium text-sm text-gray-700">{reply.username}</p>
                              <span className="text-xs text-gray-500">Reply #{reply.id}</span>
                            </div>

                            {editingReplyId === reply.id ? (
                              <div className="mt-2">
                                <textarea
                                  value={editTexts[reply.id] || ""}
                                  onChange={(e) =>
                                    setEditTexts((prev) => ({ ...prev, [reply.id]: e.target.value }))
                                  }
                                  className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                  rows={2}
                                />
                                <div className="flex mt-2 space-x-2">
                                  <button
                                    onClick={() => handleUpdateReply(reply.id, help.id)}
                                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingReplyId(null)}
                                    className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400 transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-gray-700">{reply.replyText}</p>
                            )}

                            {reply.userId === currentUserId && editingReplyId !== reply.id && (
                              <div className="mt-2 flex gap-3 text-xs">
                                <button
                                  onClick={() => handleEditReply(reply.id, reply.replyText)}
                                  className="flex items-center text-blue-600 hover:text-blue-800"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteReply(reply.id, help.id)}
                                  className="flex items-center text-red-600 hover:text-red-800"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Delete
                                </button>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No replies yet.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HelpDesk;
