import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { getHastalikDetay } from '../services/api';
import Header from '../components/Header';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';
import AboutSection from '../components/AboutSection';

type DiseaseDetailRouteProp = RouteProp<RootStackParamList, 'DiseasesDetail'>;
type DiseaseDetailNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Poliklinik {
  poliklinikID: number;
  poliklinikAdi: string;
}

interface Belirti {
  belirtiID: number;
  belirtiAdi: string;
}

const DiseaseDetailScreen: React.FC = () => {
  const route = useRoute<DiseaseDetailRouteProp>();
  const navigation = useNavigation<DiseaseDetailNavigationProp>();
  const { diseaseId }: { diseaseId: string } = route.params;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [diseaseName, setDiseaseName] = useState('');
  const [clinics, setClinics] = useState<Poliklinik[]>([]);
  const [symptoms, setSymptoms] = useState<Belirti[]>([]);

  useEffect(() => {
    const fetchDiseaseDetail = async () => {
      try {
        setLoading(true);
        const data = await getHastalikDetay(Number(diseaseId));

        if (data) {
          setDiseaseName(data.hastalik.hastalikAdi);
          setClinics(data.poliklinikler || []);
          setSymptoms(data.belirtiler || []);
        }
      } catch (err) {
        setError('Hastalık detayları alınamadı.');
        Alert.alert('Hata', 'Bilgiler alınırken bir sorun oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchDiseaseDetail();
  }, [diseaseId]);

  const handleClinicPress = (clinicId: number) => {
    navigation.navigate('ClinicDetail', { clinicId: clinicId.toString() });
  };

  const renderClinic = ({ item }: { item: Poliklinik }) => (
    <TouchableOpacity 
      style={styles.itemBox}
      onPress={() => handleClinicPress(item.poliklinikID)}
      activeOpacity={0.7}
    >
      <Text style={styles.itemText}>🏥 {item.poliklinikAdi}</Text>
    </TouchableOpacity>
  );

  const renderSymptom = ({ item }: { item: Belirti }) => (
    <View style={styles.itemBox}>
      <Text style={styles.itemText}>🔍 {item.belirtiAdi}</Text>
    </View>
  );

  const handleLogin = () => navigation.navigate('Login');
  const handleSignUp = () => navigation.navigate('Register');
  const handleHomePress = () => navigation.navigate('Home');
  const handleClinicsPress = () => navigation.navigate('Clinics');
  const handleDiseasesPress = () => navigation.navigate('Diseases');
  const handleSymptomsPress = () => navigation.navigate('Symptoms');

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
          <Text style={styles.title}>{diseaseName}</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#2B8C96" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <>
            <Text style={styles.sectionHeader}>👩‍⚕️ İlgili Poliklinikler</Text>
            <FlatList
              data={clinics}
              renderItem={renderClinic}
              keyExtractor={(item) => item.poliklinikID.toString()}
              scrollEnabled={false}
              contentContainerStyle={styles.listContainer}
            />

            <Text style={styles.sectionHeader}>🧬 Belirtiler</Text>
            <FlatList
              data={symptoms}
              renderItem={renderSymptom}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
              contentContainerStyle={styles.listContainer}
            />
          </>
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
  content: {
    flex: 1,
  },
  titleContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2B8C96',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2B8C96',
    marginTop: 20,
    marginHorizontal: 20,
  },
  itemBox: {
    backgroundColor: '#f1f9fc',
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    color: '#1d70b7',
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});

export default DiseaseDetailScreen;
