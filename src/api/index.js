import axios from 'axios';

const URL = 'https://api.openweathermap.org/data/2.5/weather';
const API_KEY = 'ab3d8a663bf1ef42a7f37d1641a6982e';

export const fetchWeather = async (query) => {
    const { data } = await axios.get(URL, {
        params: {
            q: query,
            APPID: API_KEY,
            units: 'metric',
            lang: 'fa',
        },
    });
    return data;
};
