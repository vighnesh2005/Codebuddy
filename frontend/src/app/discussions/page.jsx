"use client"
import { useEffect, useContext, useState } from "react";
import { context } from "@/context/context";
import { showError, showSuccess } from "@/components/ui/sonner";
import axios from "axios";  
import Link from "next/link";
import Loading from "@/components/loading";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

export default function Discussions() {
    const { isLoggedIn , user} = useContext(context);
    const URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [discussions,setDiscussions] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

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
                                    return (
                    <div
                    key={index}
                    onClick={() => router.push(`/discussions/${discussion._id}`)}
                    className="p-3 my-3 border-2 bg-black border-white rounded-md text-white hover:bg-white hover:text-black cursor-pointer"
                    >
                    <div className="flex items-center">
                        <button
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering outer navigation
                            router.push(`/profile/${discussion.user.username}?id=${discussion.user._id}`);
                        }}
                        >
                        <Avatar className="cursor-pointer w-12 h-12">
                            <AvatarImage src={discussion.user.profile} alt="User Avatar" />
                            <AvatarFallback className="bg-green-600 text-white font-bold text-xl">
                            {discussion.user?.username[0].toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        </button>
                        <h1 className="text-lg font-bold pl-3">{discussion.user.username}</h1>
                    </div>

                    <h1 className="text-lg font-bold px-2 pt-2">{discussion.Title}</h1>
                    <pre className="px-2 text-sm text-gray-300">{discussion.content}</pre>
                    </div>
                );
                })
            }
        </div>)
        }
        </>
        )
}
