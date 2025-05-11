import React, { useState, useEffect } from 'react';
import CommentService from '../services/CommentService';
import CommentReplyService from '../services/CommentReplyService';
import CommentReply from './CommentReply';

const CommentItem = ({ comment, currentUser, onCommentUpdated, onCommentDeleted }) => {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [isLiking, setIsLiking] = useState(false);
  const [replies, setReplies] = useState([]);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [submittingReply, setSubmittingReply] = useState(false);

  useEffect(() => {
    // Initialize replies if they exist
    if (comment.commentReply) {
      setReplies(comment.commentReply);
    }
  }, [comment]);

  const handleEditComment = () => {
    setEditing(true);
    setEditText(comment.content);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditText(comment.content);
  };

  const handleUpdateComment = async () => {
    if (!editText.trim()) {
      return;
    }
    
    try {
      const updatedComment = await CommentService.updateComment(comment.id, editText);
      console.log('Comment updated:', updatedComment);
      
      // Update the comment in the parent component
      onCommentUpdated({
        ...comment,
        content: editText
      });
      
      // Exit edit mode
      setEditing(false);
    } catch (err) {
      console.error('Error updating comment:', err);
      alert('Failed to update comment. Please try again.');
    }
  };

  const handleDeleteComment = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }
    
    try {
      await CommentService.deleteComment(comment.id);
      
      // Notify parent component about deletion
      onCommentDeleted(comment.id);
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert('Failed to delete comment. Please try again.');
    }
  };

  const handleLikeComment = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      await CommentService.likeComment(comment.id);
      
      // Update the comment in the parent component
      onCommentUpdated({
        ...comment,
        likedCount: (comment.likedCount || 0) + 1
      });
    } catch (err) {
      console.error('Error liking comment:', err);
      alert('Failed to like comment. Please try again.');
    } finally {
      setIsLiking(false);
    }
  };

  const toggleReplyForm = () => {
    setIsReplying(!isReplying);
    if (!showReplies) {
      setShowReplies(true);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    
    if (!replyText.trim()) {
      return;
    }
    
    setSubmittingReply(true);
    
    try {
      const newReply = await CommentReplyService.createCommentReply(
        comment.id,
        replyText
      );
      
      console.log('Reply created:', newReply);
      
      // Add the new reply to the list
      setReplies([...replies, newReply]);
      setReplyText('');
      setIsReplying(false);
    } catch (err) {
      console.error('Error submitting reply:', err);
      alert('Failed to submit reply. Please try again.');
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleReplyUpdated = (updatedReply) => {
    setReplies(replies.map(reply => 
      reply.id === updatedReply.id ? updatedReply : reply
    ));
  };

  const handleReplyDeleted = (replyId) => {
    setReplies(replies.filter(reply => reply.id !== replyId));
  };

  const isCommentOwner = currentUser && comment.userId === currentUser.id;

  if (editing) {
    return (
      <div className="bg-gray-50 p-4 rounded-md">
        <div className="mb-3">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            required
          ></textarea>
          <div className="flex justify-end mt-2 space-x-2">
            <button
              onClick={handleCancelEdit}
              className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateComment}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <div className="flex justify-between items-start">
        <div className="font-medium">
          {comment.user ? comment.user.username : 'Anonymous'}
        </div>
        <div className="text-sm text-gray-500">
          {comment.createdAt && new Date(comment.createdAt).toLocaleDateString()}
        </div>
      </div>
      <p className="mt-2 text-gray-700">{comment.content}</p>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleLikeComment}
            disabled={isLiking}
            className="flex items-center text-gray-500 hover:text-blue-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            <span>{comment.likedCount || 0}</span>
          </button>
          
          <button 
            onClick={toggleReplyForm}
            className="flex items-center text-gray-500 hover:text-blue-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            <span>Reply</span>
          </button>
          
          {replies.length > 0 && (
            <button 
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center text-gray-500 hover:text-blue-600"
            >
              <span>{showReplies ? 'Hide' : 'Show'} {replies.length} {replies.length === 1 ? 'reply' : 'replies'}</span>
            </button>
          )}
        </div>
        
        {isCommentOwner && (
          <div className="flex space-x-2">
            <button
              onClick={handleEditComment}
              className="text-gray-500 hover:text-blue-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleDeleteComment}
              className="text-gray-500 hover:text-red-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {/* Reply form */}
      {isReplying && currentUser && (
        <div className="mt-3 pl-6 border-l-2 border-gray-200">
          <form onSubmit={handleReplySubmit}>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="2"
              placeholder="Write a reply..."
              required
            ></textarea>
            <div className="flex justify-end mt-2 space-x-2">
              <button
                type="button"
                onClick={() => setIsReplying(false)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingReply}
                className={`px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
                  submittingReply ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {submittingReply ? 'Submitting...' : 'Reply'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Replies list */}
      {showReplies && replies.length > 0 && (
        <div className="mt-3">
          {replies.map((reply) => (
            <CommentReply
              key={reply.id}
              reply={reply}
              currentUser={currentUser}
              onReplyUpdated={handleReplyUpdated}
              onReplyDeleted={handleReplyDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem; 