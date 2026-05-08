import axios from 'axios';
import {WEATHER_API_KEY} from '@env';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const API_KEY = WEATHER_API_KEY || 'YOUR_API_KEY_HERE';

const weatherApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const getCurrentWeather = async (lat, lon) => {
  try {
    const response = await weatherApi.get('/weather', {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch weather');
  }
};

export const getForecast = async (lat, lon) => {
  try {
    const response = await weatherApi.get('/forecast', {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
        cnt: 40, // 5 days, 8 per day
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch forecast');
  }
};

export const getWeatherByCity = async cityName => {
  try {
    const response = await weatherApi.get('/weather', {
      params: {
        q: cityName,
        appid: API_KEY,
        units: 'metric',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'City not found');
  }
};

export const processDailyForecast = forecastList => {
  const dailyMap = {};
  forecastList.forEach(item => {
    const day = new Date(item.dt * 1000).toLocaleDateString([], {
      weekday: 'short',
    });
    if (!dailyMap[day]) {
      dailyMap[day] = {
        dt: item.dt,
        temps: [],
        weather: item.weather[0],
      };
    }
    dailyMap[day].temps.push(item.main.temp);
  });

  return Object.values(dailyMap)
    .slice(1, 6)
    .map(day => ({
      dt: day.dt,
      tempMax: Math.max(...day.temps),
      tempMin: Math.min(...day.temps),
      weather: day.weather,
    }));
};