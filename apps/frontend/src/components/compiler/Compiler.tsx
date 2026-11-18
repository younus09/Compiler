import React, { useRef, useState } from "react";
import EditorComp from "../editor/EditorComp";
import type { Editor } from "@monaco-editor/react";
import LanguageSelect from "../select/Select";
import axios from "axios";
function Compiler() {
  const [stdIn, setStdIn] = useState("");
  const [language, setLanguage] = useState("js");
  const editorRef = useRef<any>(null);
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("");

  const userId = "d0768ea1-d478-40a6-8d21-e45152f0ee36";
  const handleRun = async () => {
    const currentCode = editorRef.current?.getValue();
    const response = await axios.post("http://localhost:3000/submission", {
      userId,
      language: language,
      stdIn,
      srcCode: currentCode,
    });
    setStatus(response.data.message);
    pollBackend(response.data.id);
  };

  const pollBackend = async (submissionId: string) => {
    const response = await axios.get(
      `http://localhost:3000/submission/${submissionId}`,
    );

    if (response.data.data.status != "QUEUED") {
      setOutput(response.data.data.stdOut);
      setStatus(response.data.data.status);
      console.log(response.data.data.stdOut);
    } else {
      await new Promise((r) => setTimeout(r, 3000));
      pollBackend(submissionId);
    }
  };

  return (
    <main className="grid h-[calc(100vh-64px)] grid-cols-2 overflow-hidden">
      <section className="min-w-0 border-r flex flex-col">
        <div className="h-12 border-b flex items-center justify-between px-4">
          <LanguageSelect language={language} setLanguage={setLanguage} />
        </div>

        <div className="flex-1 min-h-0">
          <EditorComp editorRef={editorRef} language={language} />
        </div>
      </section>

      {/* Right: Input and Output */}
      <section className="min-w-0 flex flex-col">
        {/* Input Section */}
        <div className="h-1/2 min-h-0 border-b flex flex-col p-4 gap-3">
          <button
            className="bg-blue-600 text-white rounded px-6 py-2 w-fit"
            onClick={() => handleRun()}
          >
            Run
          </button>

          <textarea
            value={stdIn}
            onChange={(e) => {
              setStdIn(e.target.value);
            }}
            placeholder="Enter Input here"

            className="flex-1 min-h-0 resize-none rounded border bg-background p-3"
          />

          <p className="text-sm text-muted-foreground">
            If your code takes input, add it in the above box before running.
          </p>
        </div>

        {/* Output Section */}
        <div className="h-1/2 min-h-0 flex flex-col">
          <div className="h-12 border-b px-4 flex items-center justify-around">
            <div>Output </div>
            <div className="mx-5">Status : {status}</div>{" "}
          </div>

          <div className="flex-1 overflow-auto p-4">{output}</div>
        </div>
      </section>
    </main>
  );
}

export default Compiler;
