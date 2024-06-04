import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./component/SignIn";
import SignUp from "./component/SignUp";
import PrivateRoute from "./component/PrivateRoute";
import { auth } from "./firebase"; // Assuming this imports your Firebase configuration
import { onAuthStateChanged } from "firebase/auth"; // Importing onAuthStateChanged correctly
import Home from "./Home";
import "./Styles/App.css";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false); // Set loading to false once authentication state is checked
    });

    // Clean up the subscription
    return () => unsubscribe();
  }, []);

  // Show loading spinner or message while checking authentication state
  if (loading) {
    return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
    </div>)
  }

  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/"
          element={currentUser ? <PrivateRoute /> : <SignIn />} // Render PrivateRoute if user is logged in, otherwise render SignIn
        >
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
