import React, { useState, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// DeepSeek API endpoint
const API_URL = "https://api.deepseek.com/v1/chat/completions";

const DeepSeek = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const key = import.meta.env.VITE_DEEPSEEK_API_KEY;
    if (!key) {
      console.error("API key not found in environment variables");
      return;
    }
    setApiKey(key);
    // Log the first few characters of the API key for debugging
    console.log("API Key loaded:", key.substring(0, 7) + "...");
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    if (!apiKey) {
      const errorMessage: Message = {
        role: "assistant",
        content: "Error: API key not configured. Please check your .env file.",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
      return;
    }

    const userMessage: Message = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error Response:", errorData);
        throw new Error(
          `API Error: ${response.status} ${JSON.stringify(errorData, null, 2)}`
        );
      }

      const data = await response.json();
      console.log("API Success Response:", data);

      const aiMessage: Message = {
        role: "assistant",
        content: data.choices[0].message.content,
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error: any) {
      console.error("Full Error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: `Error: ${error.message}`,
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <h2>DeepSeek Chat</h2>
      <div
        style={{
          border: "1px solid #ddd",
          padding: 10,
          height: 400,
          overflowY: "auto",
          marginBottom: 10,
        }}
      >
        {messages.map((msg, index) => (
          <p
            key={index}
            style={{ textAlign: msg.role === "user" ? "right" : "left" }}
          >
            <strong>{msg.role === "user" ? "You" : "AI"}:</strong> {msg.content}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type a message..."
        style={{ width: "80%", padding: 10 }}
      />
      <button onClick={sendMessage} style={{ padding: 10, marginLeft: 5 }}>
        Send
      </button>
    </div>
  );
};

export default DeepSeek;
