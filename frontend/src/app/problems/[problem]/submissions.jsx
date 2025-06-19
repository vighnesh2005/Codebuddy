"use client";
import { useState } from "react";
import { Editor } from "@monaco-editor/react";

export default function Submissions(props) {
    let { submissions } = props;
    const [hidden, setHidden] = useState(false);
    const [submit, setSubmit] = useState({});
    if(!Array.isArray(submissions))
        submissions = [submissions];
    if(submissions.length === 0)
        return (
            <div className="p-2 py-4">
                <div className="flex justify-center  items-center p-4 text-gray-400 text-2xl ">
                    <div className="">No Submissions Yet </div>
                </div>
            </div>
        )
    return (
        <>
        <div className={`${hidden ? "hidden" : ""} p-2 py-4 `}>
            {submissions.map((submission, index) => (
                <button key={index} className="inline-block w-full" onClick={() => {
                    setSubmit(submission)
                    setHidden(true)
                    }}>
                    <div className="flex justify-between p-4 bg-white text-black border-2 border-gray-900">
                        <div className={`${submission.result === "Accepted" ? "text-green-600" : "text-red-600"} mx-2`}>{submission.result}</div>
                        <div className="mx-2">{submission.date}</div>
                        <div className="mx-2">Passed: {submission.noofpassed}</div>
                        <div className="mx-2">total: {submission.total}</div>
                    </div>
                </button>
            ))}
        </div>
        <div className={`${hidden ? "" : "hidden"} p-3 `}>
            <button onClick={() => setHidden(false)} className="bg-black text-white p-2 mb-5 rounded-lg hover:bg-gray-600
            transition-all duration-100">back</button>
            <div className="text-white text-xl text-lg px-2">Tests: {submit.noofpassed}/{submit.total}</div>
            <div className="w-full h-[400px]">
            <div className="flex justify-between">
                <h1 className="font-bold text-white text-xl py-3 px-2">Submitted Code :</h1>
                <h1 className="font-bold text-white text-xl py-3 px-2 flex">language:<div className="font-medium">" {submit.language} "</div></h1>

            </div>            
            
            <Editor
              className="w-full h-full "
              height="100%"
              language={submit.language}
              value={submit.code}
              onChange={() => {}}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: {
                  enabled: false,
                },
              }}
            />
          </div>
        </div>
        </>
        
    )
}