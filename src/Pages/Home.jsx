import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { backendApiUrlBase } from '../constants';
import Navbar from '../Components/Navbar';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('A-Z'); // Default sorting order
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem('auth');

    if (!authToken) {
      console.log("No auth token found, redirecting to login.");
      navigate('/login');
      return;
    }

    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${backendApiUrlBase}/api/Post`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setPosts(response.data);
        setFilteredPosts(response.data); // Initialize filtered posts
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [navigate]);

  useEffect(() => {
    const filtered = posts
      .filter((post) =>
        post.title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (sortOrder === 'A-Z') {
          return a.title.localeCompare(b.title);
        }
        if (sortOrder === 'Z-A') {
          return b.title.localeCompare(a.title);
        }
        if ( sortOrder == 'New'){
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return 0;
      });

          setFilteredPosts(filtered);
  }, [searchQuery, sortOrder, posts]);

  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">Trending Posts</h1>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search posts..."
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Sort Dropdown */}
        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="A-Z">Sort A-Z</option>
          <option value="Z-A">Sort Z-A</option>
          <option value="New">New</option>
        </select>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white shadow-md hover:shadow-lg rounded-lg overflow-hidden transition-shadow duration-300"
          >
            <Link to={`/post/${post.id}`}>
              {post.pictures && post.pictures.length > 0 ? (
                <img
                  src={post.pictures[0]}
                  alt={post.title || 'Untitled Post'}
                  className="w-full h-56 object-cover"
                />
              ) : (
                <div className="w-full h-56 bg-gray-300 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </Link>

            <div className="p-4 flex flex-col gap-4">
              <Link
                to={`/post/${post.id}`}
                className="text-lg font-bold text-blue-600 hover:underline"
              >
                {post.title || 'Untitled Post'}
              </Link>
              <p className="text-gray-600 text-sm">
                {post.description || 'No description available.'}
              </p>
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-green-600">👍 Likes: {post.likes == null ? 0 : post.likes.length}</span>
                <span className="text-red-600">👎 Dislikes: {post.dislikes == null ? 0 :post.likes.length}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating "Create Post" Button */}
      <Link
        to="/create-post"
        className="fixed bottom-8 right-8 bg-blue-600 text-white text-4xl rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-blue-500 transition-colors duration-300"
      >
        +
      </Link>
    </div>
  );
};

export default Home;
