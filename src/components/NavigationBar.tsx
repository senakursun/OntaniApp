import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

type NavigationBarProps = {
  onHomePress: () => void;
  onClinicsPress: () => void;
  onDiseasesPress: () => void;
  onSymptomsPress: () => void;
};

const NavigationBar: React.FC<NavigationBarProps> = ({
  onHomePress,
  onClinicsPress,
  onDiseasesPress,
  onSymptomsPress,
}) => {
  return (
    <View style={styles.navBar}>
      <TouchableOpacity style={styles.navItem} onPress={onHomePress}>
        <Text style={styles.navText}>Anasayfa</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={onClinicsPress}>
        <Text style={styles.navText}>Polilkinikler</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={onDiseasesPress}>
        <Text style={styles.navText}>Hastalıklar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={onSymptomsPress}>
        <Text style={styles.navText}>Belirtiler</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2B8C96',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  navItem: {
    padding: 5,
  },
  navText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default NavigationBar; 