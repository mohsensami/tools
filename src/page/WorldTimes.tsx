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
    try {
      const response = await axios.get(
        `https://timeapi.io/api/Time/current/zone?timeZone=${timezone}`
      );
      setSelectedTime({
        timezone: timezone,
        datetime: response.data.dateTime,
        country_code: selectedCity,
      });
    } catch (err) {
      setError("Failed to fetch time. Please try again later.");
      console.error("Error fetching time:", err);
    } finally {
      setLoading(false);
    }
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
    return new Date(datetime).toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      month: "short",
      day: "numeric",
      weekday: "long",
    });
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
          disabled={
            loading || loadingCities || !selectedCountry || !selectedCity
          }
          className={`
            px-5 py-3 rounded-lg text-white text-base transition-colors
            ${
              loading || loadingCities || !selectedCountry || !selectedCity
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
            }
          `}
        >
          {loading ? "Refreshing..." : "Get Time"}
        </button>
      </div>

      {(loading || loadingCountries || loadingCities) && (
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
            <p className="text-gray-800 text-2xl font-bold">
              {formatTime(selectedTime.datetime)}
            </p>
          </div>
        )}
    </div>
  );
};

export default WorldTimes;
