"use client";
import { useState, useEffect, useContext } from "react";
import Tags from "@/components/tags.jsx"; 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { HoverCard,HoverCardContent,HoverCardTrigger } from "@/components/ui/hover-card.jsx";
import axios from "axios";
import {context} from "@/context/context.js";
import { showError } from "@/components/ui/sonner";
import Link from "next/link";
import { Check } from "lucide-react";
import Loader from "@/components/loading";

export default function Problems() {

  const URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [tags,setTags] = useState([]);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("difficulty-increasing");
  const [problems, setProblems] = useState([]);
  const {isLoggedIn,user} = useContext(context);
  const [loading, setLoading] = useState(true);
  const [solved, setSolved] = useState([]);
  const [dumproblems, setDumproblems] = useState([]);

  const getdifficulty = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return 0;
      case "Medium":
        return 1;
      case "Hard":
        return 2;
    }
  };

  useEffect(()=>{
    const func = async () => {
      try {  
        const response = await axios.post(`${URL}/api/p/problems`,{
          isLoggedIn,
          id:user?._id,
        }
        );
        if(response.status === 200){
          setProblems(response.data.problems);
          setTags(response.data.tags);
          setSolved(new Set(response.data.solved));
          setDumproblems(response.data.problems);
          console.log(dumproblems);
          setLoading(false);
        }
      } catch (error) {
          console.error(error);
          setLoading(true);
          showError("Unable to fetch problems");
      }
    }
    func();
  },[])
  
  const lcs = (a, b) => {
    const m = a.length, n = b.length;
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
        else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
    return dp[m][n];
  };

  const handleSearch = () => {
    setLoading(true); // Hide problems while processing

    let res = search.trim() === ""
  ? [...dumproblems]
  : problems.filter(item => {
      const s = search.toLowerCase();
      const name = item.name.toLowerCase();
      const tags = item.tags.map(tag => tag.toLowerCase());

      const nameLCS = lcs(s, name);
      const tagMatch = tags.some(tag => tag.includes(s));

      return nameLCS >= 3 || tagMatch;
    });

    // Sorting
    if (sort === "difficulty-increasing") {
      res.sort((a, b) => getdifficulty(a.difficulty) - getdifficulty(b.difficulty));
    } else if (sort === "difficulty-decreasing") {
      res.sort((a, b) => getdifficulty(b.difficulty) - getdifficulty(a.difficulty));
    } else if (sort === "acceptance-high") {
      res.sort((a, b) => b.acceptance - a.acceptance);
    } else if (sort === "acceptance-low") {
      res.sort((a, b) => a.acceptance - b.acceptance);
    }

    setProblems(res);
    setLoading(false);
  };

   return (
    <div className="p-4">
      {loading ? (
        <Loader />
      ) : (
        <>
          <Tags tags={tags} />

          <div className="flex flex-wrap gap-4 items-start my-5 align-bottom">
            <input
              className="bg-slate-200 w-2/5 min-w-[20.5rem] p-2 rounded-md"
              type="text"
              placeholder="Search a problem"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <HoverCard>
              <Select value={sort} onValueChange={(val) => setSort(val)}>
                <HoverCardTrigger>
                  <SelectTrigger className="bg-black text-white w-full flex align-bottom py-5 border-2 border-white rounded-md">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                </HoverCardTrigger>
                <SelectContent className="bg-black text-white py-2">
                  <SelectItem value="difficulty-increasing" className="hover:bg-gray-900">
                    Difficulty - Low
                  </SelectItem>
                  <SelectItem value="difficulty-decreasing" className="hover:bg-gray-900">
                    Difficulty - High
                  </SelectItem>
                  <SelectItem value="acceptance-high" className="hover:bg-gray-900">
                    Accepted - High
                  </SelectItem>
                  <SelectItem value="acceptance-low" className="hover:bg-gray-900">
                    Accepted - Low
                  </SelectItem>
                </SelectContent>
              </Select>
              <HoverCardContent className="bg-black text-white">
                Sort the problems
              </HoverCardContent>
            </HoverCard>

            <button className="bg-blue-700 flex align-bottom p-2 border-2
             border-black rounded-md hover:bg-blue-600 transition-all duration-100 text-white font-bold"
              onClick={handleSearch}
             >
              submit
            </button>

            {/* Problems List */}
            <div className="w-4/5 my-5">
              {problems.filter(problem => problem?.isPublic !== false).map((problem, index) => (
                <Link
                  key={index}
                  href={`/problems/${problem._id}`}
                  className="w-full odd:bg-gray-600 even:bg-gray-900 p-4 hover:bg-gray-700 transition-all duration-100 text-white font-bold rounded-sm flex justify-between"
                >
                  <div>
                    {solved.has(problem.id) && <Check className="text-green-500 inline mr-2" />}
                    {problem.id}. {problem.name}
                  </div>
                  <div className="flex items-center gap-4"> 
                    <div className="">Accepted: {problem.acceptance}</div>
                    <span
                      className={
                        problem.difficulty === "Easy"
                          ? "text-cyan-500"
                          : problem.difficulty === "Medium"
                          ? "text-yellow-500"
                          : "text-red-500"
                      }
                    >
                      {problem.difficulty}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
