import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import { RegisterPage } from './Auth/RegisterPage';
import { LoginPage } from './Auth/LoginPage';
import Home from './Pages/Home';
import PostPage from './Pages/PostPage'; // Import PostPage

const router = createHashRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "register",
    element: <RegisterPage />
  },
  {
    path: "login",
    element: <LoginPage />
  },
  {
    path: "post/:id",
    element: <PostPage />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
