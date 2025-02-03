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

const PowerSupply = () => {
  const [brand, setBrand] = useState("Not Selected");
  const [socket, setSocket] = useState("Not Selected");
  const [model, setModel] = useState("Not Selected");
  const [ramType, setRamType] = useState("Not Selected");
  const [ramNumber, setRamNumber] = useState("Not Selected");
  const [storageType, setStorageType] = useState("Not Selected");
  const [storageNumber, setStorageNumber] = useState("Not Selected");
  const [powerSupply, setPowerSupply] = useState(null);

  const handleBrandChange = (e) => {
    setBrand(e.target.value);
    setSocket("Not Selected");
    setModel("Not Selected");
    setPowerSupply(null);
  };

  const handleSocketChange = (e) => {
    setSocket(e.target.value);
    setModel("Not Selected");
    setPowerSupply(null);
  };

  const handleModelChange = (e) => {
    setModel(e.target.value);
    if (e.target.value !== "Not Selected") {
      const selectedModel = data.cpu[brand][socket].models.find(
        (m) => m.name === e.target.value
      );
      setPowerSupply(selectedModel ? selectedModel.power : null);
    } else {
      setPowerSupply(null);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md w-full">
      <div className="grid grid-cols-2">
        <div className="p-4 space-y-4">
          {/* CPU Section */}
          <h2 className="text-lg font-semibold">Select CPU</h2>

          <label>Brand:</label>
          <select
            value={brand}
            onChange={handleBrandChange}
            className="p-2 border rounded"
          >
            <option>Not Selected</option>
            {Object.keys(data.cpu).map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          <label>Socket:</label>
          <select
            value={socket}
            onChange={handleSocketChange}
            className="p-2 border rounded"
          >
            <option>Not Selected</option>
            {brand !== "Not Selected" &&
              Object.keys(data.cpu[brand]).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
          </select>

          <label>Model:</label>
          <select
            value={model}
            onChange={handleModelChange}
            className="p-2 border rounded"
          >
            <option>Not Selected</option>
            {socket !== "Not Selected" &&
              data.cpu[brand][socket].models.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name}
                </option>
              ))}
          </select>

          {/* RAM Section */}
          <h2 className="text-lg font-semibold mt-4">Select RAM</h2>

          <label>Memory Module:</label>
          <select
            value={ramType}
            onChange={(e) => setRamType(e.target.value)}
            className="p-2 border rounded"
          >
            <option>Not Selected</option>
            {data.ram["Memory Module"].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <label>Number of RAM Modules:</label>
          <select
            value={ramNumber}
            onChange={(e) => setRamNumber(e.target.value)}
            className="p-2 border rounded"
          >
            <option>Not Selected</option>
            {data.ram.Number.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          {/* Storage Section */}
          <h2 className="text-lg font-semibold mt-4">Select Storage</h2>

          <label>Storage Type:</label>
          <select
            value={storageType}
            onChange={(e) => setStorageType(e.target.value)}
            className="p-2 border rounded"
          >
            <option>Not Selected</option>
            {data.storage.Type.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <label>Number of Storage Devices:</label>
          <select
            value={storageNumber}
            onChange={(e) => setStorageNumber(e.target.value)}
            className="p-2 border rounded"
          >
            <option>Not Selected</option>
            {data.storage.Number.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          {/* Power Supply Recommendation */}
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
