"use client";
import { useContext, useEffect, useState } from "react";
import { context } from "@/context/context";
import axios from "axios";
import { showError, showSuccess } from "@/components/ui/sonner";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Settings() {
  const URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { isLoggedIn, user, setUser } = useContext(context);
  const [newUser, setNewUser] = useState({});
  const [imageBase64, setImageBase64] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.post(
          `${URL}/api/profile/getProfile`,
          { id: user?._id },
          { withCredentials: true }
        );
        setNewUser(res.data.user);
      } catch (err) {
        console.error(err);
        showError("Failed to load profile");
      }
    };
    fetchUser();
  }, [user]);

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setImageBase64(reader.result);
    if (file) reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      const res = await axios.post(
        `${URL}/api/profile/updateProfile`,
        {
          id: user._id,
          username: newUser.username,
          image: imageBase64 || newUser.profile,
          description: newUser.description,
        },
        { withCredentials: true }
      );
      showSuccess("Profile updated!");
      setUser(res.data.user);
      setNewUser(res.data.user);
      router.push(`/profile/${res.data.user.username}?id=${res.data.user._id}`);
    } catch (err) {
      console.error(err);
      showError("Update failed");
    }
  };

  return (
    <div className="bg-gray-800 min-h-screen p-6 text-white">

      <div className="bg-gray-900 p-6 rounded-xl shadow-lg max-w-lg mx-auto space-y-4">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6 flex justify-center">Settings</h1>

        <div className="flex items-center gap-4">
            <Avatar className={"w-24 h-24"}>
                    <AvatarImage
                      src={user?.profile || ""}
                      alt="User Avatar"
                    />
                    <AvatarFallback className="bg-green-600 text-white font-bold">
                      {user?.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
            </Avatar>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm text-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={newUser.username || ""}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Description</label>
          <textarea
            name="description"
            value={newUser.description || ""}
            onChange={handleInputChange}
            rows="3"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded-md font-bold"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
