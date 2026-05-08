import colors from '../constants/colors';

export const getWeatherIcon = (weatherCode, isNight = false) => {
  // OpenWeatherMap condition codes
  if (weatherCode >= 200 && weatherCode < 300) {
    return { icon: 'thunderstorm', color: colors.stormy };
  } else if (weatherCode >= 300 && weatherCode < 400) {
    return { icon: 'grain', color: colors.rainy };
  } else if (weatherCode >= 500 && weatherCode < 600) {
    return { icon: 'umbrella', color: colors.rainy };
  } else if (weatherCode >= 600 && weatherCode < 700) {
    return { icon: 'ac-unit', color: colors.snowy };
  } else if (weatherCode >= 700 && weatherCode < 800) {
    return { icon: 'cloud', color: colors.cloudy };
  } else if (weatherCode === 800) {
    return isNight
      ? { icon: 'nights-stay', color: colors.auroraBlue }
      : { icon: 'wb-sunny', color: colors.sunny };
  } else if (weatherCode > 800) {
    return { icon: 'cloud-queue', color: colors.cloudy };
  }
  return { icon: 'wb-sunny', color: colors.sunny };
};

export const getWeatherEmoji = (weatherCode, isNight = false) => {
  if (weatherCode >= 200 && weatherCode < 300) return '⛈️';
  if (weatherCode >= 300 && weatherCode < 400) return '🌦️';
  if (weatherCode >= 500 && weatherCode < 600) return '🌧️';
  if (weatherCode >= 600 && weatherCode < 700) return '❄️';
  if (weatherCode >= 700 && weatherCode < 800) return '🌫️';
  if (weatherCode === 800) return isNight ? '🌙' : '☀️';
  if (weatherCode > 800) return '⛅';
  return '☀️';
};

export const getBackgroundGradient = weatherCode => {
  if (weatherCode >= 200 && weatherCode < 300)
    return ['#1a1a2e', '#16213e', '#0f3460'];
  if (weatherCode >= 500 && weatherCode < 600)
    return ['#0A0E27', '#1A237E', '#283593'];
  if (weatherCode >= 600 && weatherCode < 700)
    return ['#E0F7FA', '#B2EBF2', '#80DEEA'];
  if (weatherCode === 800) return ['#0A0E27', '#1565C0', '#0277BD'];
  return ['#0A0E27', '#1A2A5E', '#1565C0'];
};

export const getWindDirection = degrees => {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(degrees / 45) % 8];
};

export const formatTemp = temp => `${Math.round(temp)}°`;

export const formatTime = timestamp => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatDay = timestamp => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString([], { weekday: 'short' });
};