import React, { useState, useEffect, useRef } from "react";
import ProfileSidebar from "../ProfileSidebar/ProfileSidebar.jsx"; // Adjust the import path as necessary
import Markdown from "react-markdown";


const markdownCommands = ["intro", "projects", "education", "about", "help", "aciv"];

export default function ConsolePortfolio() {
  const [history, setHistory] = useState(["Type 'help' to get started."]);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = async (cmd) => {
    if (!cmd) return;
    // let output;
    if (cmd === "clear") {
      setHistory(["Type 'help' to get started."]);
      return;
    }
    if (markdownCommands.includes(cmd.toLowerCase())) {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/markdown/${cmd.toLowerCase()}.md`);
        const text = await response.text();
        setHistory((prev) => [...prev, `> ${cmd}`, 
          <Markdown
            key={cmd}
            components={{
              p: ({ node, ...props }) => <p className="text-gray-300" {...props} />,
              li: ({ node, ...props }) => <li className="text-gray-300 ml-4 list-disc" {...props} />,
              code: ({ node, ...props }) => <code className="bg-gray-800 text-gray-200 px-1 rounded" {...props} />,
              // eslint-disable-next-line
              a: ({ node, ...props }) => (<a className="text-blue-400 hover:underline" {...props} />),
              
            }}
          >
            {text}
          </Markdown>
        ]);
      } catch (error) {
        setHistory((prev) => [...prev, `> ${cmd}`, `Error loading ${cmd}.md`]);
      }
    } else {
      setHistory((prev) => [...prev, `> ${cmd}`, `Unknown command: ${cmd}`]);
    }
    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(null);
  };

  // const typeText = (text) => {
  //   return text.split("\n");
  // };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && input.trim()) {
      handleCommand(input.trim());
      setInput("");
    } else if (e.key === "ArrowUp") {
      if (commandHistory.length) {
        const newIndex = historyIndex === null ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      if (historyIndex !== null) {
        const newIndex = Math.min(commandHistory.length - 1, historyIndex + 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex] || "");
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono flex">
      <ProfileSidebar />
      <div className="flex-1 overflow-y-auto whitespace-pre-wrap mb-0">
        <div className="max-w-7xl mx-auto">
          <div className="overflow-y-auto h-[90vh] whitespace-pre-wrap">
            {history.map((line, idx) => (
              <div key={idx}>{line}</div>
            ))}
            <div ref={bottomRef} />
          </div>
          <div className="bottom-10 left-4 right-4 flex items-center bg-black">
            <span className="mr-2">&gt;</span>
            <input
              className="bg-black border border-green-500 focus:outline-none focus:ring-0 text-green-500 w-full px-2 py-1 rounded font-mono"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
          <div><p className="text-green-500 ml-2"> press up and down arrow keys to get previous commands </p></div>
        </div>
      </div>
    </div>
  );
}
