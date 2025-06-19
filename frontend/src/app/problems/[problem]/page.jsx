"use client";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { context } from "@/context/context.js";
import { useParams } from "next/navigation";
import Loader from "@/components/loading";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Description from "./description.jsx";
import Editorial from "./editorial.jsx";
import { Button } from "@/components/ui/button.jsx";
import { showError, showSuccess } from "@/components/ui/sonner";
import Submissions from "./submissions.jsx";

export default function CodeEditor() {
  const { problem } = useParams();
  const { isLoggedIn, user } = useContext(context);
  const URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [loading, setLoading] = useState(true);
  const [problemData, setProblemData] = useState({
    languages: [],
  });
  const [solution, setSolution] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [code, setCode] = useState("//Write your code here");
  const [language, setLanguage] = useState("cpp");
  const [place, setPlace] = useState("Description");
  const [butt, setButt] = useState(false);
  const [testcase, setTestcase] = useState("");
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tests, setTests] = useState([]);
  const [error, setError] = useState("");
  const [testResults, setTestResults] = useState([]); // ✅ NEW
  const [runresult, setRunresult] = useState("");

  useEffect(() => {
  // Always fetch problem details (description, tests)
  const fetchPublicData = async () => {
    try {
      const res = await axios.post(
        `${URL}/api/p/getproblem`,
        {
          isLoggedIn: false,
          id: problem,
          user: null,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setProblemData(res.data.problem);
        setSolution(res.data.solution);
        setLoading(false);
        setTestcase(res.data.problem.tests[0].input);
        setTests(res.data.problem.tests);
      }
    } catch (err) {
      console.error("Error fetching public problem data:", err);
    }
  };

  fetchPublicData();
  }, []); // 👈 run only once

  useEffect(() => {
    // Run only when user becomes available
    if (!user) return;

    const fetchPrivateData = async () => {
      try {
        const res = await axios.post(
          `${URL}/api/p/getproblem`,
          {
            isLoggedIn: true,
            id: problem,
            user: user._id,
          },
          { withCredentials: true }
        );

        if (res.status === 200) {
          setSubmissions(res.data.submissions);
        }
      } catch (err) {
        console.error("Error fetching private problem data:", err);
      }
    };

    fetchPrivateData();
  }, [user]); // 👈 only runs when user becomes available


  function iscompleted() {
    let flag = 0;
    if (!Array.isArray(submissions)) {
      if (submissions.result === "Accepted") {
        return 1;
      } else {
        return 2;
      }
    }
    for (let i = 0; i < submissions.length; i++) {
      if (submissions[i].result === "Accepted") {
        flag = 1;
        break;
      } else {
        flag = 2;
      }
    }
    return flag;
  }

  useEffect(() => {
    setCode(localStorage.getItem(`${problem}-${language}`) || "//Write your code here");
  }, [language]);

  const handleRun = async () => {
    setButt(true);
    try {
      const res = await axios.post(
        `${URL}/api/submit/submitproblem`,
        {
          problem_id: problem,
          code: code,
          language: language,
          input: testcase,
          output: "",
        },
        {
          withCredentials: true,
        }
      );
      setRunresult(res.data.output);
      console.log(res.data);
      if (res.data.error) setRunresult(res.data.error);
      
    } catch (error) {
      console.error(error);
    }
    setButt(false);
  };

  const handleSubmit = async () => {
    if (!isLoggedIn) {
      showError("Please login first");
      return;
    }

    setButt(true);
    setSubmitting(true);
    setTestResults([]); // ✅ reset previous result
    setError("");
    const tests = problemData.tests;
    let result = "Accepted";
    let count = 0;
    let currentResults = [];

    for (let i = 0; i < tests.length; i++) {
      const element = tests[i];
      try {
        const res = await axios.post(
          `${URL}/api/submit/submitproblem`,
          {
            problem_id: problem,
            code: code,
            language: language,
            input: element.input,
            output: element.output,
          },
          {
            withCredentials: true,
          }
        );

        if (res.data.result !== "Accepted") {
          showError(res.data.result);
          currentResults.push("Wrong");
          if (res.data.error) setError(res.data.error);
          result = res.data.result;
          break;
        } else {
          count++;
          currentResults.push("Accepted");
        }
      } catch (err) {
        console.error("Submission error:", err);
        showError("Server error");
        result = "Error";
        break;
      }
    }

    setTestResults(currentResults); // ✅ store the test results in state

    if (count === tests.length) {
      showSuccess("All tests passed!");
    }

    try {
      const newres = await axios.post(
        `${URL}/api/submit/addsubmission`,
        {
          user: user._id,
          problem: problem,
          code: code,
          language: language,
          result: result,
          date: new Date(),
          noofpassed: count,
          total: tests.length,
        },
        {
          withCredentials: true,
        }
      );
      submissions.push(newres.data.saved);
      console.log("Final submission saved successfully");
    } catch (error) {
      console.error("Error saving final submission:", error);
    }

    setButt(false);
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <PanelGroup direction="horizontal" className="h-screen">
            <Panel className="bg-gray-800 w-full flex flex-col h-[90vh] border-2 border-gray-200 overflow">
              <div className="overflow-y-auto overflow-x-hidden custom-scrollbar">
                <nav className="flex justify-around bg-black">
                  <button
                    onClick={() => setPlace("Description")}
                    className={`${place == "Description" ? "border-b-2 border-blue-500" : ""} bg-grey-800 p-2 text-white hover:bg-gray-600 hover:rounded-t-lg m-1 active:border-2 active:border-white`}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setPlace("Editorial")}
                    className={`${place == "Editorial" ? "border-b-2 border-blue-500" : ""} bg-grey-800 p-2 text-white hover:bg-gray-600 hover:rounded-t-lg m-1 active:border-2 active:border-white`}
                  >
                    Editorial
                  </button>
                  <button
                    onClick={() => setPlace("Submissions")}
                    className={`${place == "Submissions" ? "border-b-2 border-blue-500" : ""} bg-grey-800 p-2 text-white hover:bg-gray-600 hover:rounded-t-lg m-1 active:border-2 active:border-white`}
                  >
                    Submissions
                  </button>
                  <button
                    onClick={() => setPlace("Discussion")}
                    className={`${place == "Discussion" ? "border-b-2 border-blue-500" : ""} bg-grey-800 p-2 text-white hover:bg-gray-600 hover:rounded-t-lg m-1 active:border-2 active:border-white`}
                  >
                    Discussion
                  </button>
                </nav>
                {place === "Description" && submissions ? (
                  <Description problemData={problemData} complete={iscompleted()} isLoggedIn={isLoggedIn} />
                ) : place === "Editorial" ? (
                  <Editorial editorial={solution} languages={problemData.languages} />
                ) : place === "Submissions" ? (
                  <Submissions submissions={submissions} />
                ) : place === "Discussion" ? (
                  <div className="p-4 text-white">{problemData.discussion}</div>
                ) : null}
              </div>
            </Panel>

            <PanelResizeHandle className="bg-black hover:bg-blue-500 w-1"></PanelResizeHandle>

            <Panel className="w-full bg-gray-800 flex flex-col h-[90vh] border-gray-200 border-2">
              <PanelGroup direction="vertical">
                
                <Panel className="flex flex-col">
                  <nav className="p-1 border-[1px] border-gray-500">
                    <Select onValueChange={setLanguage} value={language} className="bg-black text-white">
                      <SelectTrigger className=" bg-black text-white ">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent className="bg-black text-white">
                        {problemData.languages.map((lang) => (
                          <SelectItem
                            key={lang}
                            value={lang}
                            className=" p-2 border-2 my-1 border-black hover:bg-gray-700 hover:rounded-md"
                          >
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </nav>

                  <div className="flex-grow">
                    <Editor
                      height="100%"
                      language={language}
                      value={code}
                      onChange={(value) => {
                        setCode(value || "");
                        localStorage.setItem(`${problem}-${language}`, value || "");
                      }}
                      theme="vs-dark"
                      options={{
                        readOnly: false,
                        minimap: { enabled: false },
                      }}
                    />
                  </div>
                </Panel>
                <PanelResizeHandle className="bg-black hover:bg-blue-500 h-1 cursor-row-resize"></PanelResizeHandle>
                {
                  submitting ? (
                    <Panel className={`${submitting ? "" : "hidden"} overflow-scroll `}>
                  <div className="p-2 flex justify-between mx-2 overflow-auto">
                    <div className="p-2 text-white ">
                      tests: {testResults.length}/{tests.length}
                    </div>
                    <Button
                      onClick={() => {
                        setSubmitting(false)
                        setError("");
                        setTestResults([]);
                      }}
                      className={
                        "text-white bg-black hover:bg-gray-900 hover:rounded-2xl transition-all duration-300 border-2"
                      }
                    >
                      X
                    </Button>
                  </div>
                  {tests.map((test, index) => (
                    <div
                      key={index}
                      className={`m-2 border-2 ${
                        testResults[index] === "Accepted"
                          ? "border-green-500"
                          : testResults[index] === "Wrong"
                          ? "border-red-500"
                          : "border-gray-500"
                      }`}
                    >
                      <h1 className="bg-black text-white p-2 px-3 rounded-md">Test {index + 1}</h1>
                    </div>
                  ))}
                  <div className={`${!error ? "hidden" : ""} p-2 bg-black text-red-500`}>{error}</div>
                </Panel>
                  ):(
                    <Panel defaultSize={60} minSize={0} className={`${running | submitting ? "hidden" : ""} overflow-y-scroll flex flex-col`}>
                  <div className="overflow-y-auto custom-scrollbar">
                  <div className="flex justify-end ">
                    <div className="p-3 flex-auto">
                      <h1 className="text-lg font-bold text-white">Enter a sample testcase</h1>
                    </div>
                    <Button
                      variant="default"
                      className="m-2 bg-black text-white p-3 hover:bg-gray-600"
                      onClick={handleRun}
                      disabled={butt}
                    >
                      Run
                    </Button>
                    <Button
                      variant="default"
                      className="m-2 mr-4 bg-black text-white p-3 hover:bg-gray-600"
                      onClick={handleSubmit}
                      disabled={butt}
                    >
                      Submit
                    </Button>
                  </div>
                  <div className="p-2">
                    <textarea
                      className="bg-black text-white p-2 w-full my-1 custom-scrollbar"
                      value={testcase}
                      onChange={(e) => setTestcase(e.target.value)}
                    ></textarea>
                  </div>
                  <div className={ `${runresult ? "" : "hidden"}bg-black p-3 mx-2 rounded-lg`}>
                    <pre className="text-white p-3 whitespace-pre-wrap">{runresult}</pre>
                  </div>
                  </div>
                </Panel>
                  )
                }
                
              </PanelGroup>
            </Panel>
          </PanelGroup>
        </>
      )}
    </div>
  );
}
