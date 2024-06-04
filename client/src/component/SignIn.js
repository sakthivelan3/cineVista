import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { TextField, Button, Typography, Box } from "@mui/material";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Styles/SignIn.css';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      switch (error.code) {
        case "auth/user-not-found":
          toast.error("Account does not exist. Please sign up.");
          break;
        case "auth/invalid-credential":
          toast.error("Check your credentials");
          break;
        case "auth/wrong-password":
          toast.error("Incorrect password. Please try again.");
          break;
        case "auth/invalid-email":
          toast.error("Invalid email address.");
          break;
        default:
          toast.error("An error occurred. Please try again later.");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // Access user info from 'result.user' if needed
      navigate("/");
    } catch (error) {
      switch (error.code) {
        case "auth/popup-closed-by-user":
        case "auth/cancelled-popup-request":
          toast.error("Google sign-in was cancelled.");
          break;
        default:
          toast.error("Google sign-in failed. Please try again.");
      }
    }
  };

  return (
    <div className="SignIn">
      <Box className="SignInBox">
        <Typography variant="h5" className="SignInTitle" gutterBottom>
          Welcome Back!
        </Typography>
        <TextField
          type="email"
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="SignInInput"
          margin="normal"
          required
        />
        <TextField
          type="password"
          label="Password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="SignInInput"
          margin="normal"
          required
        />
        <div className="SignInButtonContainer">
          <Button variant="contained" color="primary" className="SignInButton" onClick={handleSignIn}>
            Sign In
          </Button>
          <Button variant="contained" color="secondary" className="SignInButton" onClick={handleGoogleSignIn}>
            Sign In with Google
          </Button>
        </div>
        <div style={{ marginTop: '8px' }} />
        <Typography variant="body2" className="SignInLink">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </Typography>
      </Box>
    </div>
  );
};

export default SignIn;
