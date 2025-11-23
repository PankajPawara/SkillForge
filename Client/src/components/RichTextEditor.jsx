import React from "react";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const RichTextEditor = ({ input, setInput }) => {
  return (
    <div data-color-mode="light">
      <MDEditor
        value={input.description}
        onChange={(value) => setInput({ ...input, description: value || "" })}
      />
    </div>
  );
};

export default RichTextEditor;