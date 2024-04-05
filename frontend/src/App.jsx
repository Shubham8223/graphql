import { Route, Routes } from "react-router-dom";
import React from "react";
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from "./pages/LoginPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import TransactionPage from "./pages/transactionPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/transaction/:id" element={<TransactionPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
