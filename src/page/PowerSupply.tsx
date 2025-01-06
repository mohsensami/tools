const PowerSupply = () => {
    return (
        <div>
            <div className="flex flex-col gap-2 bg-gray-100 p-6 min-h-screen items-center justify-center">
                <div className="max-w-2xl w-full bg-white text-black text-xl font-bold text-center p-6 rounded-lg shadow-md">
                    0 wat
                </div>
                <div className="max-w-2xl w-full bg-white p-6 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold mb-4 text-gray-800">PC Power Supply Calculator</h1>

                    {/* CPU Selection */}
                    <div className="mb-4">
                        <label htmlFor="cpu" className="block text-sm font-medium text-gray-700">
                            CPU
                        </label>
                        <select id="cpu" name="cpu" className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                            <option value="65">Intel i5-10400 (65W)</option>
                            <option value="125">Intel i9-10900K (125W)</option>
                            <option value="95">AMD Ryzen 5 3600X (95W)</option>
                            <option value="105">AMD Ryzen 9 3900X (105W)</option>
                        </select>
                    </div>

                    {/* GPU Selection */}
                    <div className="mb-4">
                        <label htmlFor="gpu" className="block text-sm font-medium text-gray-700">
                            GPU
                        </label>
                        <select id="gpu" name="gpu" className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                            <option value="150">NVIDIA GTX 1660 (150W)</option>
                            <option value="220">NVIDIA RTX 3080 (220W)</option>
                            <option value="180">AMD Radeon RX 5700 XT (180W)</option>
                            <option value="250">AMD Radeon RX 6900 XT (250W)</option>
                        </select>
                    </div>

                    {/* RAM Input */}
                    <div className="mb-4">
                        <label htmlFor="ram" className="block text-sm font-medium text-gray-700">
                            RAM (GB)
                        </label>
                        <input
                            type="number"
                            id="ram"
                            name="ram"
                            defaultValue="16"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    {/* Storage Input */}
                    <div className="mb-4">
                        <label htmlFor="storage" className="block text-sm font-medium text-gray-700">
                            Number of Storage Drives
                        </label>
                        <input
                            type="number"
                            id="storage"
                            name="storage"
                            defaultValue="1"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6">
                        <button
                            type="button"
                            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                        >
                            Calculate PSU Wattage
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PowerSupply;
