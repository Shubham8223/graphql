import { Route, Routes, Navigate } from "react-router-dom";
import React from "react";
import SignUpPage from './pages/SignUpPage.jsx'
import LoginPage from "./pages/LoginPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import TransactionPage from "./pages/transactionPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import { useQuery } from "@apollo/client";
import { GET_AUTHENTICATED_USER } from "./graphql/query_user.js";
import { Toaster } from 'react-hot-toast';


function App() {
  const { data, loading } = useQuery(GET_AUTHENTICATED_USER);
  
  if (loading) {
    return null;
  }

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={data?.authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!data?.authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!data?.authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route
          path="/transaction/:id"
          element={data?.authUser ? <TransactionPage /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
