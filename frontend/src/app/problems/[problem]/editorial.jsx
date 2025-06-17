"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { useState } from "react";
import { Editor } from "@monaco-editor/react";

export default function Editorial(props) {
  const [language, setLanguage] = useState("cpp");

  return (
    <div className="p-6 overflow-x-hidden">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">Solution</h1>
        <Select onValueChange={setLanguage} value={language}>
          <SelectTrigger className="bg-black text-white">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent className="bg-black text-white">
            {props.languages.map((lang) => (
              <SelectItem
                key={lang}
                value={lang}
                className="p-2 border-2 my-1 border-black hover:bg-gray-700 hover:rounded-md"
              >
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {props.editorial.map((solution, index) =>
        solution.language === language ? (
          <div key={index} className="w-full h-[400px]">
            {/* Fixed height is critical */}
            <div className="text-gray-300 py-3">{solution.description}</div>
            <Editor
              className="w-full h-full "
              height="100%"
              language={language}
              value={solution.code}
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
        ) : null
      )}
    </div>
  );
}
