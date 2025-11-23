import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import AdminPage from './components/AdminPage';

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/orbadmin-ai" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
