import { getColorClassForPowerSupply } from "@/utils";
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

const ramData = {
  Module: ["DDR4", "DDR5"],
  Number: [1, 2, 4],
  PowerConsumption: {
    DDR4: { 1: 5, 2: 10, 4: 20 },
    DDR5: { 1: 6, 2: 12, 4: 24 },
  },
};

const storageData = {
  Type: ["SSD", "M.2", "HDD"],
  Number: [1, 2, 4],
  PowerConsumption: {
    SSD: { 1: 3, 2: 6, 4: 12 },
    "M.2": { 1: 5, 2: 10, 4: 20 },
    HDD: { 1: 6, 2: 12, 4: 24 },
  },
};

const PowerSupply = () => {
  const [brand, setBrand] = useState("");
  const [socket, setSocket] = useState("");
  const [model, setModel] = useState("");
  const [ramModule, setRamModule] = useState("");
  const [ramNumber, setRamNumber] = useState("");
  const [storageType, setStorageType] = useState("");
  const [storageNumber, setStorageNumber] = useState("");

  const handleBrandChange = (e) => {
    setBrand(e.target.value);
    setSocket("");
    setModel("");
  };

  const handleSocketChange = (e) => {
    setSocket(e.target.value);
    setModel("");
  };

  const totalPower =
    (model ? cpuData.PowerConsumption[model] : 0) +
    (ramModule && ramNumber
      ? ramData.PowerConsumption[ramModule][ramNumber]
      : 0) +
    (storageType && storageNumber
      ? storageData.PowerConsumption[storageType][storageNumber]
      : 0);

  const colorClass = getColorClassForPowerSupply(totalPower);

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md w-full">
      <div className="grid grid-cols-2">
        <div>
          <h2 className="text-xl font-bold mb-4">Power Supply Calculator</h2>
          <label className="block text-sm font-medium">CPU Brand</label>
          <select
            className="w-full p-2 border rounded mb-2"
            onChange={handleBrandChange}
          >
            <option value="">Please select</option>
            {Object.keys(cpuData.Brand).map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          <label className="block text-sm font-medium">Socket</label>
          <select
            className="w-full p-2 border rounded mb-2"
            onChange={handleSocketChange}
            disabled={!brand}
          >
            <option value="">Please select</option>
            {brand &&
              cpuData.Brand[brand].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
          </select>

          <label className="block text-sm font-medium">Model</label>
          <select
            className="w-full p-2 border rounded mb-2"
            onChange={(e) => setModel(e.target.value)}
            disabled={!socket}
          >
            <option value="">Please select</option>
            {socket &&
              cpuData.Socket[socket].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
          </select>

          <hr className="my-2" />

          <label className="block text-sm font-medium">Memory Module</label>
          <select
            className="w-full p-2 border rounded mb-2"
            onChange={(e) => setRamModule(e.target.value)}
          >
            <option value="">Please select</option>
            {ramData.Module.map((mod) => (
              <option key={mod} value={mod}>
                {mod}
              </option>
            ))}
          </select>

          <label className="block text-sm font-medium">Number of RAM</label>
          <select
            className="w-full p-2 border rounded mb-2"
            onChange={(e) => setRamNumber(parseInt(e.target.value))}
            disabled={!ramModule}
          >
            <option value="">Please select</option>
            {ramModule &&
              ramData.Number.map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
          </select>

          <label className="block text-sm font-medium">Storage Type</label>
          <select
            className="w-full p-2 border rounded mb-2"
            onChange={(e) => setStorageType(e.target.value)}
          >
            <option value="">Please select</option>
            {storageData.Type.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <label className="block text-sm font-medium">Number of Storage</label>
          <select
            className="w-full p-2 border rounded mb-2"
            onChange={(e) => setStorageNumber(parseInt(e.target.value))}
            disabled={!storageType}
          >
            <option value="">Please select</option>
            {storageType &&
              storageData.Number.map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
          </select>
        </div>

        <div className="mt-4 text-3xl font-bold flex justify-center items-center">
          Total Power: <span className={colorClass}>{totalPower}</span>W
        </div>
      </div>
    </div>
  );
};

export default PowerSupply;
