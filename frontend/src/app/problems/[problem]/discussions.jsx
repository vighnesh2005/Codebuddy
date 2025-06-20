"use client";
import axios from "axios";
import { useEffect, useState, useContext, memo } from "react";
import { context } from "@/context/context";
import { showError } from "@/components/ui/sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Discussions({ id, user_id }) {
  const [comment, setComment] = useState("");
  const [parent, setParent] = useState(null);
  const [comments, setComments] = useState([]);
  const URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { isLoggedIn } = useContext(context);

  const fetchComments = async () => {
    const res = await axios.post(
      `${URL}/api/p/discussions`,
      { id },
      { withCredentials: true }
    );
    if (res.status === 200) {
      const tree = buildCommentTree(res.data.discussions);
      setComments(tree);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

  const buildCommentTree = (comments) => {
    const map = {};
    const roots = [];

    comments.forEach((comment) => {
      comment.children = [];
      map[comment._id] = comment;
    });

    comments.forEach((comment) => {
      if (comment.parent && map[comment.parent]) {
        map[comment.parent].children.push(comment);
      } else {
        roots.push(comment);
      }
    });

    return roots;
  };

  const handleComment = async () => {
    if (!isLoggedIn) return showError("Please login first");
    try {
      await axios.post(
        `${URL}/api/p/addcomment`,
        { id, comment, user_id, parent: null },
        { withCredentials: true }
      );
      setComment("");
      fetchComments();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-2 overflow-hidden ">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="bg-black text-white p-2 border-2 border-gray-600 rounded-md w-full custom-scrollbar"
        placeholder="Write a comment..."
      />
      <div className="flex justify-end">
        <button
          className="bg-black text-white p-2 border-2 border-gray-white rounded-md hover:bg-gray-700 my-2"
          onClick={handleComment}
        >
          Comment
        </button>
      </div>

      <hr className="my-3" />
      <h1 className="text-xl font-bold">Comments ({comments.length})</h1>
      <div className={`${comments.length && "hidden"} flex items-center justify-center w-full `}>
            <h1 className="text-2xl font-bold text-gray-500">No Comments Yet.</h1>
      </div>

      {comments.map((comment, i) => (
        <MemoizedCommentNode
          key={`${comment._id}-${i}`}
          comment={comment}
          depth={0}
          id={id}
          user_id={user_id}
          isLoggedIn={isLoggedIn}
          fetchComments={fetchComments}
        />
      ))}
    </div>
  );
}

// Memoized recursive comment node
const CommentNode = ({
  comment,
  depth,
  id,
  user_id,
  isLoggedIn,
  fetchComments,
}) => {
  const [showReply, setShowReply] = useState(false);
  const [localReply, setLocalReply] = useState("");

  const handleReply = async () => {
    if (!isLoggedIn || !localReply) return showError("Login and write something");
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/p/addcomment`,
        {
          id,
          comment: localReply,
          user_id,
          parent: comment._id,
        },
        { withCredentials: true }
      );
      setShowReply(false);
      setLocalReply("");
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`ml-${depth * 4} my-3 bg-black p-3 rounded-md`}>
      <div className="flex gap-2 items-center">
        <Avatar>
          <AvatarImage src={comment.user.profile} alt="User Avatar" />
          <AvatarFallback className="bg-green-600 text-white font-bold">
            {comment.user.username[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-md font-bold">{comment.user.username}</h1>
        <p className="text-sm">{comment.createdAt}</p>
      </div>

      <pre className="text-md mt-3 px-3 whitespace-pre-wrap">{comment.message}</pre>

      <div className="flex justify-end text-blue-500 hover:underline">
        <button
          className={`${user_id === comment.user._id ? "hidden" : ""}`}
          onClick={() => setShowReply(!showReply)}
        >
          {showReply ? "Cancel" : "Reply"}
        </button>
      </div>

      {showReply && (
        <div className="mt-2">
          <textarea
            value={localReply}
            onChange={(e) => setLocalReply(e.target.value)}
            className="bg-gray-800 text-white p-2 border-2 border-gray-600 rounded-md w-full mt-2 custom-scrollbar"
            placeholder="Write your reply..."
          />
          <div className="flex justify-end">
            <button
              onClick={handleReply}
              className="bg-blue-600 text-white px-3 py-1 rounded-md mt-2 hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {comment.children?.length > 0 && (
        <div className="ml-4 border-l border-gray-700 pl-3">
          {comment.children.map((child, i) => (
            <MemoizedCommentNode
              key={`${child._id}-${i}`}
              comment={child}
              depth={depth + 1}
              id={id}
              user_id={user_id}
              isLoggedIn={isLoggedIn}
              fetchComments={fetchComments}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const MemoizedCommentNode = memo(CommentNode);
