import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './Home';
import { AuthContextProvider } from './helpers/auth';
import { BrowserRouter, Route, Routes } from 'react-router';
import Navbar from './components/Navbar';
import StudentHome from './StudentHome';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <BrowserRouter>
        <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/studenthome" element={<StudentHome />} />
          </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  </React.StrictMode>
);