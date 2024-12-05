import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { backendApiUrlBase } from "../constants";

const AddPostPage = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [pictures, setPictures] = useState([]);

    const authToken = localStorage.getItem('auth');
    const navigate = useNavigate();

    console.log(authToken)

    if (!authToken) {
        navigate('/login');
    }

    const user = jwtDecode(authToken);

    const handlePictureUpload = async (event) => {
        const files = event.target.files;
        const base64Pictures = [];

        for (const file of files) {
            const base64 = await convertToBase64(file);
            base64Pictures.push(base64);
        }

        setPictures(base64Pictures);
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const postData = {
            title,
            description,
            pictures,
        };

        try {
            const response = await axios.post(
                `${backendApiUrlBase}/api/Post`,
                postData,
                {
                    withCredentials: false,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authToken}`
                    },
                }
            );

            if (response.status === 200) {
                alert("Post created successfully!");
                setTitle("");
                setDescription("");
                setPictures([]);
            }
        } catch (error) {
            console.error("Error submitting post:", error);
            alert(`Failed to create post: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-gray-100 rounded shadow-md">
            <h1 className="text-2xl font-bold mb-4">Create a New Post</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows="4"
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    ></textarea>
                </div>
                <div>
                    <label className="block text-gray-700 font-medium">
                        Upload Pictures
                    </label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePictureUpload}
                        className="block w-full text-gray-700 border rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    Create Post
                </button>
            </form>
        </div>
    );
};

export default AddPostPage;
