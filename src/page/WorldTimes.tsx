import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface Country {
  name: {
    common: string;
  };
  cca2: string;
  timezones: string[];
}

// Helper function to convert UTC offset to IANA timezone
const getIANATimezone = (utcOffset: string): string => {
  // Common timezone mappings
  const timezoneMap: { [key: string]: string } = {
    "UTC+03:30": "Asia/Tehran", // Iran
    "UTC+01:00": "Europe/Paris", // Most of Western Europe
    "UTC-05:00": "America/New_York", // Eastern Time
    "UTC-08:00": "America/Los_Angeles", // Pacific Time
    "UTC+00:00": "Europe/London", // UK
    "UTC+09:00": "Asia/Tokyo", // Japan
    "UTC+08:00": "Asia/Shanghai", // China
    "UTC+05:30": "Asia/Kolkata", // India
    "UTC+10:00": "Australia/Sydney", // Eastern Australia
    "UTC+02:00": "Europe/Athens", // Eastern Europe
  };

  // Try to find a direct match
  if (timezoneMap[utcOffset]) {
    return timezoneMap[utcOffset];
  }

  // If no direct match, try to find the closest match
  const offset = parseInt(utcOffset.replace("UTC", "").split(":")[0]);
  const sign = utcOffset.includes("+") ? 1 : -1;
  const totalOffset = offset * sign;

  // Find the closest timezone
  const closest = Object.entries(timezoneMap).reduce(
    (closest, [key, value]) => {
      const currentOffset =
        parseInt(key.replace("UTC", "").split(":")[0]) *
        (key.includes("+") ? 1 : -1);
      const currentDiff = Math.abs(currentOffset - totalOffset);
      const closestDiff = Math.abs(
        parseInt(closest[0].replace("UTC", "").split(":")[0]) *
          (closest[0].includes("+") ? 1 : -1) -
          totalOffset
      );
      return currentDiff < closestDiff ? [key, value] : closest;
    },
    ["UTC+00:00", "Europe/London"]
  );

  return closest[1];
};

const fetchCountries = async (): Promise<Country[]> => {
  const response = await fetch("https://restcountries.com/v3.1/all");
  if (!response.ok) {
    throw new Error("Failed to fetch countries");
  }
  return response.json();
};

const WorldTimes = () => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");

  const { data: countries, isLoading: isLoadingCountries } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
  });

  useEffect(() => {
    if (!selectedCountry?.timezones?.[0]) return;

    const updateTime = () => {
      try {
        const ianaTimezone = getIANATimezone(selectedCountry.timezones[0]);
        const now = new Date();
        const timeString = now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: ianaTimezone,
        });
        setCurrentTime(timeString);
      } catch (error) {
        console.error("Error updating time:", error);
        setCurrentTime("--:--:--");
      }
    };

    // Update immediately
    updateTime();

    // Update every second
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, [selectedCountry]);

  const handleCountryChange = (countryCode: string) => {
    const country = countries?.find((c) => c.cca2 === countryCode);
    setSelectedCountry(country || null);
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
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a country</option>
              {isLoadingCountries ? (
                <option disabled>Loading countries...</option>
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
            {selectedCountry && (
              <div className="mb-4 text-lg font-medium text-gray-700">
                Time in {selectedCountry.name.common}
              </div>
            )}
            <div className="text-4xl font-bold text-gray-800">
              {currentTime || "--:--:--"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldTimes;
