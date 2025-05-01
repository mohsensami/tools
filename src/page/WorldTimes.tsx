import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface Country {
  name: {
    common: string;
  };
  cca2: string;
}

const fetchCountries = async (): Promise<Country[]> => {
  const response = await fetch("https://restcountries.com/v3.1/all");
  if (!response.ok) {
    throw new Error("Failed to fetch countries");
  }
  return response.json();
};

const WorldTimes = () => {
  const [time, setTime] = useState(new Date());
  const [selectedCountry, setSelectedCountry] = useState("");

  const {
    data: countries,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
  });

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
          {/* Country Select Box */}
          <div className="space-y-2">
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700"
            >
              Select Country
            </label>
            <select
              id="country"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a country</option>
              {isLoading ? (
                <option disabled>Loading countries...</option>
              ) : error ? (
                <option disabled>Error loading countries</option>
              ) : (
                countries
                  ?.sort((a, b) => a.name.common.localeCompare(b.name.common))
                  .map((country) => (
                    <option key={country.cca2} value={country.cca2}>
                      {country.name.common}
                    </option>
                  ))
              )}
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
