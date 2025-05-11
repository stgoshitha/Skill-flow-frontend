import axios from 'axios';

const API_URL = 'http://localhost:8080/commentReplies';

class CommentReplyService {
  // Create a new comment reply
  createCommentReply(commentId, replyBody) {
    return axios.post(API_URL, { replyBody }, {
      params: { commentId }
    })
    .then(response => response.data);
  }

  // Get a comment reply by ID
  getCommentReplyById(replyId) {
    return axios.get(`${API_URL}/${replyId}`)
      .then(response => response.data);
  }

  // Get all comment replies
  getAllCommentReplies() {
    return axios.get(API_URL)
      .then(response => response.data);
  }

  // Update a comment reply
  updateCommentReply(replyId, replyBody) {
    return axios.put(`${API_URL}/${replyId}`, { replyBody })
      .then(response => response.data);
  }

  // Delete a comment reply
  deleteCommentReply(replyId) {
    return axios.delete(`${API_URL}/${replyId}`);
  }
}

export default new CommentReplyService(); 