"use client";
import axios from "axios";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import Link from "next/link";
import Loading from "@/components/loading";

export default function tag(){
    let { tag } = useParams();
    tag = tag.replace("%20"," ");
    const URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const [problems,setProblems] = useState([]);
    const [loading,setLoading] = useState(true);

    useEffect(() =>{
        const fetchproblems = async () =>{
            const res = await axios.post(`${URL}/api/p/topic`,{tag});
            if(res.status === 200){
                console.log(res.data.problems);
                setProblems(res.data.problems);
            }
            setLoading(false);
        }
        fetchproblems();
    },[]);

    return(
        <>
        {
            loading ? (
                <Loading />
            ):(
<div className="flex justify-around">
            <div className="p-3 flex w-1/3 h-screen ">
                <div className="hidden justify-center bg-black p-3 rounded-lg h-1/3 w-full lg:flex items-center">
                <   div className="text-2xl font-bold text-white">{tag}</div>
                </div>
            </div>
            <div className="bg-black p-3 w-full h-screen m-2 rounded-lg py-4">
                {problems.length === 0 && <div className="flex justify-center items-center text-white text-2xl font-bold my-30">No problems found</div>}
                {problems.filter(problem => problem.isPublic !== false).map((problem, index) => (
                <Link
                  key={index}
                  href={`/problems/${problem._id}`}
                  className=" odd:bg-gray-600 even:bg-gray-900 p-4 hover:bg-gray-700 transition-all duration-100 text-white
                   font-bold rounded-sm flex justify-between w-full"
                >
                  <div>
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
            )
        }
        </>
    )
}