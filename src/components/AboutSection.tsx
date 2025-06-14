import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type AboutSectionProps = {
  onHomePress: () => void;
  onClinicsPress: () => void;
  onDiseasesPress: () => void;
  onSymptomsPress: () => void;
};

const AboutSection: React.FC<AboutSectionProps> = ({
  onHomePress,
  onClinicsPress,
  onDiseasesPress,
  onSymptomsPress,
}) => {
  return (
    <View style={styles.aboutSection}>
      <Text style={styles.aboutTitle}>OntaniApp Hakkında</Text>
      <Text style={styles.aboutText}>
        OntaniApp, sağlık sorunlarınızı daha iyi anlamanıza ve yönetmenize yardımcı olmak için tasarlanmış bir uygulamadır.
        Semptomlarınızı girerek olası hastalıkları öğrenebilir ve hangi kliniklere başvurmanız gerektiğini belirleyebilirsiniz.
      </Text>
      
      <Text style={styles.menuTitle}>Menü</Text>
      <View style={styles.menuList}>
        <TouchableOpacity style={styles.menuItem} onPress={onHomePress}>
          <Text style={styles.menuItemText}>Anasayfa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={onClinicsPress}>
          <Text style={styles.menuItemText}>Poliklinikler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={onDiseasesPress}>
          <Text style={styles.menuItemText}>Hastalıklar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={onSymptomsPress}>
          <Text style={styles.menuItemText}>Belirtiler</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  aboutSection: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2B8C96',
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
    color: '#2B8C96',
  },
  menuList: {
    marginTop: 10,
  },
  menuItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuItemText: {
    fontSize: 16,
    color: '#2B8C96',
  },
});

export default AboutSection; 