"use client";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("opacity-0", "translate-y-4");
            entry.target.classList.add("opacity-100", "translate-y-0");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-gray-800 min-h-screen p-10">
      <div
        className="fade-in bg-gray-900 rounded-lg p-10 flex flex-col md:flex-row justify-between items-center gap-8
          opacity-0 translate-y-4 transition-opacity duration-1000
          hover:-translate-y-2 hover:transition-transform hover:duration-500 hover:delay-100"
      >
        {/* Left Text Block */}
        <div className="h-full flex flex-col items-start justify-between max-w-xl gap-24">
          <div>
          <h1 className="fade-in text-zinc-50 text-5xl font-bold opacity-0 translate-y-4 transition-all duration-1000">
            Welcome to <strong className="text-yellow-500">CodeBuddy</strong>
          </h1>
          <p className="fade-in text-zinc-50 text-2xl my-6 opacity-0 translate-y-4 transition-all duration-1000">
            The only place you need to learn <strong>DSA</strong> and <strong>compete</strong>.
          </p>
          </div>
          <Link
            href="/problems"
            className="fade-in opacity-0 translate-y-4 bg-black p-3 rounded-xl font-bold text-amber-50 
                      hover:bg-yellow-500 border-2 transition-all duration-1000"
          >
            Explore
          </Link>
        </div>

        {/* Right Image */}
        <div className="fade-in opacity-0 translate-y-4 transition-all duration-1000 max-w-xl w-full max-lg:hidden">
          <img
            className="w-full h-auto rounded-lg shadow-lg object-cover"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDdIbEtUgjUUBq9Pqgswv3NUzi_V7pY7QU8A&s"
            alt="Hero"
          />
        </div>
      </div>
    </div>
  );
}
