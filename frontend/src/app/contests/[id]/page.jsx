"use client";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/components/loading";
import { context } from "@/context/context";
import Link from "next/link";
import { showError , showSuccess} from "@/components/ui/sonner";

export default function Contest() {
  const { id } = useParams();
  const [contest, setContest] = useState(null);
  const URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [registered, setRegistered] = useState(false);
  const { user, isLoggedIn } = useContext(context);

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await axios.post(`${URL}/api/contest/getContest`, {
          id,
          isLoggedIn,
          user: user?._id,
        });
        setContest(res.data.contest);
        setRegistered(res.data.registered);
        console.log(res.data);
      } catch (err) {
        console.error("Error fetching contest:", err);
      }
    };
    if (id) fetchContest();
  }, [user]);

  const handleRegister = async () => {
    if(isLoggedIn === false) return showError("Please login first");
    try {
      const res = await axios.post(`${URL}/api/contest/register`, {
        user: user._id,
        contest: id,
      });
      showSuccess("Registered successfully");
      setRegistered(true);
    } catch (err) {
      console.error("Error registering:", err);
    }
  };

  const handleUnregister = async () => {
    try {
      const res = await axios.post(`${URL}/api/contest/unregister`, {
        user: user._id,
        contest: id,
      });
      showSuccess("Unregistered successfully");
      setRegistered(false);
    } catch (err) {
      console.error("Error unregistering:", err);
    }
  };

  return (
    <div className="p-6 text-white bg-gray-900 m-2 rounded-lg">
      {contest ? (
        <div className="flex flex-wrap">
          <div className="flex flex-col items-center">
            <h1 className="text-5xl font-bold mb-5">{contest.name}</h1>

            <div>
              {new Date(contest.start_time) > new Date() ? (
                registered ? (
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                    onClick={handleUnregister}
                  >
                    Unregister
                  </button>
                ) : (
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                    onClick={handleRegister}
                  >
                    Register
                  </button>
                )
              ) : (
                <div className="text-white font-bold py-2 px-4 rounded">
                  {new Date(contest.end_time) > new Date() ? (
                    registered ? (
                      <div className="text-xl text-green-500">You are registered</div>
                    ) : (
                      <div className="text-xl text-red-500">You are not registered</div>
                    )
                  ) : (
                    <div className="text-xl text-red-500">Contest is over</div>
                  )}
                </div>
              )}
            </div>



            <div className="text-2xl mt-4 flex flex-col items-center p-5">
              <div className="text-3xl font-bold text-amber-400">
                Welcome to {contest.name}
              </div>
              <div className="flex flex-col justify-start w-full m-5">
                <p className="font-semibold">Rules:</p>
                <ul className="list-disc list-inside text-md">
                  <li>All submissions will be evaluated on a case-by-case basis.</li>
                  <li>Duration of the contest is 120 minutes.</li>
                  <li>Cheating is strictly prohibited.</li>
                  <li>Penalty for any kind of misconduct will be up to the discretion of the judges.</li>
                </ul>
              </div>
            </div>
          </div>

        <div className="text-xl font-bold text-amber-400 xl:w-1/3 w-full">
            <div className="my-4">Problems</div>
          {new Date(contest.start_time) > new Date() ? (
            <div className="flex flex-col items-center text-2xl text-white bg-gray-800 p-4 rounded-lg">
              Contest is yet to start
            </div>
          ):(
            <div>
                {
                    contest.problems.map((problem,index)=>{
                        return(
                            <div key={index} className="text-lg text-white bg-gray-800 p-4 rounded-lg m-2">
                                <Link href={`/contests/${id}/${problem.problem._id}?index=${problem.index}`}>{problem.index}. {problem.problem.name}</Link>
                            </div>
                        )
                    })
                }
            </div>
          )}
          <div className="my-4">
            Rankings
          </div>
          <div className="bg-gray-800 p-4 rounded-lg flex items-center justify-center">
            {
              new Date(contest.start_time) > new Date() ? (
                <div className="text-white text-2xl">Contest is yet to start</div>
              ):(
                <Link className="text-lg text-white bg-gray-800 p-4 rounded-lg m-2
                hover:bg-gray-600 transition-all duration-100"
                 href={`/contests/${id}/rankings`}>
                  View Rankings
                </Link>
              )
            }
          </div>
        </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}
