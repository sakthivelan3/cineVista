import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { TextField, Button, Typography, Box } from "@mui/material";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Styles/SignUp.css';

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error) {
      let errorMessage = "An error occurred. Please try again later.";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Email already in use. Please use a different email or sign in.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address. Please enter a valid email address.";
          break;
        case "auth/weak-password":
          errorMessage = "Password is too weak. Please use a stronger password.";
          break;
        default:
          errorMessage = "An error occurred. Please try again later.";
          break;
      }
      toast.error(errorMessage);
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      toast.success("Account created successfully with Google!");
      navigate("/");
    } catch (error) {
      toast.error("Google sign-up failed. Please try again.");
    }
  };

  return (
    <div className="SignUp">
  <Box className="SignUpBox">
    <Typography variant="h5" className="SignUpTitle" gutterBottom>
      Sign Up
    </Typography>
    <Typography variant="body1" gutterBottom className="welcometxt">
      Welcome to our movie library! Create an account to get started.
    </Typography>
    <TextField
      type="email"
      label="Email"
      variant="outlined"
      fullWidth
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="SignUpInput"
      margin="normal"
      required
    />
    <TextField
      type="text"
      label="Nickname"
      variant="outlined"
      fullWidth
      value={nickname}
      onChange={(e) => setNickname(e.target.value)}
      className="SignUpInput"
      margin="normal"
      
    />
    <TextField
      type="password"
      label="Password"
      variant="outlined"
      fullWidth
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="SignUpInput"
      margin="normal"
      required
    />
    <TextField
      type="password"
      label="Confirm Password"
      variant="outlined"
      fullWidth
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      className="SignUpInput"
      margin="normal"
      required
    />
    <div className="SignUpButtonContainer">
      <Button variant="contained" color="primary" onClick={handleSignUp} className="SignUpButton">
        Sign Up
      </Button>
      <div style={{ marginRight: '1px' }} /> {/* Add spacing */}
      <Button variant="contained" color="secondary" onClick={handleGoogleSignUp} className="SignUpButton">
        Sign Up with Google
      </Button>
    </div>
    <Typography variant="body2" className="SignUpLink" mt={2}>
      Already have an account? <Link to="/signin">Sign In</Link>
    </Typography>
  </Box>
</div>

  );
};

export default SignUp;
