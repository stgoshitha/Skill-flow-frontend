import axios from 'axios';

const API_URL = 'http://localhost:8080/comments';

class CommentService {
  // Create a new comment
  createComment(userId, postId, content) {
    return axios.post(API_URL, { content }, {
      params: { userId, postId }
    })
    .then(response => response.data);
  }

  // Get a comment by ID
  getCommentById(commentId) {
    return axios.get(`${API_URL}/${commentId}`)
      .then(response => response.data);
  }

  // Get all comments
  getAllComments() {
    return axios.get(API_URL)
      .then(response => response.data);
  }

  // Update a comment
  updateComment(commentId, content) {
    return axios.put(`${API_URL}/${commentId}`, { content })
      .then(response => response.data);
  }

  // Delete a comment
  deleteComment(commentId) {
    return axios.delete(`${API_URL}/${commentId}`);
  }

  // Like a comment
  likeComment(commentId) {
    return axios.post(`${API_URL}/${commentId}/like`)
      .then(response => response.data);
  }
}

export default new CommentService(); 