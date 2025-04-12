import React, { useState, useEffect } from "react";
import axios from "axios";

interface TimeZone {
  timezone: string;
  datetime: string;
  country_code: string;
}

interface Country {
  name: string;
  code: string;
}

interface City {
  name: string;
  country_code: string;
  timezone: string;
}

const ClockDisplay: React.FC<{ datetime: string }> = ({ datetime }) => {
  const [time, setTime] = useState(new Date(datetime));

  useEffect(() => {
    setTime(new Date(datetime));
    const interval = setInterval(() => {
      setTime(new Date(datetime));
    }, 1000);
    return () => clearInterval(interval);
  }, [datetime]);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDegrees = ((hours % 12) + minutes / 60) * 30;
  const minuteDegrees = (minutes + seconds / 60) * 6;
  const secondDegrees = seconds * 6;

  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Clock face */}
      <div className="absolute inset-0 rounded-full border-8 border-gray-200 bg-white shadow-lg">
        {/* Hour markers */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-4 bg-gray-600"
            style={{
              left: "50%",
              top: "0",
              transform: `rotate(${i * 30}deg) translateY(-120px)`,
              transformOrigin: "50% 120px",
            }}
          />
        ))}

        {/* Hands */}
        <div
          className="absolute w-2 h-20 bg-gray-800 rounded-full"
          style={{
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -100%) rotate(${hourDegrees}deg)`,
            transformOrigin: "50% 100%",
          }}
        />
        <div
          className="absolute w-1.5 h-24 bg-gray-600 rounded-full"
          style={{
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -100%) rotate(${minuteDegrees}deg)`,
            transformOrigin: "50% 100%",
          }}
        />
        <div
          className="absolute w-1 h-28 bg-red-500 rounded-full"
          style={{
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -100%) rotate(${secondDegrees}deg)`,
            transformOrigin: "50% 100%",
          }}
        />

        {/* Center dot */}
        <div
          className="absolute w-4 h-4 bg-gray-800 rounded-full"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      {/* Digital time display */}
      <div className="absolute bottom-0 left-0 right-0 text-center text-xl font-mono text-gray-700">
        {time.toLocaleTimeString()}
      </div>
    </div>
  );
};

const WorldTimes = () => {
  const [selectedTime, setSelectedTime] = useState<TimeZone | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [displayMode, setDisplayMode] = useState<"text" | "clock">("text");

  // Fetch all countries
  const fetchCountries = async () => {
    setLoadingCountries(true);
    try {
      const response = await axios.get(
        "https://countriesnow.space/api/v0.1/countries"
      );
      if (response.data && response.data.data) {
        const countriesList = response.data.data.map((country: string) => ({
          name: country,
          code: country.toLowerCase().replace(/\s+/g, "-"),
        }));
        countriesList.sort((a: Country, b: Country) =>
          a.name.localeCompare(b.name)
        );
        setCountries(countriesList);
      }
    } catch (err) {
      console.error("Error fetching countries:", err);
      // Fallback data
      setCountries([
        { name: "Iran", code: "iran" },
        { name: "United States", code: "united-states" },
        { name: "United Kingdom", code: "united-kingdom" },
        { name: "Japan", code: "japan" },
        { name: "France", code: "france" },
        { name: "Germany", code: "germany" },
        { name: "China", code: "china" },
        { name: "Australia", code: "australia" },
      ]);
    } finally {
      setLoadingCountries(false);
    }
  };

  // Fetch cities for selected country
  const fetchCities = async (country: string) => {
    setLoadingCities(true);
    try {
      const response = await axios.get(
        `https://countriesnow.space/api/v0.1/countries/cities`,
        { params: { country } }
      );
      if (response.data && response.data.data) {
        const citiesList = response.data.data.map((city: string) => ({
          name: city,
          country_code: country,
          timezone: `${country}/${city}`.replace(/\s+/g, "_"),
        }));
        citiesList.sort((a: City, b: City) => a.name.localeCompare(b.name));
        setCities(citiesList);
      }
    } catch (err) {
      console.error("Error fetching cities:", err);
      // Fallback data for Iran
      if (country === "Iran") {
        setCities([
          { name: "Tehran", country_code: "Iran", timezone: "Asia/Tehran" },
          { name: "Mashhad", country_code: "Iran", timezone: "Asia/Tehran" },
          { name: "Isfahan", country_code: "Iran", timezone: "Asia/Tehran" },
          { name: "Karaj", country_code: "Iran", timezone: "Asia/Tehran" },
          { name: "Shiraz", country_code: "Iran", timezone: "Asia/Tehran" },
        ]);
      } else {
        setCities([]);
      }
    } finally {
      setLoadingCities(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      fetchCities(selectedCountry);
    } else {
      setCities([]);
      setSelectedCity("");
    }
  }, [selectedCountry]);

  const fetchTime = async (timezone: string) => {
    setLoading(true);
    setError("");

    const response = await axios.get(
      `https://timeapi.io/api/Time/current/zone?timeZone=${timezone}`
    );
    setLoading(false);
    setSelectedTime({
      timezone: timezone,
      datetime: response.data.dateTime,
      country_code: selectedCity,
    });
  };

  useEffect(() => {
    if (selectedCity && !loadingCities) {
      const city = cities.find((c) => c.name === selectedCity);
      if (city) {
        fetchTime(city.timezone);
        const interval = setInterval(() => fetchTime(city.timezone), 60000);
        return () => clearInterval(interval);
      }
    }
  }, [selectedCity, loadingCities]);

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(event.target.value);
    setSelectedCity("");
    setSelectedTime(null);
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(event.target.value);
  };

  const formatTime = (datetime: string) => {
    const date = new Date(datetime);
    const timeString = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    const dateString = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      weekday: "long",
    });
    return { timeString, dateString };
  };

  return (
    <div className="p-5 max-w-2xl mx-auto mt-10 bg-white rounded-2xl shadow-md">
      <h1 className="text-center mb-8 text-3xl text-gray-700">World Time</h1>

      <div className="mb-8 flex gap-3 items-center justify-center">
        <select
          value={selectedCountry}
          onChange={handleCountryChange}
          disabled={loadingCountries}
          className={`
            p-3 text-base rounded-lg border border-gray-300 w-48
            ${loadingCountries ? "cursor-wait opacity-70" : "cursor-pointer"}
            focus:outline-none focus:ring-2 focus:ring-blue-500
          `}
        >
          <option value="">Select Country</option>
          {loadingCountries ? (
            <option>Loading countries...</option>
          ) : (
            countries.map((country) => (
              <option key={country.code} value={country.name}>
                {country.name}
              </option>
            ))
          )}
        </select>

        <select
          value={selectedCity}
          onChange={handleCityChange}
          disabled={loadingCities || !selectedCountry}
          className={`
            p-3 text-base rounded-lg border border-gray-300 w-48
            ${
              loadingCities || !selectedCountry
                ? "cursor-wait opacity-70"
                : "cursor-pointer"
            }
            focus:outline-none focus:ring-2 focus:ring-blue-500
          `}
        >
          <option value="">Select City</option>
          {loadingCities ? (
            <option>Loading cities...</option>
          ) : (
            cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))
          )}
        </select>

        <button
          onClick={() => {
            const city = cities.find((c) => c.name === selectedCity);
            if (city) {
              fetchTime(city.timezone);
            }
          }}
          // disabled={
          //   loading || loadingCities || !selectedCountry || !selectedCity
          // }
          className={`
            px-5 py-3 rounded-lg text-white text-base transition-colors
            ${
              loadingCities || !selectedCountry || !selectedCity
                ? "bg-gray-400 "
                : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
            }
          `}
        >
          Get Time
          {/* {loading ? "Refreshing..." : "Get Time"} */}
        </button>
      </div>

      {/* Display mode toggle */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-lg border border-gray-200 p-1">
          <button
            onClick={() => setDisplayMode("text")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              displayMode === "text"
                ? "bg-blue-500 text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Text
          </button>
          <button
            onClick={() => setDisplayMode("clock")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              displayMode === "clock"
                ? "bg-blue-500 text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Clock
          </button>
        </div>
      </div>

      {(loadingCountries || loadingCities) && (
        <div className="text-center py-5">Loading time...</div>
      )}

      {error && (
        <div className="text-center p-5 text-red-600 bg-red-50 rounded-lg mb-5">
          {error}
        </div>
      )}

      {selectedTime &&
        !loading &&
        !loadingCountries &&
        !loadingCities &&
        !error && (
          <div className="text-center p-8 bg-gray-50 rounded-xl">
            <h2 className="text-gray-800 mb-4 text-2xl">
              {selectedTime.country_code}
            </h2>
            <p className="text-gray-500 text-sm mb-3">
              {selectedTime.timezone}
            </p>
            {displayMode === "text" ? (
              <div className="space-y-4">
                <div className="text-5xl font-mono font-bold text-gray-800 tracking-wider">
                  {formatTime(selectedTime.datetime).timeString}
                </div>
                <div className="text-xl text-gray-600">
                  {formatTime(selectedTime.datetime).dateString}
                </div>
              </div>
            ) : (
              <ClockDisplay datetime={selectedTime.datetime} />
            )}
          </div>
        )}
    </div>
  );
};

export default WorldTimes;
