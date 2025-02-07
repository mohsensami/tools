import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Spinner from "@/components/Spinner";

const API_KEY = "435b8ea52a70aa63e9e6a5f39d21241d";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const Weather = () => {
  const [query, setQuery] = useState("tehran");

  const getTrendingMovies = async () => {
    const { data } = await axios(
      `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}`
    );
    console.log(data);
    return data;
  };
  const weatherData = useQuery({
    queryKey: ["weather-data", query],
    queryFn: getTrendingMovies,
    staleTime: 600000,
    // enabled: false,
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    weatherData.refetch();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2 lg:w-1/2 mx-auto mb-4">
          <Input
            onChange={(e: any) => setQuery(e.target.value)}
            value={query}
          />
          <Button disabled={weatherData.isLoading} type="submit">
            Search
          </Button>
        </div>
      </form>

      <>
        {weatherData.isLoading || weatherData.isFetching ? (
          <div className="flex justify-center mx-auto max-w-sm rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6">
            <Spinner />
          </div>
        ) : (
          <>
            {weatherData?.data?.name ? (
              <div className="mx-auto max-w-sm rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6">
                {/* Location and Weather Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {weatherData.data?.name}, {weatherData.data?.country}
                    </h2>
                    <p className="text-sm capitalize">
                      {weatherData.data?.weather[0].description}
                    </p>
                  </div>
                  <img
                    src={`http://openweathermap.org/img/wn/${weatherData.data?.weather[0].icon}@2x.png`}
                    alt={weatherData.data?.weather[0].description}
                    className="w-16 h-16"
                  />
                </div>

                {/* Temperature */}
                <div className="text-center mb-6">
                  <p className="text-5xl font-bold">
                    {Math.round(weatherData.data?.main.temp - 273.15)}°C
                  </p>
                  <p className="text-sm">
                    Feels like{" "}
                    {Math.round(weatherData.data?.main.feels_like - 273.15)}°C
                  </p>
                </div>

                {/* Additional Weather Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <span>🌡️</span>
                    <span>Humidity: {weatherData.data?.main.humidity}%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>💨</span>
                    <span>Wind: {weatherData.data?.wind.speed} m/s</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🔍</span>
                    <span>
                      Visibility: {weatherData.data?.visibility / 1000} km
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>📊</span>
                    <span>Pressure: {weatherData.data?.main.pressure} hPa</span>
                  </div>
                </div>
              </div>
            ) : (
              <p>empty</p>
            )}
          </>
        )}
      </>
    </div>
  );
};

export default Weather;
