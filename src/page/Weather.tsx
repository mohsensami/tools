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

  const getWeatherData = async () => {
    const { data } = await axios(
      `${BASE_URL}/weather?q=${query}&appid=${API_KEY}`
    );
    return data;
  };

  const getForecastData = async () => {
    const { data } = await axios(
      `${BASE_URL}/forecast?q=${query}&appid=${API_KEY}`
    );
    return data;
  };

  const weatherData = useQuery({
    queryKey: ["weather-data", query],
    queryFn: getWeatherData,
    staleTime: 600000,
  });

  const forecastData = useQuery({
    queryKey: ["forecast-data", query],
    queryFn: getForecastData,
    staleTime: 600000,
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    weatherData.refetch();
    forecastData.refetch();
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

      {weatherData.isLoading || weatherData.isFetching ? (
        <div className="flex justify-center mx-auto max-w-sm rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6">
          <Spinner />
        </div>
      ) : weatherData?.data?.name ? (
        <div className="mx-auto max-w-sm rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">
                {weatherData.data?.name}, {weatherData.data?.sys?.country}
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

          <div className="text-center mb-6">
            <p className="text-5xl font-bold">
              {Math.round(weatherData.data?.main.temp - 273.15)}°C
            </p>
            <p className="text-sm">
              Feels like{" "}
              {Math.round(weatherData.data?.main.feels_like - 273.15)}°C
            </p>
          </div>

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
              <span>Visibility: {weatherData.data?.visibility / 1000} km</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>📊</span>
              <span>Pressure: {weatherData.data?.main.pressure} hPa</span>
            </div>
          </div>

          {forecastData?.data?.list && (
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-2">Next 3 Days Forecast</h3>
              <div className="space-y-3">
                {forecastData.data.list
                  .filter((_, index) => index % 8 === 0)
                  .slice(0, 3)
                  .map((day, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg shadow text-black"
                    >
                      <p className="font-semibold">
                        {new Date(day.dt * 1000).toDateString()}
                      </p>
                      <p>Temp: {Math.round(day.main.temp - 273.15)}°C</p>
                      <p>Weather: {day.weather[0].description}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>empty</p>
      )}
    </div>
  );
};

export default Weather;
