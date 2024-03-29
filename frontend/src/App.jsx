import { Route, Routes } from "react-router-dom";
import React from "react";
import SignUpPage from './pages/SignUpPage.jsx'
import LoginPage from "./pages/LoginPage.jsx";

function App() {
	return (
		<>
			<Routes>
				<Route path='/login' element={<LoginPage />} />
				<Route path='/signup' element={<SignUpPage />} />
			</Routes>
		</>
	);
}
export default App;