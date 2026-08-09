import React, { useState } from "react";
import { authRequest } from "./api";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isSignUp ? "/api/auth/register" : "/api/auth/login";
    const payload = isSignUp
      ? { email, password, full_name: name }
      : { email, password };

    try {
      const data = await authRequest(endpoint, payload);

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-[#f4f1ea] p-8 shadow-xl border border-stone-300">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-stone-500 hover:text-stone-800 transition"
        >
          ✕
        </button>

        <h2 className="mb-6 text-2xl font-serif font-bold text-stone-900">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h2>

        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Username
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-stone-300 bg-stone-50 p-3 text-stone-900 focus:border-stone-500 focus:outline-none"
                placeholder="Enter your username"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-stone-300 bg-stone-50 p-3 text-stone-900 focus:border-stone-500 focus:outline-none"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-stone-300 bg-stone-50 p-3 text-stone-900 focus:border-stone-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-stone-800 py-3 font-semibold text-white transition hover:bg-stone-700 disabled:opacity-50"
          >
            {loading
              ? "Connecting..."
              : isSignUp
              ? "Register"
              : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-stone-600">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
            className="font-semibold text-stone-900 underline hover:text-stone-700"
          >
            {isSignUp ? "Sign In" : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
}