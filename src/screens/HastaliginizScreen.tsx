import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import Header from '../components/Header';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';
import AboutSection from '../components/AboutSection';
import { postTahmin } from '../services/api';

type HastaliginizRouteProp = RouteProp<RootStackParamList, 'Hastaliginiz'>;
type HastaliginizNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Hastalik {
  id: number;
  adi: string;
  aciklama: string;
  belirtiler: string[];
  tumBelirtiler: string[];
  poliklinikler: Array<{
  poliklinikID: number;
  poliklinikAdi: string;
  }>;
}

const HastaliginizScreen: React.FC = () => {
  const route = useRoute<HastaliginizRouteProp>();
  const navigation = useNavigation<HastaliginizNavigationProp>();
  const { selectedSymptoms } = route.params;

  const [loading, setLoading] = useState(true);
  const [hastaliklar, setHastaliklar] = useState<Hastalik[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  console.log('HastaliginizScreen selectedSymptoms:', selectedSymptoms);
  useEffect(() => {
    const fetchDiagnosis = async () => {
      try {
        console.log('Seçilen belirtiler:', selectedSymptoms);
        const response = await postTahmin(selectedSymptoms);
        console.log('API yanıtı:', response);

        if (!response || !Array.isArray(response)) {
          throw new Error('Geçersiz API yanıtı');
        }

        // API yanıtını web uygulamasındaki formata dönüştür
        const formattedHastaliklar = response.map(h => ({
          id: h.hastalikID,
          adi: h.hastalikAdi,
          aciklama: h.hastalikAciklama || '',
          belirtiler: h.belirtiler || [],
          tumBelirtiler: h.tumBelirtiler || [],
          poliklinikler: h.poliklinikler || []
        }));

        setHastaliklar(formattedHastaliklar);
      } catch (err: any) {
        console.error('Tahmin Hatası:', err.message);
        const errorMsg =
          err.code === 'ECONNABORTED'
            ? 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.'
            : err.response?.data?.error || 'Tahmin yapılırken bir hata oluştu.';
        setError(errorMsg);
        Alert.alert('Hata', errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnosis();
  }, [selectedSymptoms]);

  const handleLogin = () => navigation.navigate('Login');
  const handleSignUp = () => navigation.navigate('Register');
  const handleHomePress = () => navigation.navigate('Home');
  const handleClinicsPress = () => navigation.navigate('Clinics');
  const handleDiseasesPress = () => navigation.navigate('Diseases');
  const handleSymptomsPress = () => navigation.navigate('Symptoms');

  const handleHastalikPress = (hastalikId: number) => {
    navigation.navigate('DiseasesDetail', { diseaseId: hastalikId.toString() });
  };

  const handlePoliklinikPress = (poliklinikId: number) => {
    navigation.navigate('ClinicDetail', { clinicId: poliklinikId.toString() });
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

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
          Aşağıdakiler, belirttiğiniz belirtilere uyan hastalıkların listesidir. 
          Hangi polikliniğe gitmeniz gerektiğini anlamanız için yardımcı olmak amacıyla listelenmiştir.{"\n"}
            <Text style={styles.boldText}>En doğru sonuç için bir sağlık kuruluşuna başvurmalısınız.</Text>
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#2B8C96" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : hastaliklar.length > 0 ? (
          hastaliklar.map((hastalik) => {
            const isExpanded = expandedIds.includes(hastalik.id);
            return (
              <View key={hastalik.id} style={styles.hastalikBox}>
                <TouchableOpacity onPress={() => handleHastalikPress(hastalik.id)}>
                  <Text style={styles.hastalikAdi}>{hastalik.adi}</Text>
                </TouchableOpacity>
                <Text style={styles.matchText}>
                  Belirtilerinizden <Text style={styles.boldText}>{hastalik.belirtiler.length}</Text> tanesi bu hastalık ile eşleşiyor: {hastalik.belirtiler.join(' , ')}
                </Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    setExpandedIds((prev) =>
                      isExpanded ? prev.filter(id => id !== hastalik.id) : [...prev, hastalik.id]
                    );
                  }}
                >
                  <Text style={styles.buttonText}>
                    {isExpanded ? 'Diğer Belirtileri Gizle' : 'Bu Hastalığın Diğer Belirtileri'}
                  </Text>
                </TouchableOpacity>
                {isExpanded && (
                  <View style={styles.expandedBox}>
                    {hastalik.tumBelirtiler.length > 0 ? (
                      <Text style={styles.expandedText}>{hastalik.tumBelirtiler.join(' , ')}</Text>
                    ) : (
                      <Text style={styles.expandedText}>Belirti bulunamadı.</Text>
                    )}
                  </View>
                )}
                <Text style={styles.poliklinikTitle}>Gidebileceğiniz poliklinikler:</Text>
                {hastalik.poliklinikler.map((poli) => (
                  <TouchableOpacity
                    key={poli.poliklinikID}
                    onPress={() => handlePoliklinikPress(poli.poliklinikID)}
                    style={styles.poliklinikBox}
                  >
                    <Text style={styles.poliklinikAdi}>{poli.poliklinikAdi}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            );
          })
        ) : (
          <Text style={styles.errorText}>Belirtilerinizle eşleşen hastalık bulunamadı.</Text>
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
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20 },
  infoBox: {
    backgroundColor: '#f7f7d1',
    borderRadius: 8,
    margin: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  infoText: { color: '#4b251a', fontSize: 16, lineHeight: 22 },
  boldText: { fontWeight: 'bold', color: '#b85c00' },
  hastalikBox: {
    backgroundColor: '#cdeff3',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#8fdde5',
  },
  hastalikAdi: { fontSize: 20, fontWeight: 'bold', color: '#131c20', marginBottom: 8 },
  matchText: { fontSize: 16, color: '#131c20', marginBottom: 8 },
  button: {
    backgroundColor: '#0077b6',
    borderRadius: 5,
    padding: 8,
    marginVertical: 8,
    alignSelf: 'flex-start',
  },
  buttonText: { color: '#fff', fontSize: 14 },
  poliklinikTitle: { fontWeight: 'bold', marginTop: 8, marginBottom: 4, color: '#131c20' },
  poliklinikBox: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  poliklinikAdi: { color: '#0077b6', fontSize: 16, marginBottom: 2, fontWeight: 'bold' },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  expandedBox: {
    backgroundColor: '#eaf6fb',
    borderRadius: 5,
    padding: 10,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#b3e0ee',
  },
  expandedText: {
    color: '#124cb0',
    fontSize: 15,
  },
});

export default HastaliginizScreen;
