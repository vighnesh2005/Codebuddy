"use client";
import Tags from "@/components/tags.jsx"; 
import { useState } from "react";

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

  const [search,setSearch] = useState("");

  return(
    <>
    <div className="p-4">
        <Tags tags = {tags}></Tags>
        
        {/* search */}
        <div className="flex flex-wrap gap-4 items-start">
            <input className = "bg-slate-200 w-2/5 min-w-[20.5rem] my-5 p-2 rounded-md " 
            type="text" placeholder="search a problem" value={search}
            onChange={(e)=> setSearch(e.target.value) }
            />
            
        </div>
    </div>
    </>

  )
   
}
