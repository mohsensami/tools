import { getColorClassForPowerSupply } from "@/utils";
import { useState } from "react";

const data = {
  cpu: {
    AMD: {
      AM5: {
        models: [
          { name: "Ryzen R9 9950X", power: 170 },
          { name: "Ryzen R9 9900", power: 150 },
          { name: "Ryzen R7 7800X", power: 120 },
          { name: "Ryzen R5 7600X", power: 105 },
        ],
      },
      AM4: {
        models: [
          { name: "Ryzen R9 5950X", power: 105 },
          { name: "Ryzen R7 5800X", power: 105 },
          { name: "Ryzen R5 5600X", power: 65 },
          { name: "Ryzen R3 3300X", power: 65 },
        ],
      },
    },
    Intel: {
      LGA1700: {
        models: [
          { name: "Core i9-13900K", power: 125 },
          { name: "Core i7-13700K", power: 105 },
          { name: "Core i5-13600K", power: 85 },
        ],
      },
      LGA1200: {
        models: [
          { name: "Core i9-11900K", power: 125 },
          { name: "Core i7-11700K", power: 95 },
          { name: "Core i5-11600K", power: 65 },
        ],
      },
    },
  },
  ram: {
    "Memory Module": ["DDR4", "DDR5"],
    Number: [1, 2, 3, 4, 5, 6],
  },
  storage: {
    Type: ["HDD", "SSD", "M.2"],
    Number: [1, 2, 3, 4, 5, 6],
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
  const [powerSupply, setPowerSupply] = useState(null);

  const handleBrandChange = (e) => {
    setBrand(e.target.value);
    setSocket("");
    setModel("");
    setPowerSupply(null);
  };

  const handleSocketChange = (e) => {
    setSocket(e.target.value);
    setModel("");
    setPowerSupply(null);
  };

  const handleModelChange = (e) => {
    setModel(e.target.value);
    const selectedModel = cpuData[brand][socket].models.find(
      (m) => m.name === e.target.value
    );
    setPowerSupply(selectedModel ? selectedModel.power : null);
  };

  // const colorClass = getColorClassForPowerSupply(powerSupply);

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md w-full">
      <div className="grid grid-cols-2">
        <div className="p-4 space-y-4">
          <label className="block">Select Brand:</label>
          <select
            value={brand}
            onChange={handleBrandChange}
            className="p-2 border rounded"
          >
            <option value="">-- Select Brand --</option>
            {Object.keys(cpuData).map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {brand && (
            <>
              <label className="block">Select Socket:</label>
              <select
                value={socket}
                onChange={handleSocketChange}
                className="p-2 border rounded"
              >
                <option value="">-- Select Socket --</option>
                {Object.keys(cpuData[brand]).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </>
          )}

          {socket && (
            <>
              <label className="block">Select Model:</label>
              <select
                value={model}
                onChange={handleModelChange}
                className="p-2 border rounded"
              >
                <option value="">-- Select Model --</option>
                {cpuData[brand][socket].models.map((m) => (
                  <option key={m.name} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
            </>
          )}

          {powerSupply !== null && (
            <div className="mt-4 p-2 bg-gray-100 rounded">
              <strong>Recommended Power Supply:</strong> {powerSupply}W
            </div>
          )}
        </div>

        <div className="mt-4 text-3xl font-bold flex justify-center items-center">
          Total Power: <span>{powerSupply}</span>W
        </div>
      </div>
    </div>
  );
};

export default PowerSupply;
