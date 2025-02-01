import { useState } from "react";

const cpuData = {
  Brand: {
    Intel: ["LGA1700", "LGA1200"],
    AMD: ["AM4", "AM5"],
  },
  Socket: {
    LGA1700: ["Intel Core i9-13900K", "Intel Core i7-12700K"],
    LGA1200: ["Intel Core i7-10700K", "Intel Core i5-10600K"],
    AM4: ["AMD Ryzen 7 5800X", "AMD Ryzen 5 5600X"],
    AM5: ["AMD Ryzen 9 7950X", "AMD Ryzen 7 7700X"],
  },
  PowerConsumption: {
    "Intel Core i9-13900K": 125,
    "Intel Core i7-12700K": 105,
    "Intel Core i7-10700K": 95,
    "Intel Core i5-10600K": 125,
    "AMD Ryzen 9 7950X": 170,
    "AMD Ryzen 7 7700X": 105,
    "AMD Ryzen 7 5800X": 105,
    "AMD Ryzen 5 5600X": 65,
  },
};

const PowerSupply = () => {
  const [brand, setBrand] = useState("");
  const [socket, setSocket] = useState("");
  const [model, setModel] = useState("");

  const handleBrandChange = (e) => {
    setBrand(e.target.value);
    setSocket("");
    setModel("");
  };

  const handleSocketChange = (e) => {
    setSocket(e.target.value);
    setModel("");
  };

  const totalPower = model ? cpuData.PowerConsumption[model] : 0;

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md w-96">
      <h2 className="text-xl font-bold mb-4">Power Supply Calculator</h2>
      <label className="block text-sm font-medium">CPU Brand</label>
      <select
        className="w-full p-2 border rounded mb-2"
        onChange={handleBrandChange}
      >
        <option value="">Select Brand</option>
        {Object.keys(cpuData.Brand).map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>

      {brand && (
        <>
          <label className="block text-sm font-medium">Socket</label>
          <select
            className="w-full p-2 border rounded mb-2"
            onChange={handleSocketChange}
          >
            <option value="">Select Socket</option>
            {cpuData.Brand[brand].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </>
      )}

      {socket && (
        <>
          <label className="block text-sm font-medium">Model</label>
          <select
            className="w-full p-2 border rounded mb-2"
            onChange={(e) => setModel(e.target.value)}
          >
            <option value="">Select Model</option>
            {cpuData.Socket[socket].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </>
      )}

      <div className="mt-4 text-lg font-semibold">
        Total Power: {totalPower}W
      </div>
    </div>
  );
};

export default PowerSupply;
