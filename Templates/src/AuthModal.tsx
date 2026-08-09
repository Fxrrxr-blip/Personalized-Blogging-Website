// Example inside your AuthModal component
import React, { useState } from "react";
import { authRequest } from "./api";

export function AuthModal() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Determine target endpoint and payload
    const endpoint = isSignUp ? "/api/auth/register" : "/api/auth/login";
    const payload = isSignUp 
      ? { email, password, full_name: name } 
      : { email, password };

    try {
      const data = await authRequest(endpoint, payload);
      
      // Store returned JWT token or user info
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
      }
      
      alert(isSignUp ? "Account registered!" : "Logged in successfully!");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{isSignUp ? "Register" : "Log In"}</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {isSignUp && (
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">{isSignUp ? "Sign Up" : "Log In"}</button>

      <p onClick={() => setIsSignUp(!isSignUp)} style={{ cursor: "pointer" }}>
        {isSignUp ? "Already have an account? Log In" : "Need an account? Sign Up"}
      </p>
    </form>
  );
}