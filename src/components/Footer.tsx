import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Footer = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>OntaniApp - Sağlığınız Bizim İçin Önemli.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    padding: 15,
    backgroundColor: '#2B8C96',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default Footer; 