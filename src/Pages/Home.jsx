import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { backendApiUrlBase } from '../constants';



const Home = () => {
  const [posts, setPosts] = useState([]);
  const authToken = localStorage.getItem('auth');
  const navigate = useNavigate();

  if (authToken === null) {
    navigate('/login')
  }

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${backendApiUrlBase}/api/Post/posts`, { withCredentials: false, headers: { "Authorization": `Bearer ${authToken}` }}, );
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">Trending Posts</h1>
      <ul className="space-y-8">
        {posts.map((post) => (
          <li
            key={post.id}
            className="bg-white shadow-lg rounded-lg p-6 flex flex-col gap-6"
          >

            <Link
              to={`/post/${post.id}`}
              className="text-2xl font-semibold text-blue-500 hover:underline"
            >
              {post.title || 'Untitled Post'}
            </Link>


            <p className="text-gray-800 text-lg">{post.description || 'No description available.'}</p>

            {post.pictures && post.pictures.length > 0 && (
              <ImageCarousel pictures={post.pictures} title={post.title} />
            )}

            <div className="flex gap-6 items-center">
              <span className="text-green-600 font-bold text-lg">👍 Likes: {post.likes}</span>
              <span className="text-red-600 font-bold text-lg">👎 Dislikes: {post.dislikes}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ImageCarousel = ({ pictures, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % pictures.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + pictures.length) % pictures.length);
  };

  return (
    <div className="relative w-full">
      <div className="w-full h-96 relative overflow-hidden rounded-lg shadow-lg">
        <img
          src={`data:image/png;base64,${pictures[currentIndex]}`}
          alt={`Post ${title} - Picture ${currentIndex + 1}`}
          className="w-full h-full object-contain"
        />
      </div>

      <button
        onClick={handlePrev}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-3 shadow-lg hover:bg-gray-700"
      >
        &lt;
      </button>
      <button
        onClick={handleNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-3 shadow-lg hover:bg-gray-700"
      >
        &gt;
      </button>
    </div>
  );
};

export default Home;
