import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../constants/colors';

const WeatherDetail = ({icon, label, value}) => (
  <View style={styles.container}>
    <Icon name={icon} size={22} color={colors.auroraBlue} />
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 12,
  },
  value: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 6,
    letterSpacing: 0.3,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});

export default WeatherDetail;