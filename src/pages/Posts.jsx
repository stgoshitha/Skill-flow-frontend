import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PostService from '../services/PostService';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [likingPostId, setLikingPostId] = useState(null);
  const navigate = useNavigate();
  
  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await PostService.getAllPosts();
        console.log('Posts data:', response);
        
        // Log image URLs for debugging
        response.forEach(post => {
          console.log(`Post ID ${post.id} - Image URL:`, post.imageUrl);
        });
        
        setPosts(response);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please try again later.');
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDeletePost = async (postId, e) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await PostService.deletePost(postId);
      // Remove the deleted post from state
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete post. Please try again.');
    }
  };

  const handleLikePost = async (postId, e) => {
    e.stopPropagation(); // Prevent navigation when clicking like
    
    if (!currentUser) {
      alert('You must be logged in to like a post.');
      return;
    }
    
    if (likingPostId === postId) return;
    
    setLikingPostId(postId);
    try {
      await PostService.likePost(postId);
      // Update the post's like count in the UI
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likedCount: (post.likedCount || 0) + 1
          };
        }
        return post;
      }));
    } catch (err) {
      console.error('Error liking post:', err);
      alert('Failed to like the post. Please try again.');
    } finally {
      setLikingPostId(null);
    }
  };

  // Filter posts by search term only
  const filteredPosts = posts.filter(post => {
    return searchTerm === '' || 
      (post.title && post.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (post.description && post.description.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const handleCardClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  // Helper function to get image URL
  const getImageUrl = (post) => {
    console.log("Post image data:", post);
    
    // Check for imageUrls field (from PostResponseDTO)
    if (post.imageUrls && Array.isArray(post.imageUrls) && post.imageUrls.length > 0) {
      console.log("Using imageUrls field:", post.imageUrls[0]);
      return post.imageUrls[0];
    }
    
    // If imageUrl is a string (direct URL)
    if (post.imageUrl && typeof post.imageUrl === 'string') {
      console.log("Using string imageUrl:", post.imageUrl);
      return post.imageUrl;
    }
    
    // If imageUrl is an array of strings
    if (post.imageUrl && Array.isArray(post.imageUrl) && post.imageUrl.length > 0) {
      console.log("Using array imageUrl:", post.imageUrl[0]);
      return post.imageUrl[0];
    }
    
    // If imageUrl is a string containing JSON array
    if (post.imageUrl && typeof post.imageUrl === 'string' && post.imageUrl.startsWith('[')) {
      try {
        const parsedUrls = JSON.parse(post.imageUrl);
        if (Array.isArray(parsedUrls) && parsedUrls.length > 0) {
          console.log("Using parsed JSON imageUrl:", parsedUrls[0]);
          return parsedUrls[0];
        }
      } catch (e) {
        console.error('Error parsing imageUrl JSON:', e);
      }
    }
    
    // If imageUrl is in a nested structure
    if (post.imageUrl && typeof post.imageUrl === 'object' && post.imageUrl.url) {
      console.log("Using nested imageUrl.url:", post.imageUrl.url);
      return post.imageUrl.url;
    }
    
    // If there's a different property for images
    if (post.image) {
      console.log("Using post.image:", post.image);
      return post.image;
    }
    
    // No valid image found
    console.log("No valid image found for post:", post.id);
    return null;
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Community Posts</h1>
          <p className="text-xl opacity-90 max-w-3xl">
            Explore knowledge shared by our community members. Learn, share, and grow together.
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Controls Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white p-4 rounded-lg shadow">
          {/* Search */}
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* Create Post Button */}
          <button
            onClick={() => navigate('/create-post')}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg flex items-center transition-colors shadow-md w-full sm:w-auto justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create Post
          </button>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
            {searchTerm ? ` matching "${searchTerm}"` : ''}
          </p>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="bg-white shadow-lg rounded-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="mt-4 text-xl font-medium text-gray-600">No posts found</p>
            <p className="mt-2 text-gray-500">
              {searchTerm ? 'Try adjusting your search criteria' : 'Be the first to create a post!'}
            </p>
            <button
              onClick={() => navigate('/create-post')}
              className="mt-6 inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Create Post
            </button>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => {
              // Get image URL for this post
              const imageUrl = getImageUrl(post);
              console.log(`Rendering post ${post.id} with imageUrl:`, imageUrl);
              
              return (
                <div 
                  key={post.id} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                  onClick={() => handleCardClick(post.id)}
                >
                  {imageUrl ? (
                    <div className="h-52 overflow-hidden">
                      <img 
                        src={imageUrl} 
                        alt={post.title || 'Post image'} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.log(`Image error for post ${post.id}`);
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Available';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                  )}
                  
                  <div className="p-6">
                    {post.category && (
                      <div className="mb-3">
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                          {post.category.categoryName}
                        </span>
                      </div>
                    )}
                    
                    <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                      {post.title}
                    </h2>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.description}
                    </p>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 'Unknown date'}
                      </span>
                    </div>
                    
                    {post.user && (
                      <div className="flex items-center mb-4">
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold mr-2">
                          {post.user.username ? post.user.username.charAt(0).toUpperCase() : '?'}
                        </div>
                        <span className="text-sm text-gray-700">
                          {post.user.username || 'Unknown'}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={(e) => handleLikePost(post.id, e)}
                          disabled={likingPostId === post.id}
                          className={`flex items-center ${likingPostId === post.id ? 'opacity-70 cursor-not-allowed' : 'hover:text-blue-600'} ${post.likedCount > 0 ? 'text-blue-600' : 'text-gray-500'}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill={post.likedCount > 0 ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                          {post.likedCount ? `${post.likedCount}` : 'Like'}
                        </button>
                        <Link
                          to={`/post/${post.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Read More
                        </Link>
                      </div>
                      {currentUser && post.user && currentUser.id === post.user.id && (
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/edit-post/${post.id}`);
                            }}
                            className="text-gray-500 hover:text-blue-600 p-1"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => handleDeletePost(post.id, e)}
                            className="text-gray-500 hover:text-red-600 p-1"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* No posts found but there is a search term */}
        {filteredPosts.length === 0 && posts.length > 0 && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => {
                setSearchTerm('');
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear search and show all posts
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Posts; 