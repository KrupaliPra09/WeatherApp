import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Animated,
  Alert,
  RefreshControl,
  PermissionsAndroid,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../constants/colors';
import WeatherCard from '../components/WeatherCard';
import HourlyForecast from '../components/HourlyForecast';
import DailyForecast from '../components/DailyForecast';
import {
  getCurrentWeather,
  getForecast,
  getWeatherByCity,
} from '../services/weatherService';
import {getBackgroundGradient} from '../utils/weatherIcons';

const HomeScreen = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const gradientColors = weather
    ? getBackgroundGradient(weather.weather[0].id)
    : [colors.gradientStart, colors.gradientMid, colors.gradientEnd];

const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    // Check if already granted
    const alreadyGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (alreadyGranted) return true;

    // Request both fine and coarse
    const grants = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);

    return (
      grants['android.permission.ACCESS_FINE_LOCATION'] ===
        PermissionsAndroid.RESULTS.GRANTED ||
      grants['android.permission.ACCESS_COARSE_LOCATION'] ===
        PermissionsAndroid.RESULTS.GRANTED
    );
  }
  return true;
};

// Replace fetchByLocation with this:
const fetchByLocation = useCallback(async () => {
  setLoading(true);
  setError(null);

  const hasPermission = await requestLocationPermission();

  if (!hasPermission) {
    setError('Location permission denied. Please enable it in Settings or search for a city.');
    setLoading(false);
    return;
  }

  Geolocation.getCurrentPosition(
    async position => {
      try {
        const {latitude, longitude} = position.coords;
        const [weatherData, forecastData] = await Promise.all([
          getCurrentWeather(latitude, longitude),
          getForecast(latitude, longitude),
        ]);
        setWeather(weatherData);
        setForecast(forecastData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    err => {
      setError('Could not get location. Make sure GPS is turned ON.');
      setLoading(false);
      setRefreshing(false);
    },
    {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
  );
}, []);

  useEffect(() => {
    fetchByLocation();
  }, [fetchByLocation]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setError(null);
    try {
      const weatherData = await getWeatherByCity(searchQuery.trim());
      const forecastData = await getForecast(
        weatherData.coord.lat,
        weatherData.coord.lon,
      );
      setWeather(weatherData);
      setForecast(forecastData);
      setSearchQuery('');
    } catch (err) {
      Alert.alert('Not Found', err.message);
    } finally {
      setSearching(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchByLocation();
  };

  return (
    <LinearGradient colors={gradientColors} style={styles.gradient}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, searchFocused && styles.searchFocused]}>
          <Icon
            name="search"
            size={20}
            color={searchFocused ? colors.auroraBlue : colors.textMuted}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search city..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            returnKeyType="search"
          />
          {searching ? (
            <ActivityIndicator size="small" color={colors.auroraBlue} />
          ) : (
            <TouchableOpacity onPress={fetchByLocation}>
              <Icon name="my-location" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.auroraBlue} />
          <Text style={styles.loadingText}>Fetching weather...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>🌐</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchByLocation}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.auroraBlue}
            />
          }>
          <WeatherCard weather={weather} />
          <HourlyForecast forecast={forecast} />
          <DailyForecast forecast={forecast} />
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Last updated{' '}
              {new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </ScrollView>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  searchContainer: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    gap: 12,
  },
  searchFocused: {
    borderColor: 'rgba(79, 195, 247, 0.5)',
    backgroundColor: 'rgba(79, 195, 247, 0.08)',
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
    padding: 0,
    fontWeight: '500',
  },
  scroll: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 15,
    letterSpacing: 0.5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    gap: 12,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  errorText: {
    color: colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryBtn: {
    marginTop: 16,
    backgroundColor: 'rgba(79, 195, 247, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(79, 195, 247, 0.4)',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: colors.auroraBlue,
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 12,
    letterSpacing: 0.5,
  },
});

export default HomeScreen;