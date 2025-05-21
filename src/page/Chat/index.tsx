import React, { useState } from "react";

function Chat() {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // WebSocket connection will be implemented in the next step
    setMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Chat Header */}
      <div className="bg-white shadow-md p-4">
        <h1 className="text-xl font-semibold text-gray-800">WebSocket Chat</h1>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Messages will be displayed here */}
        <div className="flex justify-end">
          <div className="bg-blue-500 text-white rounded-lg py-2 px-4 max-w-[70%]">
            <p>Hello! This is a sample message.</p>
          </div>
        </div>
        <div className="flex justify-start">
          <div className="bg-gray-200 rounded-lg py-2 px-4 max-w-[70%]">
            <p>This is a received message.</p>
          </div>
        </div>
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
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
