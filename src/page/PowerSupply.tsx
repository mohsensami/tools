import { useState } from "react";

const powerData = {
  CPU: {
    "Intel Core i9-13900K": 125,
    "AMD Ryzen 9 7950X": 170,
    "Intel Core i7-12700K": 105,
    "AMD Ryzen 7 7700X": 105,
  },
  GPU: {
    "NVIDIA RTX 4090": 450,
    "NVIDIA RTX 4080": 320,
    "AMD RX 7900 XTX": 355,
    "AMD RX 7800 XT": 263,
  },
  RAM: {
    "8GB DDR4": 5,
    "16GB DDR4": 10,
    "32GB DDR4": 15,
    "8GB DDR5": 6,
    "16GB DDR5": 12,
    "32GB DDR5": 18,
  },
  Storage: {
    "HDD 1TB": 10,
    "HDD 2TB": 12,
    "SSD 500GB": 3,
    "SSD 1TB": 5,
  },
  Motherboard: {
    ATX: 50,
    "Micro-ATX": 40,
    "Mini-ITX": 30,
  },
  Cooling: {
    "Air Cooler": 10,
    "Liquid Cooler AIO 240mm": 15,
    "Liquid Cooler AIO 360mm": 20,
  },
  Fans: {
    "120mm Fan": 3,
    "140mm Fan": 5,
  },
  Other: {
    "RGB Lighting": 10,
    "PCIe Card": 15,
  },
};

const PowerSupply = () => {
  const [selectedComponents, setSelectedComponents] = useState({});

  const handleChange = (category, value) => {
    setSelectedComponents((prev) => ({
      ...prev,
      [category]: powerData[category][value],
    }));
  };

  const totalPower = Object.values(selectedComponents).reduce(
    (sum, watt) => sum + watt,
    0
  );

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md w-96">
      <h2 className="text-xl font-bold mb-4">Power Supply Calculator</h2>
      {Object.keys(powerData).map((category) => (
        <div key={category} className="mb-2">
          <label className="block text-sm font-medium">{category}</label>
          <select
            className="w-full p-2 border rounded"
            onChange={(e) => handleChange(category, e.target.value)}
          >
            <option value="">Select {category}</option>
            {Object.keys(powerData[category]).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ))}
      <div className="mt-4 text-lg font-semibold">
        Total Power: {totalPower}W
      </div>
    </div>
  );
};

export default PowerSupply;
