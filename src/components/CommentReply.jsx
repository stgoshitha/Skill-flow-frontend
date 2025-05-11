import React, { useState } from 'react';
import CommentReplyService from '../services/CommentReplyService';

const CommentReply = ({ reply, currentUser, onReplyUpdated, onReplyDeleted }) => {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(reply.replyBody);

  const handleEditReply = () => {
    setEditing(true);
    setEditText(reply.replyBody);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditText(reply.replyBody);
  };

  const handleUpdateReply = async () => {
    if (!editText.trim()) {
      return;
    }
    
    try {
      const updatedReply = await CommentReplyService.updateCommentReply(reply.id, editText);
      console.log('Reply updated:', updatedReply);
      
      // Update the reply in the parent component
      onReplyUpdated({
        ...reply,
        replyBody: editText
      });
      
      // Exit edit mode
      setEditing(false);
    } catch (err) {
      console.error('Error updating reply:', err);
      alert('Failed to update reply. Please try again.');
    }
  };

  const handleDeleteReply = async () => {
    if (!window.confirm('Are you sure you want to delete this reply?')) {
      return;
    }
    
    try {
      await CommentReplyService.deleteCommentReply(reply.id);
      
      // Notify parent component about deletion
      onReplyDeleted(reply.id);
    } catch (err) {
      console.error('Error deleting reply:', err);
      alert('Failed to delete reply. Please try again.');
    }
  };

  // Check if the current user is the owner of the reply
  // Since we don't have user info in the reply, we'll assume the current user can edit/delete
  // In a real application, you would check reply.userId === currentUser.id
  const isReplyOwner = currentUser ? true : false;

  if (editing) {
    return (
      <div className="pl-6 mt-2 border-l-2 border-gray-200">
        <div className="mb-2">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="2"
            required
          ></textarea>
          <div className="flex justify-end mt-2 space-x-2">
            <button
              onClick={handleCancelEdit}
              className="px-2 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateReply}
              className="px-2 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pl-6 mt-2 border-l-2 border-gray-200">
      <div className="text-sm text-gray-700">{reply.replyBody}</div>
      {isReplyOwner && (
        <div className="flex justify-end mt-1 space-x-2">
          <button
            onClick={handleEditReply}
            className="text-xs text-gray-500 hover:text-blue-600"
          >
            Edit
          </button>
          <button
            onClick={handleDeleteReply}
            className="text-xs text-gray-500 hover:text-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentReply; 