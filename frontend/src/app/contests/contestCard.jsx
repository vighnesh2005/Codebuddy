"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ContestCard({ contest }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isLive: false,
  });

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const start = new Date(contest.start_time).getTime();
      const end = new Date(contest.end_time).getTime();

      if (now >= end) {
        setTimeLeft(prev => ({ ...prev, isLive: false }));
        return;
      }

      if (now >= start) {
        setTimeLeft(prev => ({ ...prev, isLive: true }));
        location.reload();
        return;
      }

      const diff = start - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isLive: false });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [contest]);

  return (
    <Link
      href={`/contests/${contest._id}`}
      className="bg-white p-5 text-black rounded-lg m-5
        hover:bg-gray-200 hover:text-black
        flex-1 min-w-[250px] max-w-full"
    >
      <div className="text-xl font-semibold">{contest.name}</div>
      <div className="text-sm text-green-600 mt-2">
        {timeLeft.isLive
          ? "🔴 Live Now"
          : `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`}
      </div>
    </Link>
  );
}
