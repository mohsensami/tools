import { getColorClassForPowerSupply } from "@/utils";
import { useEffect, useState } from "react";

interface CpuModel {
  name: string;
  power: number;
}

interface CpuSocket {
  models: CpuModel[];
}

interface CpuBrand {
  [key: string]: CpuSocket;
}

interface CpuData {
  [key: string]: CpuBrand;
}

interface RamModule {
  name: string;
  power: number;
}

interface StorageType {
  name: string;
  power: number;
}

interface Data {
  cpu: CpuData;
  ram: {
    modules: RamModule[];
    number: number[];
  };
  storage: {
    types: StorageType[];
    number: number[];
  };
}

const data: Data = {
  cpu: {
    AMD: {
      AM5: {
        models: [
          { name: "Ryzen R9 7950X", power: 170 },
          { name: "Ryzen R9 7900X", power: 170 },
          { name: "Ryzen R7 7800X3D", power: 120 },
          { name: "Ryzen R7 7700X", power: 105 },
          { name: "Ryzen R5 7600X", power: 105 },
          { name: "Ryzen R5 7600", power: 65 },
        ],
      },
      AM4: {
        models: [
          { name: "Ryzen R9 5950X", power: 105 },
          { name: "Ryzen R9 5900X", power: 105 },
          { name: "Ryzen R7 5800X3D", power: 105 },
          { name: "Ryzen R7 5800X", power: 105 },
          { name: "Ryzen R7 5700X", power: 65 },
          { name: "Ryzen R5 5600X", power: 65 },
          { name: "Ryzen R5 5600", power: 65 },
          { name: "Ryzen R3 3300X", power: 65 },
        ],
      },
    },
    Intel: {
      LGA1700: {
        models: [
          { name: "Core i9-13900K", power: 125 },
          { name: "Core i9-13900", power: 65 },
          { name: "Core i7-13700K", power: 125 },
          { name: "Core i7-13700", power: 65 },
          { name: "Core i5-13600K", power: 125 },
          { name: "Core i5-13600", power: 65 },
          { name: "Core i5-13500", power: 65 },
          { name: "Core i5-13400", power: 65 },
        ],
      },
      LGA1200: {
        models: [
          { name: "Core i9-11900K", power: 125 },
          { name: "Core i9-11900", power: 65 },
          { name: "Core i7-11700K", power: 125 },
          { name: "Core i7-11700", power: 65 },
          { name: "Core i5-11600K", power: 125 },
          { name: "Core i5-11600", power: 65 },
          { name: "Core i5-11500", power: 65 },
          { name: "Core i5-11400", power: 65 },
        ],
      },
    },
  },
  ram: {
    modules: [
      { name: "DDR4", power: 5 },
      { name: "DDR5", power: 7 },
    ],
    number: [1, 2, 3, 4, 5, 6],
  },
  storage: {
    types: [
      { name: "HDD", power: 8 },
      { name: "SSD", power: 4 },
      { name: "M.2", power: 3 },
    ],
    number: [1, 2, 3, 4, 5, 6],
  },
};

const PowerSupply = () => {
  const [brand, setBrand] = useState<string>("Not Selected");
  const [socket, setSocket] = useState<string>("Not Selected");
  const [model, setModel] = useState<string>("Not Selected");
  const [ramType, setRamType] = useState<string>("Not Selected");
  const [ramNumber, setRamNumber] = useState<number>(1);
  const [storageType, setStorageType] = useState<string>("Not Selected");
  const [storageNumber, setStorageNumber] = useState<number>(1);
  const [totalPower, setTotalPower] = useState<number>(0);

  useEffect(() => {
    let power = 0;

    // CPU Power
    if (
      brand !== "Not Selected" &&
      socket !== "Not Selected" &&
      model !== "Not Selected"
    ) {
      const selectedCpu = data.cpu[brand as keyof typeof data.cpu][
        socket
      ].models.find((m: CpuModel) => m.name === model);
      power += selectedCpu ? selectedCpu.power : 0;
    }

    // RAM Power
    if (ramType !== "Not Selected") {
      const selectedRam = data.ram.modules.find((r) => r.name === ramType);
      power += selectedRam ? selectedRam.power * ramNumber : 0;
    }

    // Storage Power
    if (storageType !== "Not Selected") {
      const selectedStorage = data.storage.types.find(
        (s) => s.name === storageType
      );
      power += selectedStorage ? selectedStorage.power * storageNumber : 0;
    }

    setTotalPower(power);
  }, [brand, socket, model, ramType, ramNumber, storageType, storageNumber]);

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 space-y-4 bg-white rounded-lg shadow">
          {/* CPU Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
              CPU Selection
            </h2>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Brand:
              </label>
              <select
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  setSocket("Not Selected");
                  setModel("Not Selected");
                }}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option>Not Selected</option>
                {Object.keys(data.cpu).map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Socket:
              </label>
              <select
                value={socket}
                onChange={(e) => {
                  setSocket(e.target.value);
                  setModel("Not Selected");
                }}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={brand === "Not Selected"}
              >
                <option>Not Selected</option>
                {brand !== "Not Selected" &&
                  Object.keys(data.cpu[brand as keyof typeof data.cpu]).map(
                    (s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    )
                  )}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Model:
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={socket === "Not Selected"}
              >
                <option>Not Selected</option>
                {socket !== "Not Selected" &&
                  data.cpu[brand as keyof typeof data.cpu][socket].models.map(
                    (m) => (
                      <option key={m.name} value={m.name}>
                        {m.name}
                      </option>
                    )
                  )}
              </select>
            </div>
          </div>

          {/* RAM Section */}
          <div className="space-y-4 mt-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
              RAM Selection
            </h2>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Memory Type:
              </label>
              <select
                value={ramType}
                onChange={(e) => setRamType(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option>Not Selected</option>
                {data.ram.modules.map((r) => (
                  <option key={r.name} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Number of Modules:
              </label>
              <select
                value={ramNumber}
                onChange={(e) => setRamNumber(Number(e.target.value))}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {data.ram.number.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Storage Section */}
          <div className="space-y-4 mt-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
              Storage Selection
            </h2>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Storage Type:
              </label>
              <select
                value={storageType}
                onChange={(e) => setStorageType(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option>Not Selected</option>
                {data.storage.types.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Number of Devices:
              </label>
              <select
                value={storageNumber}
                onChange={(e) => setStorageNumber(Number(e.target.value))}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {data.storage.number.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Power Supply Calculator
          </h2>
          <div className="text-center">
            <p className="text-lg text-gray-600 mb-2">
              Total Power Consumption:
            </p>
            <p className="text-4xl font-bold text-blue-600">{totalPower}W</p>
            {totalPower > 0 && (
              <p className="mt-4 text-sm text-gray-500">
                Recommended PSU: {Math.ceil(totalPower * 1.2)}W
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PowerSupply;
