import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SectionList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import Header from '../components/Header';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';
import AboutSection from '../components/AboutSection';
import { getBelirtiler} from '../services/api';

type SymptomsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Symptoms'>;

type Symptom = {
  belirtiID: number;
  belirtiAdi: string;
};

type GroupedSymptoms = {
  title: string;
  data: Symptom[];
};

  const SymptomsScreen: React.FC = () => {
  const navigation = useNavigation<SymptomsScreenNavigationProp>();
  const [groupedSymptoms, setGroupedSymptoms] = useState<GroupedSymptoms[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<{ [key: number]: boolean }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredSymptoms, setFilteredSymptoms] = useState<GroupedSymptoms[]>([]);

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        setLoading(true);
        const data = await getBelirtiler();
        console.log('API\'den gelen veri:', data);

        if (!Array.isArray(data)) {
          throw new Error('API\'den geçersiz veri formatı geldi');
        }

        // Belirtileri alfabetik sıraya göre gruplandır
        const sortedData = data.sort((a: Symptom, b: Symptom) =>
          a.belirtiAdi.localeCompare(b.belirtiAdi, 'tr', { sensitivity: 'base' })
        );

        const grouped: { [key: string]: Symptom[] } = {};
        sortedData.forEach((item: Symptom) => {
          const firstLetter = item.belirtiAdi[0].toUpperCase();
          if (!grouped[firstLetter]) grouped[firstLetter] = [];
          grouped[firstLetter].push(item);
        });

        const groupedArray: GroupedSymptoms[] = Object.keys(grouped)
          .sort((a, b) => a.localeCompare(b, 'tr'))
          .map((letter) => ({
            title: letter,
            data: grouped[letter],
          }));

        setGroupedSymptoms(groupedArray);
        setFilteredSymptoms(groupedArray);

        // Başlangıç seçim durumlarını güvenli bir şekilde ayarla
        const initialSelected: { [key: number]: boolean } = {};
        data.forEach((symptom: Symptom) => {
          if (typeof symptom.belirtiID === 'number') {
            initialSelected[symptom.belirtiID] = false;
          }
        });
        setSelectedSymptoms(initialSelected);
        setLoading(false);
      } catch (error) {
        console.error('Veri alınırken hata oluştu:', error);
        Alert.alert('Hata', 'Belirtiler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
        setLoading(false);
      }
    };

    fetchSymptoms();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSymptoms(groupedSymptoms);
      return;
    }

    const filtered = groupedSymptoms.map(group => ({
      ...group,
      data: group.data.filter(symptom =>
        symptom.belirtiAdi.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(group => group.data.length > 0);

    setFilteredSymptoms(filtered);
  }, [searchQuery, groupedSymptoms]);

  const renderSymptomItem = ({ item }: { item: Symptom }) => {
    const isSelected = selectedSymptoms[item.belirtiID] || false;

    return (
      <View style={styles.symptomItem}>
        <TouchableOpacity
          onPress={() => {
            setSelectedSymptoms(prev => ({
              ...prev,
              [item.belirtiID]: !prev[item.belirtiID]
            }));
          }}
          style={[
            styles.customCheckbox,
            isSelected && styles.customCheckboxSelected
          ]}
          activeOpacity={0.7}
        >
          {isSelected && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
        <Text style={styles.symptomText}>{item.belirtiAdi}</Text>
      </View>
    );
  };

  const handleSubmit = async () => {
    // Seçili ID'leri bul
    const selectedIds = Object.entries(selectedSymptoms)
      .filter(([_, value]) => value)
      .map(([key]) => Number(key));

    if (selectedIds.length === 0) {
      Alert.alert('Uyarı', 'Lütfen en az bir belirti seçin.');
      return;
    }

    navigation.navigate('Hastaliginiz', { selectedSymptoms: selectedIds });
  };

  const renderSectionHeader = ({ section }: { section: GroupedSymptoms }) => (
    <Text style={styles.sectionHeader}>{section.title}</Text>
  );

  const handleLogin = () => navigation.navigate('Login');
  const handleSignUp = () => navigation.navigate('Register');
  const handleHomePress = () => navigation.navigate('Home');
  const handleClinicsPress = () => navigation.navigate('Clinics');
  const handleDiseasesPress = () => navigation.navigate('Diseases');
  const handleSymptomsPress = () => {};

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
        <View style={styles.mainContent}>
          <Text style={styles.title}>Belirtiler</Text>
          
          <Text style={styles.description}>
            Lütfen yaşadığınız belirtileri seçin. 
            Birden fazla belirti seçebilirsiniz. 
          </Text>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Belirti ara..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#2B8C96" />
          ) : filteredSymptoms.length > 0 ? (
            <SectionList
              sections={filteredSymptoms}
              keyExtractor={(item) => String(item.belirtiID)}
              renderItem={renderSymptomItem}
              renderSectionHeader={renderSectionHeader}
              scrollEnabled={false}
              contentContainerStyle={styles.symptomList}
            />
          ) : (
            <Text style={styles.noDataText}>
              {searchQuery ? 'Arama kriterlerine uygun belirti bulunamadı.' : 'Gösterilecek belirti bulunamadı.'}
            </Text>
          )}

          <AboutSection
            onHomePress={handleHomePress}
            onClinicsPress={handleClinicsPress}
            onDiseasesPress={handleDiseasesPress}
            onSymptomsPress={handleSymptomsPress}
          />
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.submitButton} 
        onPress={handleSubmit}
        activeOpacity={0.7}
      >
        <Text style={styles.submitButtonText}>Devam Et</Text>
      </TouchableOpacity>

      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',  // Kapsayıcıyı 'relative' olarak belirliyoruz
  },
  content: {
    flex: 1,
  },
  mainContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2B8C96',
    marginBottom: 20,
    textAlign: 'center',
  },
  symptomList: {
    marginBottom: 20,
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  customCheckbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#2B8C96',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  customCheckboxSelected: {
    backgroundColor: '#2B8C96',
    borderColor: '#2B8C96',
  },
  checkmark: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  symptomText: { 
    fontSize: 16, 
    color: '#333',
    flex: 1
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2B8C96',
    backgroundColor: '#EAF4F4',
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginTop: 10,
    borderRadius: 8,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#2B8C96',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    position: 'absolute',
    bottom: 80, // Increased to account for Footer height
    right: 20,
    zIndex: 1000, // Increased zIndex to ensure it's always on top
    elevation: 5, // Added elevation for Android
    shadowColor: '#000', // Added shadow for iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
  },
  searchContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
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

export default SymptomsScreen;
