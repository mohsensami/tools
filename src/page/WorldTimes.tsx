import { useState, useEffect } from "react";

const WorldTimes = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="space-y-6">
          {/* First Select Box */}
          <div className="space-y-2">
            <label
              htmlFor="country1"
              className="block text-sm font-medium text-gray-700"
            >
              Select Country 1
            </label>
            <select
              id="country1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a country</option>
              <option value="us">United States</option>
              <option value="uk">United Kingdom</option>
              <option value="jp">Japan</option>
            </select>
          </div>

          {/* Second Select Box */}
          <div className="space-y-2">
            <label
              htmlFor="country2"
              className="block text-sm font-medium text-gray-700"
            >
              Select Country 2
            </label>
            <select
              id="country2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a country</option>
              <option value="us">United States</option>
              <option value="uk">United Kingdom</option>
              <option value="jp">Japan</option>
            </select>
          </div>

          {/* Digital Clock */}
          <div className="mt-8 text-center">
            <div className="text-4xl font-bold text-gray-800">
              {formatTime(time)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldTimes;
