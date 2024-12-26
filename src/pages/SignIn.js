import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getUsers } from "../api"; 
const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); 
  const navigate = useNavigate();

  
  const getFreshToken = async () => {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken(true); // 'true' forces token refresh
    }
    throw new Error("No authenticated user found");
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const loggedInUser = userCredential.user;

      const idToken = await getFreshToken();
      localStorage.setItem(
        "user",
        JSON.stringify({
          token: idToken, 
        })
      );
      const users = await getUsers();
      
      const currentUser = users.find((user) => user.email === loggedInUser.email);

      if (currentUser) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            token: idToken, 
            email: loggedInUser?.email,
            role: currentUser.role,
            id: currentUser.id,
            name:currentUser.name
          })
        );

        if (currentUser.mustChangePassword) {
          navigate("/change-password"); 
        } else {
          navigate("/dashboard"); 
        }
      } else {
        alert("User record not found!");
      }
    } catch (error) {
      console.log(error);
      alert("Error signing in: " + error.message);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/signup", {
        email,
        isAdmin,
        password
      });

      alert("Signup successful! You can now log in.");
      setIsSignup(false); 
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h1>{isSignup ? "Sign Up" : "Sign In"}</h1>
      <form onSubmit={isSignup ? handleSignUp : handleSignIn}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            display: "block",
            margin: "10px 0",
            padding: "10px",
            width: "100%",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            display: "block",
            margin: "10px 0",
            padding: "10px",
            width: "100%",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
          required
        />
        {isSignup && (
          <div>
            <label>
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />{" "}
              Make Admin (Super Admin only)
            </label>
          </div>
        )}
        <button
          type="submit"
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          {isSignup ? "Sign Up" : "Sign In"}
        </button>
      </form>
      {/*<p style={{ textAlign: "center", marginTop: "10px" }}>
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <span
          onClick={() => setIsSignup(!isSignup)}
          style={{ color: "#007bff", cursor: "pointer" }}
        >
          {isSignup ? "Sign In" : "Sign Up"}
        </span>
      </p> */}
    </div>
  );
};

export default SignIn;
