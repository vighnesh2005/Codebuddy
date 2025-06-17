"use client";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { useEffect,useState } from "react";
import { context } from "@/context/context.js";
import { useParams } from "next/navigation";
import Loader from "@/components/loading";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";  
import { Select, SelectContent, SelectItem,  SelectTrigger, SelectValue } from "@/components/ui/select";
import  Description  from "./description.jsx"
import Editorial from "./editorial.jsx";
export default function CodeEditor() {
    const { problem } = useParams();
    const { isLoggedIn, user } = context();
    const URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const [loading, setLoading] = useState(true);
    const [problemData, setProblemData] = useState({
      languages: [],
    });
    const [solution, setSolution] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [code, setCode] = useState(localStorage.getItem(`${problem}-cpp`) || "//Write your code here");
    const [language, setLanguage] = useState("cpp");
    const [place, setPlace] = useState("Description");
    const [complete,setComplete] = useState(0);

    useEffect(() => {
        const fecthData = async () => {
            const res = await axios.post(`${URL}/api/p/getproblem`,{
                isLoggedIn,
                id:problem,
                user:user?._id
            },{ withCredentials: true });


            if(res.status === 200){
              console.log(res.data);
              setProblemData(res.data.problem);
                setSolution(res.data.solution);
                setSubmissions(res.data.submissions);
                setLoading(false);
                iscompleted();
            }
        }
        fecthData();
    },[])

    function iscompleted(){
      let flag = 0;
      for(let i=0;i<submissions.length;i++){
        if(submissions[i].result === "Accepted"){
          flag = 1;
          break;
        }
        else{
          flag = 2;
        }
      }
      
      setComplete(flag);
    }
    
    useEffect(()=>{
      setCode(localStorage.getItem(`${problem}-${language}`)|| "//Write your code here");

      },[language])
    return (
    <div>
        {
            loading ? (
                <Loader />
            ) : (
                <>
                
                <PanelGroup direction = "horizontal" className="h-screen">
                  <Panel className="bg-gray-800 w-full flex flex-col h-[90vh] border-2 border-gray-200 overflow">
                    <div className="overflow-y-auto overflow-x-hidden custom-scrollbar">
                      {/* navigation for problem */}
                      <nav className="flex justify-around bg-black">
                        <button onClick={() => setPlace("Description")} className={`${place == "Description" ? "border-b-2 border-blue-500":""}bg-grey-800 p-2 text-white hover:bg-gray-600 hover:rounded-t-lg m-1 active:border-2 active:border-white`}>Description</button>
                        <button onClick={() => setPlace("Editorial")} className={`${place == "Editorial" ? "border-b-2 border-blue-500":""}bg-grey-800 p-2 text-white hover:bg-gray-600 hover:rounded-t-lg m-1 active:border-2 active:border-white`}> Editorial </button>
                        <button onClick={() => setPlace("Submissions")} className={`${place == "Submissions" ? "border-b-2 border-blue-500":""}bg-grey-800 p-2 text-white hover:bg-gray-600 hover:rounded-t-lg m-1 active:border-2 active:border-white`}> Submissions </button>
                        <button onClick={() => setPlace("Discussion")} className={`${place == "Discussion" ? "border-b-2 border-blue-500":""}bg-grey-800 p-2 text-white hover:bg-gray-600 hover:rounded-t-lg m-1 active:border-2 active:border-white`}> Discussion </button>
                      </nav>
                      <div>
                      </div>
                      {
                        // description
                        place === "Description" ? (
                            <Description problemData={problemData} complete={complete} />
                        ) : place === "Editorial" ? (
                            <Editorial editorial={solution} languages={problemData.languages}/>
                        ) : place === "Submissions" ? (
                            <div className="p-4 text-white">
                                {problemData.submissions}
                            </div>
                        ) : place === "Discussion" ? (
                            <div className="p-4 text-white">
                                {problemData.discussion}
                            </div>
                        ) : null
                    }
                    </div>                      
                  </Panel>

                  <PanelResizeHandle className="bg-black hover:bg-blue-500 w-1"></PanelResizeHandle>

                  <Panel className="w-full bg-gray-800 flex flex-col h-[90vh] border-gray-200 border-2">
                    <nav className="p-1 border-[1px] border-gray-500">
                      <Select onValueChange={setLanguage} value={language} className="bg-black text-white">
                        <SelectTrigger className=" bg-black text-white ">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent className="bg-black text-white">
                          {problemData.languages.map((lang) => (
                            <SelectItem key={lang} value={lang} className=" p-2 border-2 my-1 border-black hover:bg-gray-700 hover:rounded-md">
                              {lang}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </nav>

                    {/* Editor  */}
                    <Editor
                      className=""
                      height="100%"
                      language={language}
                      value={code}
                      onChange={(value) => {
                        setCode(value || "");  // handle null
                        localStorage.setItem(`${problem}-${language}`, value || "");
                      }}
                      theme="vs-dark"
                      options={{
                        readOnly: false,
                        minimap: {
                          enabled: false,
                        },
                      }}
                    />

                  </Panel>                        
                </PanelGroup>
                </>
            )
        }
    </div>
  );
}
