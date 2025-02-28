import { useState } from "react";

export default function QrCode() {
  const [data, setData] = useState("Example");
  const [size, setSize] = useState("150x150");
  const [qrSrc, setQrSrc] = useState("");

  const generateQRCode = () => {
    setQrSrc(
      `https://api.qrserver.com/v1/create-qr-code/?size=${size}&data=${encodeURIComponent(
        data
      )}`
    );
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">QR Code Generator</h1>
      <input
        type="text"
        value={data}
        onChange={(e) => setData(e.target.value)}
        className="border p-2 rounded w-64 mb-4"
        placeholder="Enter data"
      />
      <select
        value={size}
        onChange={(e) => setSize(e.target.value)}
        className="border p-2 rounded w-64 mb-4"
      >
        <option value="150x150">150x150</option>
        <option value="200x200">200x200</option>
        <option value="250x250">250x250</option>
        <option value="300x300">300x300</option>
      </select>
      <button
        onClick={generateQRCode}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Generate QR Code
      </button>
      {qrSrc && <img src={qrSrc} alt="QR Code" className="mt-4 border p-2" />}
    </div>
  );
}
