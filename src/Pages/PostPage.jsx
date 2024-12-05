import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { backendApiUrlBase } from '../constants';

const PostPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [user, setUser] = useState(null); 
    
    const authToken = localStorage.getItem('auth');
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`${backendApiUrlBase}/api/Post/post/${id}`, {
                    withCredentials: false,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authToken}`
                    },
                });
                setPost(response.data);
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };

       
        const fetchUser = async (userId) => {
            try {
                const response = await axios.get(`${backendApiUrlBase}/api/Users/${userId}`);
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        if (id) {
            fetchPost();
        }

        if (post?.UserId) {
            fetchUser(post.UserId);
        }
    }, [id, post?.UserId]); 

  
    const handleLikePost = async () => {
        try {
            await axios.post(`${backendApiUrlBase}/api/Post/${id}/like`);
            setPost({ ...post, Likes: post.Likes + 1 });
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleDislikePost = async () => {
        try {
            await axios.post(`${backendApiUrlBase}/api/Post/${id}/dislike`);
            setPost({ ...post, Dislikes: post.Dislikes + 1 });
        } catch (error) {
            console.error('Error disliking post:', error);
        }
    };


    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % (post?.Pictures?.length || 1));
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + (post?.Pictures?.length || 1)) % (post?.Pictures?.length || 1));
    };

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">{post.title || 'Untitled Post'}</h1>

            
            {user && (
                <div className="mb-4">
                    <p className="text-lg">Posted by: <Link to={`/user/${user.id}`} className="text-blue-500">{user.name}</Link></p>
                </div>
            )}

           
            <p className="text-lg text-gray-700 mb-6">{post.description || 'No description available.'}</p>

      
            {post.pictures && post.pictures.length > 0 && (
                <div className="relative mb-6">
                    <img
                        src={`data:image/png;base64,${post.pictures[currentIndex]}`}
                        alt={`Post ${post.title} - Picture ${currentIndex + 1}`}
                        className="w-full h-96 object-contain rounded-lg shadow-lg mx-auto"
                    />
                    <button
                        onClick={handlePrev}
                        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 shadow-lg"
                    >
                        &lt;
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 shadow-lg"
                    >
                        &gt;
                    </button>
                </div>
            )}

            
            <div className="flex gap-4 items-center mb-6">
                <button onClick={handleLikePost} className="text-green-500 font-medium">Like</button>
                <span className="text-green-500 font-medium">Likes: {post.likes}</span>
                <button onClick={handleDislikePost} className="text-red-500 font-medium">Dislike</button>
                <span className="text-red-500 font-medium">Dislikes: {post.dislikes}</span>
            </div>

          
            <div className="comments-section">
                
            </div>
        </div>
    );
};

export default PostPage;
