import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Spinner from '@/components/Spinner';

const API_KEY = '435b8ea52a70aa63e9e6a5f39d21241d';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const Weather = () => {
    const [query, setQuery] = useState('tehran');

    const getTrendingMovies = async () => {
        const { data } = await axios(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}`);
        console.log(data);
        return data;
    };
    const weatherData = useQuery({
        queryKey: ['weather-data', query],
        queryFn: getTrendingMovies,
        staleTime: 600000,
        // enabled: false,
    });

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        weatherData.refetch();
    };

    // const { name, main, weather, wind, sys, clouds, visibility, coord } = weatherData.data;
    //const temperature = (main.temp - 273.15).toFixed(1); // Convert Kelvin to Celsius
    //const countryFlagUrl = `https://flagcdn.com/w320/${sys.country.toLowerCase()}.png`;

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="flex gap-2 lg:w-1/2 mx-auto mb-4">
                    <Input onChange={(e: any) => setQuery(e.target.value)} value={query} />
                    <Button disabled={weatherData.isLoading} type="submit">
                        Search
                    </Button>
                </div>
            </form>
            {weatherData?.data?.name ? (
                <>
                    {weatherData.isLoading || weatherData.isFetching ? (
                        <Spinner />
                    ) : (
                        <div className="max-w-md mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-lg overflow-hidden">
                            <div className="p-6 text-white">
                                <h2 className="text-3xl font-bold mb-2 text-center">
                                    {weatherData.data.name}, {weatherData.data.sys.country}
                                </h2>
                                <img
                                    src={`https://flagcdn.com/w320/${weatherData?.data?.sys.country.toLowerCase()}.png`}
                                    alt={`Flag of ${weatherData?.data?.sys.country}`}
                                    className="w-16 h-10 mx-auto mb-2"
                                />
                                <div className="flex items-center justify-center mb-4">
                                    <img
                                        src={`http://openweathermap.org/img/wn/${weatherData.data.weather[0].icon}.png`}
                                        alt={weatherData.data.weather[0].description}
                                        className="w-16 h-16"
                                    />
                                    {/* <span className="text-5xl font-extrabold mx-4">{temperature}°C</span> */}
                                </div>
                                <p className="text-xl text-center">{weatherData.data?.weather[0].description}</p>
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="flex items-center bg-white bg-opacity-20 p-3 rounded-lg">
                                        <img
                                            src="https://img.icons8.com/ios-filled/50/ffffff/humidity.png"
                                            alt="Humidity"
                                            className="w-8 h-8 mr-2"
                                        />
                                        <span>Humidity: {weatherData.data?.main.humidity}%</span>
                                    </div>
                                    <div className="flex items-center bg-white bg-opacity-20 p-3 rounded-lg">
                                        <img
                                            src="https://img.icons8.com/ios-filled/50/ffffff/wind.png"
                                            alt="Wind Speed"
                                            className="w-8 h-8 mr-2"
                                        />
                                        <span>Wind: {weatherData.data?.wind.speed} m/s</span>
                                    </div>
                                    <div className="flex items-center bg-white bg-opacity-20 p-3 rounded-lg">
                                        <img
                                            src="https://img.icons8.com/ios-filled/50/ffffff/barometer.png"
                                            alt="Pressure"
                                            className="w-8 h-8 mr-2"
                                        />
                                        <span>Pressure: {weatherData.data?.main.pressure} hPa</span>
                                    </div>
                                    <div className="flex items-center bg-white bg-opacity-20 p-3 rounded-lg">
                                        <img
                                            src="https://img.icons8.com/ios-filled/50/ffffff/sun.png"
                                            alt="Sunrise"
                                            className="w-8 h-8 mr-2"
                                        />
                                        <span>
                                            Sunrise:{' '}
                                            {new Date(weatherData.data?.sys.sunrise * 1000).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center bg-white bg-opacity-20 p-3 rounded-lg">
                                        <img
                                            src="https://img.icons8.com/ios-filled/50/ffffff/sunset.png"
                                            alt="Sunset"
                                            className="w-8 h-8 mr-2"
                                        />
                                        <span>
                                            Sunset: {new Date(weatherData.data?.sys.sunset * 1000).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center bg-white bg-opacity-20 p-3 rounded-lg">
                                        <img
                                            src="https://img.icons8.com/ios-filled/50/ffffff/cloud.png"
                                            alt="Cloud Coverage"
                                            className="w-8 h-8 mr-2"
                                        />
                                        <span>Clouds: {weatherData.data?.clouds.all}%</span>
                                    </div>
                                    <div className="flex items-center bg-white bg-opacity-20 p-3 rounded-lg">
                                        <img
                                            src="https://img.icons8.com/ios-filled/50/ffffff/visibility.png"
                                            alt="Visibility"
                                            className="w-8 h-8 mr-2"
                                        />
                                        <span>Visibility: {weatherData.data?.visibility / 1000} km</span>
                                    </div>
                                    <div className="flex items-center bg-white bg-opacity-20 p-3 rounded-lg">
                                        <img
                                            src="https://img.icons8.com/ios-filled/50/ffffff/coordinates.png"
                                            alt="Coordinates"
                                            className="w-8 h-8 mr-2"
                                        />
                                        <span>
                                            Coords: {weatherData.data?.coord.lat}, {weatherData.data?.coord.lon}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div>Empty</div>
            )}
        </div>
    );
};

export default Weather;
