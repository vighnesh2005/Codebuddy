"use client";

import Link from "next/link";
import { useState } from "react";
import Toaster from "@/components/ui/sonner.jsx";
import axios from "axios"; 
import { showSuccess, showError } from "@/components/ui/sonner.jsx";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const Router = useRouter();
  const URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();

      try{
        const res = await axios.post(`${URL}/api/auth/signup`,{
          username:name,
          email,
          password
        },{
          withCredentials:true
        });

        if(res.status === 201){
          showSuccess("User created successfully");
          Router.push("/");
        }
      }
      catch(error){
        console.error(error);
        showError("User already exists")
      }
  };

  return (
    <>
    <Toaster></Toaster>
    <div className="min-h-screen bg-gray-800 flex items-center justify-center px-4">
      <div className="bg-gray-900 text-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <h2 className="text-3xl font-semibold text-center mb-6">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>  
    </>
  );
}
