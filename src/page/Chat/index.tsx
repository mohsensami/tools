import React, { useState, useEffect, useRef } from "react";

interface Message {
  text: string;
  isSent: boolean;
}

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    ws.current = new WebSocket("wss://echo.websocket.org");

    ws.current.onopen = () => {
      setIsConnected(true);
      console.log("Connected to WebSocket");
    };

    ws.current.onmessage = (event) => {
      // Add received message to messages array
      setMessages((prev) => [...prev, { text: event.data, isSent: false }]);
    };

    ws.current.onclose = () => {
      setIsConnected(false);
      console.log("Disconnected from WebSocket");
    };

    // Cleanup on component unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      message.trim() &&
      ws.current &&
      ws.current.readyState === WebSocket.OPEN
    ) {
      // Send message
      ws.current.send(message);
      // Add sent message to messages array
      setMessages((prev) => [...prev, { text: message, isSent: true }]);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Chat Header */}
      <div className="bg-white shadow-md p-4">
        <h1 className="text-xl font-semibold text-gray-800">WebSocket Chat</h1>
        <div className="text-sm text-gray-500">
          Status: {isConnected ? "Connected" : "Disconnected"}
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.isSent ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`${
                msg.isSent
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              } rounded-lg py-2 px-4 max-w-[70%]`}
            >
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t p-4">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            disabled={!isConnected}
          />
          <button
            type="submit"
            className={`${
              isConnected
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
            } text-white px-6 py-2 rounded-lg transition-colors`}
            disabled={!isConnected}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
