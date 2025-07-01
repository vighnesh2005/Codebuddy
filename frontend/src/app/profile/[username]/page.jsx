"use client"
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";

export default function Profile() {
  const id = useSearchParams().get("id");
  const [user, setUser] = useState({});
  const URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await axios.post(`${URL}/api/profile/getprofile`, { id }, { withCredentials: true });
        if (res.status === 200) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    getProfile();
  }, []);

  const ratingData = user?.ratingHistory?.map((rating, index) => ({
    name: `#${index + 1}`,
    rating,
  })) || [];

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">

      <div className="bg-gray-800 p-6 rounded-xl shadow-md max-w-8xl mx-auto">
        {/* User Info */}
        <div className="flex items-center gap-6 mb-6">
          <Avatar className={"h-16 w-16"}>
                    <AvatarImage
                      src={user?.profile || "/file.svg"}
                      alt="User Avatar"
                    />
                    <AvatarFallback className="bg-green-600 text-white font-bold">
                      {user?.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
        </Avatar>
          <div>
            <h2 className="text-2xl font-semibold">{user?.username}</h2>
            <p className="text-gray-400">{user?.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-gray-300">
          <div><span className="font-bold text-white">Rank:</span> {user?.rank}</div>
          <div><span className="font-bold text-white">Rating:</span> {user?.rating}</div>
          <div><span className="font-bold text-white">Easy:</span> {user?.easy}</div>
          <div><span className="font-bold text-white">Medium:</span> {user?.medium}</div>
          <div><span className="font-bold text-white">Hard:</span> {user?.hard}</div>
          <div><span className="font-bold text-white">Contests:</span> {user?.contestsParticipated}</div>
        </div>

        {/* Description */}
        <p className="mt-4 text-sm text-gray-400 italic">
          {user?.description || "No description added yet."}
        </p>

        {/* Rating Graph */}
        {ratingData.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-yellow-400">Rating History</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={ratingData}>
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis domain={['dataMin - 100', 'dataMax + 100']} stroke="#ccc" />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", color: "#fff" }} />
                <Line type="monotone" dataKey="rating" stroke="#facc15" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
