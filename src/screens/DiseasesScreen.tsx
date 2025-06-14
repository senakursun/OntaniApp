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
import { getHastaliklar } from '../services/api';
import Header from '../components/Header';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';
import AboutSection from '../components/AboutSection';

type DiseasesScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Diseases'>;
};

interface Disease {
  hastalikID: number;
  hastalikAdi: string;
  aciklama?: string;
}

const DiseasesScreen: React.FC<DiseasesScreenProps> = ({ navigation }) => {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [filteredDiseases, setFilteredDiseases] = useState<Disease[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getHastaliklar();
        setDiseases(data);
        setFilteredDiseases(data);
      } catch (err) {
        setError('Hastalıklar yüklenirken bir hata oluştu.');
        Alert.alert('Hata', 'Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDiseases(diseases);
      return;
    }

    const normalizeText = (text: string) => {
      return text.toLowerCase()
        .replace(/ı/g, 'i')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/İ/g, 'i')
        .replace(/Ğ/g, 'g')
        .replace(/Ü/g, 'u')
        .replace(/Ş/g, 's')
        .replace(/Ö/g, 'o')
        .replace(/Ç/g, 'c');
    };

    const filtered = diseases.filter(disease =>
      normalizeText(disease.hastalikAdi).includes(normalizeText(searchQuery))
    );
    setFilteredDiseases(filtered);
  }, [searchQuery, diseases]);

  const handleDiseasePress = (diseaseId: number) => {
    navigation.navigate('DiseasesDetail', { diseaseId: diseaseId.toString() });
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
    // Zaten buradayız
  };

  const handleSymptomsPress = () => {
    navigation.navigate('Symptoms');
  };

  const renderDiseaseItem = ({ item }: { item: Disease }) => (
    <TouchableOpacity
      style={styles.diseaseItem}
      onPress={() => handleDiseasePress(item.hastalikID)}
    >
      <View style={styles.diseaseIconContainer}>
        <Text style={styles.diseaseIcon}>🦠</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.diseaseName}>{item.hastalikAdi}</Text>
        {item.aciklama && (
          <Text style={styles.diseaseDescription}>
            {item.aciklama.length > 70
              ? `${item.aciklama.slice(0, 70)}...`
              : item.aciklama}
          </Text>
        )}
      </View>
      <Text style={styles.diseaseArrow}>›</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2B8C96" />
        <Text style={styles.loadingText}>Hastalıklar Yükleniyor...</Text>
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
          <Text style={styles.title}>Hastalıklar</Text>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Hastalık ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>

        {filteredDiseases.length > 0 ? (
          <FlatList
            data={filteredDiseases}
            renderItem={renderDiseaseItem}
            keyExtractor={(item) => item.hastalikID.toString()}
            contentContainerStyle={styles.listContainer}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.noDataText}>
            {searchQuery ? 'Arama kriterlerine uygun hastalık bulunamadı.' : 'Hiç hastalık bulunamadı.'}
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
  titleContainer: {
    padding: 20,
    alignItems: 'center',
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
  diseaseItem: {
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
  diseaseIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e8f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  diseaseIcon: {
    fontSize: 20,
  },
  diseaseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  diseaseDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  diseaseArrow: {
    fontSize: 24,
    color: '#666',
    marginLeft: 10,
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

export default DiseasesScreen;
