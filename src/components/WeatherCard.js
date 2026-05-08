import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import colors from '../constants/colors';
import WeatherDetail from './WeatherDetail';
import {
  getWeatherEmoji,
  formatTemp,
  formatTime,
  getWindDirection,
} from '../utils/weatherIcons';

const WeatherCard = ({weather}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [weather]);

  if (!weather) return null;

  const isNight = (() => {
    const now = Date.now() / 1000;
    return now < weather.sys.sunrise || now > weather.sys.sunset;
  })();

  const emoji = getWeatherEmoji(weather.weather[0].id, isNight);
  const windDir = getWindDirection(weather.wind.deg);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: fadeAnim,
          transform: [{translateY: slideAnim}, {scale: scaleAnim}],
        },
      ]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.city}>{weather.name}</Text>
          <Text style={styles.country}>{weather.sys.country}</Text>
        </View>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>

      {/* Temperature */}
      <View style={styles.tempRow}>
        <Text style={styles.temperature}>{formatTemp(weather.main.temp)}</Text>
        <View style={styles.tempDetails}>
          <Text style={styles.feelsLike}>
            Feels {formatTemp(weather.main.feels_like)}
          </Text>
          <Text style={styles.description}>
            {weather.weather[0].description.charAt(0).toUpperCase() +
              weather.weather[0].description.slice(1)}
          </Text>
          <View style={styles.hiLow}>
            <Text style={styles.hi}>↑ {formatTemp(weather.main.temp_max)}</Text>
            <Text style={styles.lo}>↓ {formatTemp(weather.main.temp_min)}</Text>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Details Grid */}
      <View style={styles.detailsRow}>
        <WeatherDetail
          icon="water-drop"
          label="Humidity"
          value={`${weather.main.humidity}%`}
        />
        <View style={styles.detailDivider} />
        <WeatherDetail
          icon="air"
          label="Wind"
          value={`${Math.round(weather.wind.speed)} m/s ${windDir}`}
        />
        <View style={styles.detailDivider} />
        <WeatherDetail
          icon="compress"
          label="Pressure"
          value={`${weather.main.pressure} hPa`}
        />
      </View>

      {/* Sun Times */}
      <View style={styles.sunRow}>
        <View style={styles.sunItem}>
          <Text style={styles.sunIcon}>🌅</Text>
          <Text style={styles.sunLabel}>Sunrise</Text>
          <Text style={styles.sunTime}>{formatTime(weather.sys.sunrise)}</Text>
        </View>
        <View style={styles.sunDivider} />
        <View style={styles.sunItem}>
          <Text style={styles.sunIcon}>🌇</Text>
          <Text style={styles.sunLabel}>Sunset</Text>
          <Text style={styles.sunTime}>{formatTime(weather.sys.sunset)}</Text>
        </View>
        <View style={styles.sunDivider} />
        <View style={styles.sunItem}>
          <Text style={styles.sunIcon}>👁️</Text>
          <Text style={styles.sunLabel}>Visibility</Text>
          <Text style={styles.sunTime}>
            {(weather.visibility / 1000).toFixed(1)} km
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.glassBg,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: 24,
    marginHorizontal: 20,
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  city: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  country: {
    color: colors.auroraBlue,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  emoji: {
    fontSize: 52,
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  temperature: {
    color: colors.textPrimary,
    fontSize: 80,
    fontWeight: '200',
    letterSpacing: -4,
    lineHeight: 80,
    marginRight: 16,
  },
  tempDetails: {
    paddingBottom: 6,
  },
  feelsLike: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 2,
  },
  description: {
    color: colors.auroraBlue,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  hiLow: {
    flexDirection: 'row',
    gap: 10,
  },
  hi: {
    color: '#FF8A65',
    fontSize: 13,
    fontWeight: '600',
  },
  lo: {
    color: '#4FC3F7',
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.glassBorder,
    marginBottom: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailDivider: {
    width: 1,
    backgroundColor: colors.glassBorder,
  },
  sunRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  sunItem: {
    alignItems: 'center',
    flex: 1,
  },
  sunDivider: {
    width: 1,
    backgroundColor: colors.glassBorder,
  },
  sunIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  sunLabel: {
    color: colors.textMuted,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  sunTime: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
});

export default WeatherCard;