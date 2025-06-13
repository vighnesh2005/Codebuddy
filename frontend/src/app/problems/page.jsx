"use client";
import { useState } from "react";
import { Funnel } from "lucide-react";
import Tags from "@/components/tags.jsx"; 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu.jsx";
import { HoverCard,HoverCardContent,HoverCardTrigger } from "@/components/ui/hover-card.jsx";


export default function TagBar() {
  const tags = [
    { name: "Array", count: 1931 },
    { name: "String", count: 795 },
    { name: "Hash Table", count: 704 },
    { name: "Dynamic Programming", count: 594 },
    { name: "Math", count: 588 },
    { name: "Sorting", count: 456 },
    { name: "Greedy", count: 418 },
    { name: "Depth-First Search", count: 325 },
    { name: "Binary Search", count: 300 },
    { name: "Graph", count: 280 },
    { name: "Backtracking", count: 200 },
    { name: "Stack", count: 190 },
    { name: "Two Pointers", count: 160 },
    { name: "Trie", count: 150 },
  ];

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("difficulty-increasing");
  const problems = [
    // Sample problems data
    { id: 1, title: "Two Sum", difficulty: "Easy", acceptance: 45.34 },
    { id: 2, title: "Longest Substring Without Repeating Characters", difficulty: "Med.", acceptance: 30.23 },
    { id: 3, title: "Median of Two Sorted Arrays", difficulty: "Hard", acceptance: 20.34 },
    // Add more problems as needed
  ];
  return (
    <div className="p-4">
      <Tags tags={tags} />

      {/* Search & Sort Controls */}
    
    {/* search-bar  */}
    <div className="flex flex-wrap gap-4 items-start my-5 align-bottom">
        <input
          className="bg-slate-200 w-2/5 min-w-[20.5rem] p-2 rounded-md"
          type="text"
          placeholder="Search a problem"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* sort-bar */}
        <HoverCard>
          <HoverCardTrigger>
        <Select value={sort} onValueChange={(val) => setSort(val)}>
          <SelectTrigger className="bg-black text-white w-full flex align-bottom py-5 border-2 border-white rounded-md">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent className="bg-black text-white py-2">
            <SelectItem value="difficulty-increasing" className="hover:bg-gray-900">Difficulty - Low</SelectItem>
            <SelectItem value="difficulty-decreasing" className="hover:bg-gray-900">Difficulty - High</SelectItem>
            <SelectItem value="acceptance-high" className="hover:bg-gray-900">Acceptance - High</SelectItem>
            <SelectItem value="acceptance-low" className="hover:bg-gray-900">Acceptance - Low</SelectItem>
          </SelectContent>
        </Select>
          </HoverCardTrigger>
          <HoverCardContent className="bg-black text-white">
            Sort the problems 
          </HoverCardContent>
          </HoverCard>

        {/* Problems */}
        <div className="w-4/5 my-5">
        {
            problems.map((problem,index)=>{
                return(
                    <div key={index} className="odd:bg-gray-600 even:bg-gray-900 p-4
                     hover:bg-gray-700 transition-all duration-100 text-white font-bold rounded-sm flex justify-between">
                        <div>
                          {problem.id}. {problem.title}
                        </div>
                        <div className="flex items-center gap-2">
                          <div>{problem.acceptance}%</div>
                          {problem.difficulty == "Easy" ? (
                            <span className="text-cyan-500">{problem.difficulty}</span>
                          ) : problem.difficulty == "Med." ? (
                            <span className="text-yellow-500">{problem.difficulty}</span>
                          ) : (
                            <span className="text-red-500">{problem.difficulty}</span>
                          )}
                        </div>
                    </div>
                )
            })
        }
        </div>

      </div>
    </div>
  );
}
