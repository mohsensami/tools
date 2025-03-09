import React, { useState, useEffect } from "react";
import axios from "axios";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Using a CORS proxy
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
const API_URL = "https://api.openai.com/v1/chat/completions";

const ChatGpt = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const key = import.meta.env.VITE_OPENAI_API_KEY;
    if (!key) {
      console.error("OpenAI API key not found in environment variables");
      return;
    }
    setApiKey(key);
    console.log("API Key loaded:", key.substring(0, 12) + "...");
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    if (!apiKey) {
      const errorMessage: Message = {
        role: "assistant",
        content:
          "Error: OpenAI API key not configured. Please check your .env file.",
      };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      console.log("Sending request to OpenAI...");
      const response = await axios.post(
        `${CORS_PROXY}${API_URL}`,
        {
          model: "gpt-3.5-turbo",
          messages: [...messages, userMessage],
          temperature: 0.7,
          max_tokens: 2000,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            Origin: window.location.origin,
          },
        }
      );

      console.log("Response received:", response.data);
      const botMessage: Message = {
        role: "assistant",
        content: response.data.choices[0].message.content,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      console.error("Full error:", error);
      let errorMessage = "Failed to get response";

      if (error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Check for CORS-specific errors
      if (
        error.message?.includes("Network Error") ||
        error.message?.includes("CORS")
      ) {
        errorMessage =
          "CORS Error: Unable to access the API directly. Please set up a backend server or use a CORS proxy.";
      }

      const botErrorMessage: Message = {
        role: "assistant",
        content: `Error: ${errorMessage}`,
      };
      setMessages((prev) => [...prev, botErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>ChatGPT</h2>
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 20,
          height: 500,
          overflowY: "auto",
          marginBottom: 20,
          backgroundColor: "#f8f9fa",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: 15,
              textAlign: msg.role === "user" ? "right" : "left",
            }}
          >
            <div
              style={{
                display: "inline-block",
                maxWidth: "70%",
                padding: 12,
                borderRadius: 12,
                backgroundColor: msg.role === "user" ? "#007bff" : "#ffffff",
                color: msg.role === "user" ? "#ffffff" : "#000000",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ textAlign: "center", padding: 10 }}>Thinking...</div>
        )}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 8,
            border: "1px solid #ddd",
            resize: "none",
            minHeight: 50,
            fontFamily: "inherit",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          style={{
            padding: "0 20px",
            borderRadius: 8,
            border: "none",
            backgroundColor: "#007bff",
            color: "#ffffff",
            cursor: input.trim() ? "pointer" : "not-allowed",
            opacity: input.trim() ? 1 : 0.6,
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatGpt;
