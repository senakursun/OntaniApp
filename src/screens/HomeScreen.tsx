import React from 'react';
import { View, ScrollView, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Header from '../components/Header';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';
import AboutSection from '../components/AboutSection';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleSignUp = () => {
    navigation.navigate('Register');
  };

  const handleStart = () => {
    navigation.navigate('Symptoms');
  };

  const handleHomePress = () => {
    // Zaten ana sayfadayız
  };

  const handleClinicsPress = () => {
    navigation.navigate('Clinics');
  };

  const handleDiseasesPress = () => {
    navigation.navigate('Diseases');
  };

  const handleSymptomsPress = () => {
    navigation.navigate('Symptoms');
  };

  return (
    <View style={styles.container}>
      <Header onLoginPress={handleLogin} onSignUpPress={handleSignUp} />
      <NavigationBar 
        onHomePress={handleHomePress}
        onClinicsPress={handleClinicsPress}
        onDiseasesPress={handleDiseasesPress}
        onSymptomsPress={handleSymptomsPress}
      />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContentWrapper}>
          <Image
            source={require('../assets/dna-puzzle.png')}
            style={styles.mainImage}
            resizeMode="contain"
          />
          <View style={styles.textContainer}>
            <Text style={styles.mainText}>
              Kendinizde gördüğünüz belirtileri girin ve hastalığınızın ne olabileceğini öğrenin.
            </Text>
            <Text style={styles.mainText}>
              Bununla birlikte hangi polikliniğe gitmeniz gerektiğini de öğrenin.
            </Text>
          </View>
          <TouchableOpacity style={styles.startButton} onPress={handleStart}>
            <Text style={styles.startButtonText}>Şimdi Başla</Text>
          </TouchableOpacity>

          <AboutSection 
            onHomePress={handleHomePress}
            onClinicsPress={handleClinicsPress}
            onDiseasesPress={handleDiseasesPress}
            onSymptomsPress={handleSymptomsPress}
          />
        </View>
      </ScrollView>

      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    flexGrow: 1,
    width: '100%',
  },
  mainContentWrapper: {
    padding: 20,
    paddingBottom: 40,
    width: '100%',
  },
  mainImage: {
    width: '100%',
    height: 300,
    marginVertical: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  mainText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  startButton: {
    backgroundColor: '#2B8C96',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen; 