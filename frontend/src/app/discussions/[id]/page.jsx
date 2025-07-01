"use client";
import { useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { context } from "@/context/context";
import axios from "axios";
import { showError } from "@/components/ui/sonner";
import Loading from "@/components/loading";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

export default function Discussion() {
    const { id } = useParams();
    const URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const { isLoggedIn, user } = useContext(context);
    const [discussion, setDiscussion] = useState({});
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState("");
    const [parent, setParent] = useState(null);

    useEffect(() => {
        const fetchDiscussion = async () => {
            try {
                const res = await axios.post(`${URL}/api/discussions/getcomments`, { id }, { withCredentials: true });
                if (res.status === 200) {
                    setDiscussion(res.data.discussion);
                    setComments(res.data.comments);
                }
                setLoading(false);
            } catch (error) {
                console.error(error);
                showError("Unable to fetch discussion");
            }
        };
        fetchDiscussion();
    }, [id]);

    const handleComment = async () => {
        if (!isLoggedIn) return showError("Please login first");
        if (!comment.trim()) return;

        try {
            await axios.post(`${URL}/api/discussions/addcomment`, {
                id,
                comment,
                user: user?._id,
                parent,
            }, { withCredentials: true });

            const newComment = {
                _id: Date.now().toString(), // temporary unique ID
                comment,
                parent,
                createdAt: new Date().toISOString(),
                user: {
                    _id: user._id,
                    username: user.username,
                    profile: user.profile,
                },
            };

            setComments((prev) => [...prev, newComment]);
            setComment("");
            setParent(null);
        } catch (error) {
            console.error(error);
            showError("Error adding comment");
        }
    };

    const renderComments = (comments, parentId = null, level = 0) => {
        return comments
            .filter((c) => c.parent === parentId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((c) => (
                <div key={c._id} className="ml-4 mt-4" style={{ marginLeft: `${level * 24}px` }}>
                    <div className="flex items-start gap-2 bg-[#0d0d0d] p-4 rounded-xl border border-gray-600">
                        <Link href={`/profile/${c.user.username}?id=${c.user._id}`} className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 mt-1">
                            <AvatarImage src={c.user.profile || ""} />
                            <AvatarFallback className="bg-green-600 text-white font-bold">
                                {c.user.username?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        </Link>
                        <div className="flex-1">
                            <div className="font-bold text-white flex justify-between items-center">
                                <span>{c.user.username}</span>
                                <span className="text-xs text-gray-400 ml-4">
                                    {new Date(c.createdAt).toLocaleString()}
                                </span>
                            </div>
                            <div className="text-gray-300 mt-1 whitespace-pre-wrap break-words">{c.comment}</div>
                            <button
                                onClick={() => setParent(c._id)}
                                className="text-sm text-blue-400 hover:underline mt-2"
                            >
                                Reply
                            </button>
                        </div>
                    </div>
                    {renderComments(comments, c._id, level + 1)}
                </div>
            ));
    };

    return (
        <div className="p-4">
            {loading ? (
                <Loading />
            ) : (
                <>
                    <div className="p-3">
                        <h1 className="text-3xl font-bold text-white underline underline-offset-8 bg-black inline-block p-3 pb-5 rounded-md hover:-translate-y-1 transition-all duration-200">
                            {discussion.Title}
                        </h1>
                        <pre className="my-5 text-xl bg-black p-4 rounded-lg text-white whitespace-pre-wrap break-words hover:-translate-y-1 transition-all duration-200">
                            {discussion.content}
                        </pre>
                    </div>

                    <hr className="my-5 border-gray-400 mx-3" />

                    <div>
                        <h1 className="text-xl font-bold text-white bg-black inline-block p-3 rounded-md mx-2">
                            Comments ({comments.length})
                        </h1>

                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="bg-black text-white p-2 border-2 border-gray-600 rounded-md w-full custom-scrollbar mx-2 my-2 min-h-25"
                            placeholder={parent ? "Replying to a comment..." : "Write a comment..."}
                        />
                        {parent && (
                            <div className="text-sm text-yellow-300 px-2">
                                Replying to a comment...
                                <button
                                    onClick={() => setParent(null)}
                                    className="text-red-400 underline ml-2"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                        <div className="flex justify-end px-2">
                            <button
                                className="bg-black text-white p-2 border-2 border-white rounded-md hover:bg-gray-700 my-2"
                                onClick={handleComment}
                            >
                                Comment
                            </button>
                        </div>

                        {!comments.length ? (
                            <div className="p-3 flex justify-center">
                                <h1 className="my-10 text-gray-500 text-xl">No comments yet</h1>
                            </div>
                        ) : (
                            renderComments(comments)
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
