import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CommentService from '../services/CommentService';
import CommentReplyService from '../services/CommentReplyService';
import CommentItem from '../components/CommentItem';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        // Fetch post details
        const postResponse = await axios.get(`http://localhost:8080/posts/${id}`);
        console.log('Post data:', postResponse.data);
        setPost(postResponse.data);
        
        // The post should already include its comments
        if (postResponse.data.comments) {
          const commentsWithReplies = await Promise.all(
            postResponse.data.comments.map(async (comment) => {
              // If the comment already has replies, return as is
              if (comment.commentReply && comment.commentReply.length > 0) {
                return comment;
              }
              
              // Otherwise, try to fetch replies for this comment
              try {
                // Get all comment replies and filter by comment ID
                const allReplies = await CommentReplyService.getAllCommentReplies();
                const commentReplies = allReplies.filter(reply => reply.commentId === comment.id);
                
                return {
                  ...comment,
                  commentReply: commentReplies
                };
              } catch (err) {
                console.error(`Error fetching replies for comment ${comment.id}:`, err);
                return comment;
              }
            })
          );
          
          setComments(commentsWithReplies);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching post details:', err);
        setError('Failed to load post. Please try again later.');
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) {
      return;
    }
    
    if (!currentUser) {
      alert('You must be logged in to comment.');
      return;
    }
    
    setSubmittingComment(true);
    
    try {
      // Use CommentService to create a comment
      const newCommentData = await CommentService.createComment(
        currentUser.id,
        id,
        commentText
      );
      
      console.log('Comment created:', newCommentData);
      
      // Add the new comment to the comments list with user information
      const newComment = {
        ...newCommentData,
        user: {
          id: currentUser.id,
          username: currentUser.username
        },
        commentReply: [] // Initialize empty replies array
      };
      
      setComments([...comments, newComment]);
      setCommentText('');
    } catch (err) {
      console.error('Error submitting comment:', err);
      alert('Failed to submit comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleCommentUpdated = (updatedComment) => {
    setComments(comments.map(comment => 
      comment.id === updatedComment.id ? updatedComment : comment
    ));
  };

  const handleCommentDeleted = (commentId) => {
    setComments(comments.filter(comment => comment.id !== commentId));
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    
    try {
      await axios.delete(`http://localhost:8080/posts/${id}`);
      navigate('/posts');
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete post. Please try again.');
    }
  };

  const handleNextImage = () => {
    if (post.imageUrl && post.imageUrl.length > 1) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === post.imageUrl.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (post.imageUrl && post.imageUrl.length > 1) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? post.imageUrl.length - 1 : prevIndex - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow">
            <p>{error || 'Post not found'}</p>
          </div>
          <div className="mt-4">
            <Link to="/posts" className="text-blue-600 hover:underline flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Posts
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isAuthor = currentUser && post.userId === currentUser.id;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex text-sm text-gray-500">
            <Link to="/" className="hover:text-gray-700">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/posts" className="hover:text-gray-700">Posts</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium truncate">{post.title}</span>
          </nav>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
              {/* Post Header */}
              <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <div className="flex justify-between items-start">
                  <h1 className="text-3xl font-bold leading-tight">{post.title}</h1>
                  {isAuthor && (
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => navigate(`/edit-post/${post.id}`)}
                        className="p-2 bg-blue-500 bg-opacity-30 rounded-full hover:bg-opacity-50 transition-colors"
                        title="Edit post"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={handleDeletePost}
                        className="p-2 bg-red-500 bg-opacity-30 rounded-full hover:bg-opacity-50 transition-colors"
                        title="Delete post"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                
                {post.category && (
                  <div className="mt-2">
                    <span className="inline-block bg-white bg-opacity-20 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      {post.category.categoryName}
                    </span>
                  </div>
                )}
              </div>

              {/* Post Images */}
              {post.imageUrl && post.imageUrl.length > 0 && (
                <div className="relative">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={post.imageUrl[currentImageIndex]}
                      alt={`${post.title} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {post.imageUrl.length > 1 && (
                    <>
                      <button 
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button 
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      
                      {/* Image counter */}
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-md">
                        {currentImageIndex + 1} / {post.imageUrl.length}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Post Content */}
              <div className="p-6">
                {/* Author and Date Info */}
                <div className="flex items-center mb-6">
                  {post.user && (
                    <div className="flex items-center mr-6">
                      <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-lg mr-3">
                        {post.user.username ? post.user.username.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{post.user.username || 'Unknown'}</div>
                        <div className="text-xs text-gray-500">Author</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-500 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                {/* Post Description */}
                <div className="prose max-w-none text-gray-800">
                  <p className="whitespace-pre-wrap leading-relaxed">{post.description}</p>
                </div>
                
                {/* Share and Actions */}
                <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100">
                  <div className="flex space-x-2">
                    <button className="flex items-center text-gray-500 hover:text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Share
                    </button>
                  </div>
                  
                  <Link 
                    to="/posts" 
                    className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Posts
                  </Link>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-8 bg-white shadow-lg rounded-xl overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">
                  Comments {comments.length > 0 && `(${comments.length})`}
                </h2>
              </div>
              
              <div className="p-6">
                {/* Comment Form */}
                {currentUser ? (
                  <form onSubmit={handleCommentSubmit} className="mb-8">
                    <div className="mb-3">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        rows="3"
                        placeholder="Add a comment..."
                        required
                      ></textarea>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={submittingComment}
                        className={`px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                          submittingComment ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {submittingComment ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                          </span>
                        ) : 'Submit Comment'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="bg-blue-50 text-blue-700 p-4 rounded-lg mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm">
                          Please <Link to="/login" className="font-medium underline hover:text-blue-800">login</Link> to add a comment.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Comments List */}
                {comments && comments.length > 0 ? (
                  <div className="space-y-6">
                    {comments.map((comment) => (
                      <CommentItem
                        key={comment.id}
                        comment={comment}
                        currentUser={currentUser}
                        onCommentUpdated={handleCommentUpdated}
                        onCommentDeleted={handleCommentDeleted}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="mt-2 text-gray-500 italic">No comments yet. Be the first to comment!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-6">
            {/* Author Card */}
            {post.user && (
              <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">About the Author</h3>
                  <div className="flex items-center">
                    <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-2xl mr-4">
                      {post.user.username ? post.user.username.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div>
                      <div className="text-xl font-semibold text-gray-800">{post.user.username || 'Unknown'}</div>
                      {post.user.email && <div className="text-gray-600">{post.user.email}</div>}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Category Card */}
            {post.category && (
              <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Category</h3>
                  <div className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    {post.category.categoryName}
                  </div>
                </div>
              </div>
            )}
            
            {/* Related Posts Placeholder */}
            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Related Posts</h3>
                <p className="text-gray-500 text-sm">Explore more posts in this category.</p>
                <Link to="/posts" className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium">
                  View All Posts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PostDetail; 