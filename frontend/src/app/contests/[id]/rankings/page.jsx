"use client";
import { useEffect, useState } from "react"
import axios from "axios"
import { useParams } from "next/navigation"

export default function Rankings() {
    const params = useParams();
    const id = params.id;
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;
    const [rankings, setRankings] = useState([]);
    const [contest , setContest] = useState([]);
    useEffect(() => {
        const getRankings = async () => {
            const response = await axios.post(`${url}/api/contest/getContestRanking`,{
                id:id,
            });
            const sorted = response.data.ranking.sort((a, b) => a.rank - b.rank);
            setRankings(sorted);
            setContest(response.data.contest);
        }
        getRankings();
    },[]);
    return (
        <div className="p-10">
        {
            new Date(contest.end_time) > new Date() ?(
                <div className="text-3xl text-yellow-500 text-bold">Live Rankings</div>
            ):(
                <div className="text-3xl text-yellow-500 text-bold">Final Rankings</div>
            )
        }
        <div className="py-5">
        {
            rankings.length === 0 ? (
                <div className="p-3 text-3xl text-white">No Rankings</div>
            ):( "" )
        }

        {
            rankings.map((user,index) =>(
                <div key={index} className="even:bg-gray-900
                odd:bg-gray-700  p-3 text-2xl text-white rounded-lg
                    flex flex-wrap justify-between
                "
                >
                    <div>
                    <div className="inline-block">{index+1}. </div>
                    <div className="inline-block mx-2">{user.username || user.user.username}</div>
                    </div>
                    <div>    
                    <div className="inline-block mx-2">Score: {user.score}</div>
                    <div className="inline-block mx-2">Penalty: {user.penalty}</div>
                    <div className="inline-block mx-2">Last Submission:  {new Date(user.lastScoreUpdate).toLocaleString()}</div>
                    </div>
                </div>
            ))
        }
        </div>
        </div>
    )
}