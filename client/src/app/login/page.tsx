"use client";
import React, { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Placeholder: call backend auth API
    try {
      // Example: POST /api/auth/login
      console.log("login", { email, password });
      alert("Logged in (demo)");
    } catch (err) {
      setError("Failed to login");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-zinc-50 to-zinc-100 dark:from-black dark:via-zinc-900 dark:to-zinc-950">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md dark:bg-zinc-900">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Sign in to WaaS</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Enter your credentials to continue.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm text-zinc-700 dark:text-zinc-300">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-1 w-full rounded-md border border-zinc-200 px-3 py-2 bg-white text-sm" />
          </div>

          <div>
            <label className="block text-sm text-zinc-700 dark:text-zinc-300">Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="mt-1 w-full rounded-md border border-zinc-200 px-3 py-2 bg-white text-sm" />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <button type="submit" className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Sign in</button>
        </form>

        <div className="mt-4 text-sm text-zinc-600">Don't have an account? <a href="/register" className="text-indigo-600">Create one</a></div>
      </div>
    </div>
  );
}
