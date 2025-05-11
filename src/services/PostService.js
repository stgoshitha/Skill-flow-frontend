import axios from 'axios';

const API_URL = 'http://localhost:8080/posts';

class PostService {
  // Get all posts
  getAllPosts() {
    return axios.get(API_URL)
      .then(response => response.data);
  }

  // Get a post by ID
  getPostById(postId) {
    return axios.get(`${API_URL}/${postId}`)
      .then(response => response.data);
  }

  // Create a new post
  createPost(userId, categoryId, postData) {
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('description', postData.description);
    
    if (postData.imageFiles) {
      postData.imageFiles.forEach(file => {
        formData.append('imageFiles', file);
      });
    }

    return axios.post(API_URL, formData, {
      params: { userId, categoryId },
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => response.data);
  }

  // Update a post
  updatePost(postId, postData) {
    return axios.put(`${API_URL}/${postId}`, postData)
      .then(response => response.data);
  }

  // Delete a post
  deletePost(postId) {
    return axios.delete(`${API_URL}/${postId}`);
  }

  // Like a post
  likePost(postId) {
    return axios.post(`${API_URL}/${postId}/like`)
      .then(response => response.data);
  }
}

export default new PostService(); 