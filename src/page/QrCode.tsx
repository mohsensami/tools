import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/Spinner";

export function QrCode() {
  const [data, setData] = useState("");
  const [size, setSize] = useState("300x300");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check system preference for dark mode
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDarkMode(true);
    }
  }, []);

  const fetchQRCode = async () => {
    if (!data.trim()) {
      setError("Please enter some data for the QR code");
      return null;
    }
    setError("");
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}&data=${encodeURIComponent(
      data
    )}`;
  };

  const {
    data: qrSrc,
    refetch,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["qr-code", data, size],
    queryFn: fetchQRCode,
    enabled: false,
  });

  const handleDownload = () => {
    if (!qrSrc) return;
    const link = document.createElement("a");
    link.href = qrSrc;
    link.download = `qrcode-${size}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = async () => {
    if (!qrSrc) return;
    try {
      await navigator.clipboard.writeText(qrSrc);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">QR Code Generator</h1>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {isDarkMode ? <span>🌙</span> : <span>🌞</span>}
            </button>
          </div>

          <div
            className={`rounded-lg shadow-lg p-6 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Enter Data
                </label>
                <input
                  type="text"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className={`w-full p-3 rounded-lg border ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                      : "bg-white border-gray-300 focus:border-blue-500"
                  } focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors`}
                  placeholder="Enter text or URL"
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  QR Code Size
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className={`w-full p-3 rounded-lg border ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                      : "bg-white border-gray-300 focus:border-blue-500"
                  } focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors`}
                >
                  <option value="150x150">Small (150x150)</option>
                  <option value="200x200">Medium (200x200)</option>
                  <option value="300x300">Large (300x300)</option>
                  <option value="450x450">Extra Large (450x450)</option>
                </select>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => refetch()}
                  className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Generate QR Code
                </button>
              </div>
            </div>

            {isLoading || isFetching ? (
              <div className="mt-8 flex justify-center">
                <Spinner />
              </div>
            ) : qrSrc ? (
              <div className="mt-8 space-y-4">
                <div className="flex justify-center">
                  <img
                    src={qrSrc}
                    alt="QR Code"
                    className={`border-2 ${
                      isDarkMode ? "border-gray-600" : "border-gray-200"
                    } rounded-lg p-2`}
                  />
                </div>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleDownload}
                    className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <span>Download</span>
                  </button>
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    <span>{copied ? "Copied!" : "Copy URL"}</span>
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
