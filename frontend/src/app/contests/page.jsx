"use client"
import {useEffect, useState } from "react";
import axios from "axios";
import ContestCard from "./contestCard";
import Link from "next/link";

export default function contests(){
    const [Upcomming, setUpcomming] = useState([]);
    const [Past, setPast] = useState([]);
    const URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    
    useEffect(() =>{
        const fetchcontests = async () =>{
            const res = await axios.post(`${URL}/api/contest/getcontests`,{});
            const contests = res.data.contests;
            setUpcomming(contests.filter(contest => new Date(contest.start_time) > new Date()));
            setPast(contests.filter(contest => new Date(contest.start_time) <= new Date()));
            console.log(contests);
        }
        fetchcontests();
    },[])


    return (
        <div className="p-10">
            <div className="flex flex-col items-center text-2xl text-white bg-gray-900 p-4 rounded-lg">
                Upcoming contests
            <div className="flex flex-wrap gap-4 w-full">
                {
                    Upcomming.length === 0 ? <div className="m-10 text-gray-500">No Upcoming Contests</div> : ""
                }
                {
                    Upcomming.map((contest,index)=>{
                        return(
                            <ContestCard key={index} contest={contest}/>
                        )
                    })
                }
            </div>
            </div>
            <div className="flex flex-col items-center text-2xl
             w-full text-white bg-gray-900 p-4 mt-4 rounded-lg">
                Past Contests | Ongoing Contests
                {
                    Past.length === 0 ? <div className="m-10 text-gray-500">No Past Contests</div> : ""
                }
                {
                    Past.map((contest, index) => {
                        const isRunning = new Date(contest.end_time) > new Date();
                        const label = isRunning ? "Finishes at" : "Finished at";
                        return (
                        <Link
                            href={`/contests/${contest._id}`}
                            key={index}
                            className="bg-white p-5 text-black rounded-lg m-5
                            hover:bg-gray-200 hover:text-black
                            flex-1 w-full"
                        >
                            {contest.name}
                            <div className="text-sm text-gray-600 mt-2">
                            {label}{" "}
                            {new Date(contest.end_time).toLocaleString("en-IN", {
                                dateStyle: "medium",
                                timeStyle: "short",
                            })}
                            </div>
                        </Link>
                        );
                    })
                }

            </div>
        </div>
    )
}