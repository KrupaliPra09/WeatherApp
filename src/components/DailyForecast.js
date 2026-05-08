import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import colors from '../constants/colors';
import {
  getWeatherEmoji,
  formatTemp,
  formatDay,
} from '../utils/weatherIcons';
import {processDailyForecast} from '../services/weatherService';

const DailyRow = ({item, index}) => {
  const emoji = getWeatherEmoji(item.weather.id);
  const day = formatDay(item.dt);
  const isFirst = index === 0;

  return (
    <View style={[styles.row, isFirst && styles.rowFirst]}>
      <Text style={[styles.day, isFirst && styles.dayFirst]}>
        {isFirst ? 'Tomorrow' : day}
      </Text>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.description}>{item.weather.description}</Text>
      <View style={styles.temps}>
        <Text style={styles.tempHi}>{formatTemp(item.tempMax)}</Text>
        <View style={styles.tempBar}>
          <View
            style={[
              styles.tempBarFill,
              {
                width: `${Math.min(
                  100,
                  ((item.tempMax - item.tempMin) / 30) * 100,
                )}%`,
              },
            ]}
          />
        </View>
        <Text style={styles.tempLo}>{formatTemp(item.tempMin)}</Text>
      </View>
    </View>
  );
};

const DailyForecast = ({forecast}) => {
  if (!forecast?.list?.length) return null;
  const daily = processDailyForecast(forecast.list);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>5-Day Forecast</Text>
      {daily.map((item, index) => (
        <DailyRow key={item.dt} item={item} index={index} />
      ))}
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
    padding: 20,
  },
  title: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  rowFirst: {
    borderTopWidth: 0,
  },
  day: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    width: 80,
  },
  dayFirst: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  emoji: {
    fontSize: 22,
    width: 36,
    textAlign: 'center',
  },
  description: {
    color: colors.textMuted,
    fontSize: 12,
    flex: 1,
    textTransform: 'capitalize',
    marginLeft: 8,
  },
  temps: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: 120,
    justifyContent: 'flex-end',
  },
  tempHi: {
    color: '#FF8A65',
    fontSize: 14,
    fontWeight: '700',
    width: 36,
    textAlign: 'right',
  },
  tempBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  tempBarFill: {
    height: '100%',
    backgroundColor: colors.auroraBlue,
    borderRadius: 2,
  },
  tempLo: {
    color: colors.auroraBlue,
    fontSize: 14,
    fontWeight: '700',
    width: 36,
  },
});

export default DailyForecast;