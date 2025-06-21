"use client"
import { useEffect, useContext, useState } from "react";
import { context } from "@/context/context";
import { showError, showSuccess } from "@/components/ui/sonner";
import axios from "axios";  
import Link from "next/link";
import Loading from "@/components/loading";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Discussions() {
    const { isLoggedIn , user} = useContext(context);
    const URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [discussions,setDiscussions] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchdiscussion = async () => {
            try {
                const res = await axios.post(`${URL}/api/discussions/discussions`, {}, { withCredentials: true });
                if (res.status === 200) {
                    setDiscussions(res.data.discussions);
                }
                setLoading(false);
            } catch (error) {
                console.error(error);
                showError("Unable to fetch discussions");
            }
        }
        fetchdiscussion();
    }, []);

    const handleSubmit = async ()=>{
        if(!isLoggedIn){
            showError("Please login first");
            return;
        }
        try {
            const res = await axios.post(`${URL}/api/discussions/adddiscussion`,{
                user:user?._id,
                title,
                content
            }, { withCredentials: true });
            
            if(res.status === 201){
                setTitle("");
                setContent("");
                setDiscussions([...discussions,res.data.newDisscussion]);
                showSuccess("Discussion added successfully");
            }
            if(res.status === 500){
                showError("Unable to add discussion");
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
        {
            loading ? (
                <Loading />
            ):(
                <div className="p-10 ">
            <input className="bg-black w-full min-h-10 rounded-md text-white p-3 border-2 border-white my-3"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
            ></input>
            <textarea className="bg-black w-full min-h-30 rounded-md text-white p-3 border-2 border-white"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your discussion here..."
            ></textarea>
            <div className="flex justify-end">
                <button className="bg-black rounded-md text-white p-2 border-2 border-white m-3
                    hover:bg-white hover:text-black"
                    onClick={
                        handleSubmit
                    }
                >Submit</button>
            </div>
            <hr className="my-3 border-white"/>
            {/* discussions  */}
            <div>
                <h1 className="p-2 text-xl text-white font-bold">Discussions({discussions.length})</h1>
            </div>
            {
                discussions.map((discussion,index)=>{
                    return(
                        <Link href={`/discussions/${discussion._id}`} key={index} >
                            <div className="p-2 my-3 border-2 bg-black border-white rounded-md text-white
                                hover:bg-white hover:text-black max-h-30 truncate">
                            <div className="flex">
                                <Avatar className="cursor-pointer ml-1">
                                <AvatarImage src={discussion.user.profile} alt="User Avatar" />
                                <AvatarFallback className="bg-green-600 text-white font-bold">{discussion.user?.username[0].toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <h1 className="text-lg font-bold pl-2">{discussion.user.username}</h1>
                            </div>
                            <h1 className="text-lg font-bold p-2">{discussion.Title}</h1>
                            <pre className="pl-2">{discussion.content}</pre>
                            </div>
                        </Link>
                    )
                })
            }
        </div>)
        }
        </>
        )
}
