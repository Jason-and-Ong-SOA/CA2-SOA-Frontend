import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { RegisterPage } from './Auth/RegisterPage';
import { LoginPage } from './Auth/LoginPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <h1>Initial</h1>
  },

  {
    path: "register",
    element: <RegisterPage />
  },

  {
    path: "login",
    element: <LoginPage />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

