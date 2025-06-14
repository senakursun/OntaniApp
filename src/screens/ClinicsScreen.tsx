import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { getPoliklinikler } from '../services/api';
import Header from '../components/Header';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';
import AboutSection from '../components/AboutSection';

type ClinicsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Clinics'>;
};

interface Clinic {
  poliklinikID: number;
  poliklinikAdi: string;
}

const ClinicsScreen: React.FC<ClinicsScreenProps> = ({ navigation }) => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [filteredClinics, setFilteredClinics] = useState<Clinic[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getPoliklinikler();
        setClinics(data);
        setFilteredClinics(data);
      } catch (err) {
        setError('Poliklinikler yüklenirken bir hata oluştu.');
        Alert.alert('Hata', 'Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredClinics(clinics);
      return;
    }

    const filtered = clinics.filter(clinic =>
      clinic.poliklinikAdi.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredClinics(filtered);
  }, [searchQuery, clinics]);

  const handleClinicPress = (clinicId: number) => {
    navigation.navigate('ClinicDetail', { clinicId: clinicId.toString() });
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleSignUp = () => {
    navigation.navigate('Register');
  };

  const handleHomePress = () => {
    navigation.navigate('Home');
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

  const renderClinicItem = ({ item }: { item: Clinic }) => (
    <TouchableOpacity 
      style={styles.clinicItem} 
      onPress={() => handleClinicPress(item.poliklinikID)}
    >
      <View style={styles.clinicIconContainer}>
        <Text style={styles.clinicIcon}>🏥</Text>
      </View>
      <Text style={styles.clinicName}>{item.poliklinikAdi}</Text>
      <Text style={styles.clinicArrow}>›</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2B8C96" />
        <Text style={styles.loadingText}>Poliklinikler Yükleniyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header onLoginPress={handleLogin} onSignUpPress={handleSignUp} />
      <NavigationBar 
        onHomePress={handleHomePress}
        onClinicsPress={handleClinicsPress}
        onDiseasesPress={handleDiseasesPress}
        onSymptomsPress={handleSymptomsPress}
      />
      <ScrollView style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Poliklinikler</Text>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Poliklinik ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>

        {filteredClinics.length > 0 ? (
          <FlatList
            data={filteredClinics}
            renderItem={renderClinicItem}
            keyExtractor={(item) => item.poliklinikID.toString()}
            contentContainerStyle={styles.listContainer}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.noDataText}>
            {searchQuery ? 'Arama kriterlerine uygun poliklinik bulunamadı.' : 'Hiç poliklinik bulunamadı.'}
          </Text>
        )}
        <AboutSection 
          onHomePress={handleHomePress}
          onClinicsPress={handleClinicsPress}
          onDiseasesPress={handleDiseasesPress}
          onSymptomsPress={handleSymptomsPress}
        />
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
  header: {
    padding: 20,
    backgroundColor: '#2B8C96',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2B8C96',
    marginBottom: 5,
  },
  
  content: {
    flex: 1,
  },
  clinicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clinicIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e8f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  clinicIcon: {
    fontSize: 20,
  },
  clinicName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  clinicArrow: {
    fontSize: 24,
    color: '#666',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: '#d00',
    fontSize: 16,
  },
  listContainer: {
    paddingVertical: 20,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginTop: 20,
  },
  titleContainer: {
    padding: 20,
    alignItems: 'center',
  },
  searchContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    color: '#333',
  },
});

export default ClinicsScreen;
