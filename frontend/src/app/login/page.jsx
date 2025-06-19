"use client";
import Link from "next/link";
import { useContext, useState } from "react";
import axios from "axios"; 
import { showSuccess, showError } from "@/components/ui/sonner.jsx";
import { useRouter } from "next/navigation";
import { context } from "@/context/context.js"

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const Router = useRouter();
  const {login} = useContext(context);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const res = await axios.post(`${URL}/api/auth/Login`,{
        email,
        password
      },
      {
        withCredentials: true,
      });
      if(res.status === 200){
        showSuccess("Login successful!");
        login(res.data.user);
        Router.push("/");
      }
      if(res.status === 500){
        showError("Unable to Login");
      }
    }catch (error) {
      console.error("Login failed:", error);
        showError("Invalid Credentials");
      return;
    }
  };

  return (
    <>
    <div className="min-h-screen bg-gray-800 flex items-center justify-center px-4">
      <div className="bg-gray-900 text-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <h2 className="text-3xl font-semibold text-center mb-6">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-lg font-medium"
          >
            Log In
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-400">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
    </>
  );
}
