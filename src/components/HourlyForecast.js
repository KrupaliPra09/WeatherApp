import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import colors from '../constants/colors';
import {getWeatherEmoji, formatTemp, formatTime} from '../utils/weatherIcons';

const HourlyItem = ({item, isFirst}) => {
  const emoji = getWeatherEmoji(item.weather[0].id);
  const time = isFirst ? 'Now' : formatTime(item.dt);

  return (
    <View style={[styles.item, isFirst && styles.itemFirst]}>
      <Text style={[styles.time, isFirst && styles.timeNow]}>{time}</Text>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.temp}>{formatTemp(item.main.temp)}</Text>
      {item.pop > 0.1 && (
        <Text style={styles.rain}>{Math.round(item.pop * 100)}%</Text>
      )}
    </View>
  );
};

const HourlyForecast = ({forecast}) => {
  if (!forecast?.list?.length) return null;
  const hourly = forecast.list.slice(0, 12);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hourly Forecast</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>
        {hourly.map((item, index) => (
          <HourlyItem key={item.dt} item={item} isFirst={index === 0} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: colors.glassBg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingTop: 18,
    paddingBottom: 8,
  },
  title: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  scroll: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  item: {
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    marginHorizontal: 4,
    minWidth: 64,
  },
  itemFirst: {
    backgroundColor: 'rgba(79, 195, 247, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(79, 195, 247, 0.3)',
  },
  time: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '500',
  },
  timeNow: {
    color: colors.auroraBlue,
    fontWeight: '700',
  },
  emoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  temp: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  rain: {
    color: colors.auroraBlue,
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
});

export default HourlyForecast;