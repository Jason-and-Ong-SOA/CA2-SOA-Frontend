import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { backendApiUrlBase } from '../constants';
import { jwtDecode } from 'jwt-decode';

const PostPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [user, setUser] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [authToken] = useState(localStorage.getItem('auth'));
    const [currentUserId] = useState(authToken ? jwtDecode(authToken).UserId : null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`${backendApiUrlBase}/api/Post/${id}`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                setPost(response.data);
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };

        const fetchComments = async () => {
            try {
                const response = await axios.get(`${backendApiUrlBase}/api/Post/${id}/Comment`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                setComments(response.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        const fetchReplies = async () => {
            try {
                const response = await axios.get(`${backendApiUrlBase}/api/Post/${id}/Comment`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                setComments(response.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        }
        
        fetchPost();
        fetchComments();
    }, [id, authToken]);


    const handleLikePost = async () => {
        try {
            await axios.post(`${backendApiUrlBase}/api/Post/${id}/like`);
            setPost((prevPost) => ({ ...prevPost, likes: prevPost.likes + 1 }));
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleDislikePost = async () => {
        try {
            await axios.post(`${backendApiUrlBase}/api/Post/${id}/dislike`);
            setPost((prevPost) => ({ ...prevPost, dislikes: prevPost.dislikes + 1 }));
        } catch (error) {
            console.error('Error disliking post:', error);
        }
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % (post?.pictures?.length || 1));
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + (post?.pictures?.length || 1)) % (post?.pictures?.length || 1));
    };


    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            const response = await axios.post(
                `${backendApiUrlBase}/api/Post/${id}/Comment`,
                { content: newComment, ownerId: currentUserId },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            setComments([...comments, response.data]);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                await axios.delete(`${backendApiUrlBase}/api/Post/${id}/Comment/${commentId}`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                setComments(comments.filter((comment) => comment.id !== commentId));
            } catch (error) {
                console.error('Error deleting comment:', error);
            }
        }
    };

    const handleEditComment = async (commentId, newContent) => {
        try {
            const response = await axios.put(
                `${backendApiUrlBase}/api/Post/${id}/Comment/${commentId}`,
                { content: newContent },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            setComments(
                comments.map((comment) =>
                    comment.id === commentId ? { ...comment, content: response.data.content } : comment
                )
            );
        } catch (error) {
            console.error('Error editing comment:', error);
        }
    };

    const handleAddReply = async (commentId, replyContent) => {
        if (!replyContent.trim()) return;

        try {
            const response = await axios.post(
                `${backendApiUrlBase}/api/Post/${id}/Comment/${commentId}/Reply`,
                { content: replyContent, ownerId: currentUserId },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            setComments(
                comments.map((comment) =>
                    comment.id === commentId
                        ? { ...comment, replies: [...(comment.replies || []), response.data] }
                        : comment
                )
            );
        } catch (error) {
            console.error('Error adding reply:', error);
        }
    };

    const handleDeleteReply = async (commentId, replyId) => {
        if (window.confirm('Are you sure you want to delete this reply?')) {
            try {
                await axios.delete(
                    `${backendApiUrlBase}/api/Post/${id}/Comment/${commentId}/Reply/${replyId}`,
                    { headers: { Authorization: `Bearer ${authToken}` } }
                );
                setComments(
                    comments.map((comment) =>
                        comment.id === commentId
                            ? { ...comment, replies: comment.replies.filter((reply) => reply.id !== replyId) }
                            : comment
                    )
                );
            } catch (error) {
                console.error('Error deleting reply:', error);
            }
        }
    };

    const handleEditReply = async (commentId, replyId, newContent) => {
        try {
            const response = await axios.put(
                `${backendApiUrlBase}/api/Post/${id}/Comment/${commentId}/Reply/${replyId}`,
                { content: newContent },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            setComments(
                comments.map((comment) =>
                    comment.id === commentId
                        ? {
                              ...comment,
                              replies: comment.replies.map((reply) =>
                                  reply.id === replyId ? { ...reply, content: response.data.content } : reply
                              ),
                          }
                        : comment
                )
            );
        } catch (error) {
            console.error('Error editing reply:', error);
        }
    };

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col items-center text-center">
                <h1 className="text-4xl font-bold mb-2">{post.title || 'Untitled Post'}</h1>
                {user && (
                    <div className="flex items-center gap-4 mb-4">
                        {user.profilePicture ? (
                            <img
                                src={user.profilePicture}
                                alt={user.username}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">
                                No Image
                            </div>
                        )}
                        <p className="text-lg text-gray-700">
                            Posted by: <Link to={`/user/${user.id}`} className="text-blue-500 hover:underline">{user.username}</Link>
                        </p>
                    </div>
                )}
                <p className="text-lg text-gray-600 mb-6">{post.description || 'No description available.'}</p>
            </div>



            {post.pictures && post.pictures.length > 0 && (
                <div className="relative w-full max-w-3xl mx-auto mb-6">
                    <img
                        src={`${post.pictures[currentIndex]}`}
                        alt={`Post ${post.title} - Picture ${currentIndex + 1}`}
                        className="w-full h-96 object-contain rounded-lg shadow-lg"
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



            <div className="flex gap-4 items-center justify-center mb-6">
                <button
                    onClick={handleLikePost}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                    Like
                </button>
                <span className="text-green-600 font-bold">Likes: {post.likes}</span>
                <button
                    onClick={handleDislikePost}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                    Dislike
                </button>
                <span className="text-red-600 font-bold">Dislikes: {post.dislikes}</span>
            </div>

            <div className="comments-section mt-6">
                <h2 className="text-2xl mb-4">Comments</h2>
                <div className="mb-4">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full border p-2 rounded"
                        placeholder="Add a comment..."
                    />
                    <button
                        onClick={handleAddComment}
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Post Comment
                    </button>
                </div>
                <ul>
    {comments.map((comment) => (
        <li key={comment.id} className="mb-4 border p-4 rounded">
            <p>{comment.content}</p>
            <div className="text-sm text-gray-500">
                {comment.ownerId === currentUserId ? 'You' : 'Someone'} at {comment.createdAt}
            </div>
            {comment.ownerId === currentUserId && (
                <div className="mt-2">
                    <button
                        onClick={() =>
                            handleEditComment(comment.id, prompt('Edit your comment:', comment.content))
                        }
                        className="mr-2 text-blue-500"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-500"
                    >
                        Delete
                    </button>
                </div>
            )}

            {/* Replies Section */}
            <div className="mt-4 ml-4 border-l pl-4">
                <h4 className="text-lg font-semibold">Replies</h4>
                <ul>
                    {comment.replies?.map((reply) => (
                        <li key={reply.id} className="mt-2">
                            <p>{reply.content}</p>
                            <div className="text-sm text-gray-500">
                                {reply.ownerId === currentUserId ? 'You' : 'Someone'} at {reply.createdAt}
                            </div>
                            {reply.ownerId === currentUserId && (
                                <div>
                                    <button
                                        onClick={() =>
                                            handleEditReply(comment.id, reply.id, prompt('Edit your reply:', reply.content))
                                        }
                                        className="mr-2 text-blue-500"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteReply(comment.id, reply.id)}
                                        className="text-red-500"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>

                {/* Add a Reply */}
                <textarea
                    placeholder="Reply to this comment..."
                    className="w-full border p-2 rounded mt-2"
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                    onClick={() => handleAddReply(comment.id, newComment)}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Post Reply
                </button>
            </div>
        </li>
    ))}
</ul>
            </div>
        </div>
    );
};

export default PostPage;
