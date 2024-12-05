import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const authToken = localStorage.getItem('auth');
    const navigate = useNavigate();
    let user = null;

    try {
        if (authToken) {
            user = jwtDecode(authToken);
        }
    } catch (error) {
        console.error('Invalid token:', error);
        user = null;
    }

    const [profilePicture, setProfilePicture] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const handleLogout = () => {
        localStorage.removeItem('auth');
        navigate('/login');
    };

    return (
        <nav className="text-orange-500 py-4 px-6 flex items-center justify-between">
            {/* Brand */}
            <div className="text-2xl font-bold">
                <Link to="/">Fakeddit</Link>
            </div>

            {/* Profile Section */}
            <div className="relative">
                <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
                >
                    <img
                        src={profilePicture || 'https://via.placeholder.com/40'}
                        alt="Profile Icon"
                        className="h-8 w-8 rounded-full"
                    />
                    <span className="hidden md:block">{user?.username || 'Profile'}</span>
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg py-2 w-48">
                        <Link
                            to="/settings"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                            Settings
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
