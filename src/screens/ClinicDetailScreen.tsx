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
import { getPoliklinikDetay, getPoliklinikler } from '../services/api';
import Header from '../components/Header';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';
import AboutSection from '../components/AboutSection';

type ClinicDetailRouteProp = RouteProp<RootStackParamList, 'ClinicDetail'>;
type ClinicDetailNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Disease {
  id: number;
  name: string;
}

interface Clinic {
  poliklinikID: number;
  poliklinikAdi: string;
}

const ClinicDetailScreen: React.FC = () => {
  const route = useRoute<ClinicDetailRouteProp>();
  const navigation = useNavigation<ClinicDetailNavigationProp>();
  const { clinicId }: { clinicId: string } = route.params;

  const [clinicName, setClinicName] = useState('');
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClinicAndDiseases = async () => {
      try {
        setLoading(true);

        const allClinics: Clinic[] = await getPoliklinikler();
        const selectedClinic = allClinics.find(
          (clinic) => clinic.poliklinikID.toString() === clinicId
        );
        if (selectedClinic?.poliklinikAdi) {
          setClinicName(selectedClinic.poliklinikAdi);
        } else {
          setClinicName('Poliklinik adı bulunamadı');
        }

        const fetched = await getPoliklinikDetay(Number(clinicId));
        if (fetched?.hastaliklar && Array.isArray(fetched.hastaliklar)) {
          const parsedDiseases = fetched.hastaliklar.map((d: any) => ({
            id: d.hastalikID,
            name: d.hastalikAdi,
          }));
          setDiseases(parsedDiseases);
        } else {
          setDiseases([]);
        }
      } catch (err) {
        setError('Detaylar yüklenirken bir hata oluştu.');
        Alert.alert('Hata', 'Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchClinicAndDiseases();
  }, [clinicId]);

  const handleDiseasePress = (diseaseId: number) => {
    navigation.navigate('DiseasesDetail', { diseaseId: diseaseId.toString() });
  };

  const renderDisease = ({ item }: { item: Disease }) => (
    <TouchableOpacity 
      style={styles.diseaseItem}
      onPress={() => handleDiseasePress(item.id)}
      activeOpacity={0.7}
    >
      <Text style={styles.diseaseName}>🩺 {item.name}</Text>
    </TouchableOpacity>
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
          <Text style={styles.title}>{clinicName}</Text>
          <Text style={styles.subHeader}>Bu polikliniğin baktığı hastalıklar:</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#2B8C96" style={{ marginTop: 20 }} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : diseases.length > 0 ? (
          <FlatList
            data={diseases}
            renderItem={renderDisease}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.noDiseasesText}>Bu polikliniğe ait hastalık bulunamadı.</Text>
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
    marginBottom: 5,
  },
  subHeader: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  diseaseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f9fc',
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  diseaseName: {
    fontSize: 16,
    color: '#1d70b7',
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
  noDiseasesText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginTop: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default ClinicDetailScreen;
