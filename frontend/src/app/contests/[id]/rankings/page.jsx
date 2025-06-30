"use client";
import { useEffect, useState } from "react"
import axios from "axios"
import { useParams } from "next/navigation"

export default function Rankings() {
    const params = useParams();
    const id = params.id;
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;
    const [rankings, setRankings] = useState([]);
    useEffect(() => {
        const getRankings = async () => {
            const response = await axios.post(`${url}/api/contest/getContestRanking`,{
                id:id,
            });
            setRankings(response.data.ranking);
            console.log(response.data);
        }
        getRankings();
    },[]);
    return (
        <div>Rankings</div>
    )
}