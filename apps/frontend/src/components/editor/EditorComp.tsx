import React, { useState } from "react";
import { Editor } from "@monaco-editor/react";

const languageMap: Record<string, string> = {
  c: "c",
  js: "javascript",
  py: "python",
};

function EditorComp({ editorRef, language }: any) {
  return (
    <div>
      <Editor
        height="90vh"
        width="100%"
        language={languageMap[language] ?? "plaintext"}
        theme="vs-dark"
        onMount={(editor, monaco) => {
          editorRef.current = editor;
        }}

        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          padding: { top: 12 },
          wordWrap: "on",
          tabSize: 2,
          fontFamily: "Consolas, monospace",
        }}
      />
    </div>
  );
}

export default EditorComp;
