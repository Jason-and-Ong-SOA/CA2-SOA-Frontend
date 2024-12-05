import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendApiUrlBase } from "../constants";
import { jwtDecode } from "jwt-decode";

const SettingsPage = () => {
    const [username, setUsername] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [userPosts, setUserPosts] = useState([]);
    const [authToken, setAuthToken] = useState(localStorage.getItem("auth"));

    const userId = authToken ? jwtDecode(authToken).UserId : null;

    useEffect(() => {
        if (!authToken || !userId) {
            window.location.href = "/login";
        } else {
            fetchUserData();
            fetchUserPosts();
        }
    }, [authToken]);

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${backendApiUrlBase}/api/Users/${userId}`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            const userData = response.data;
            setUsername(userData.username);
            setProfilePicture(userData.profilePicture || "");
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const fetchUserPosts = async () => {
        try {
            const response = await axios.get(`${backendApiUrlBase}/api/Post`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setUserPosts(response.data);
        } catch (error) {
            console.error("Error fetching user posts:", error);
        }
    };

    const handleProfilePictureUpload = async (event) => {
        const file = event.target.files[0];
        const base64 = await convertToBase64(file);

        try {
            await axios.post(
                `${backendApiUrlBase}/api/Users/${userId}/profile-picture`,
                base64,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );
            setProfilePicture(base64);
            alert("Profile picture updated successfully!");
        } catch (error) {
            console.error("Error uploading profile picture:", error);
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };



    const handleDeletePost = async (postId) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                await axios.delete(`${backendApiUrlBase}/api/Post/${postId}`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                alert("Post deleted successfully!");
                window.location.reload(); // Refresh the page after deletion
            } catch (error) {
                console.error("Error deleting post:", error);
            }
        }
    };


    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray-100 rounded shadow-md">
            <h1 className="text-2xl font-bold mb-4">Account</h1>

            <div className="mb-4">
                <label className="block font-medium text-gray-700 mb-2">Profile Picture</label>
                {profilePicture && (
                    <img src={profilePicture} alt="Profile" className="h-32 w-32 rounded-full mb-4" />
                )}
                <input type="file" onChange={handleProfilePictureUpload} />
            </div>

            <div className="mb-4">
                <label className="block font-medium text-gray-700 mb-2">Username</label>
                <h2
                    type="text"
                    value={username}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    {username}
                </h2>
            </div>

            <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">Your Posts</h2>
                <ul>
                    {userPosts.map((post) => (
                        <li key={post.id} className="bg-white shadow-md rounded p-4 mb-4">
                            <h3 className="font-semibold">{post.title}</h3>
                            <p>{post.description}</p>
                            {post.pictures && post.pictures.length > 0 && (
                                <img
                                    src={post.pictures[0]}
                                    alt={post.title}
                                    className="mt-2 w-full rounded"
                                />
                            )}
                            <button
                                onClick={() => handleDeletePost(post.id)}
                                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Delete Post
                            </button>
                        </li>
                    ))}
                </ul>

            </div>
        </div>
    );
};

export default SettingsPage;


