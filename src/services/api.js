import axios from 'axios';
import { Platform } from 'react-native';

const API_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:8082/api',
  ios: 'http://localhost:8082/api',
  default: 'http://192.168.1.100:8082/api'
});


export const getPoliklinikler = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/poliklinikler`);
    return response.data;
  } catch (error) {
    console.error('Veri çekme hatası:', error);
    throw error;
  }
};


export const getHastaliklar = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/hastaliklar`);
    return response.data;
  } catch (error) {
    console.error('Hastalıklar alınamadı:', error);
    return [];
  }
};


export const getBelirtiler = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/belirtiler`);
    return response.data;
  } catch (error) {
    console.error('Belirtiler alınamadı:', error);
    return [];
  }
};


export const getHastalikDetay = async (hastalikId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/hastaliklar/${hastalikId}`);
    return response.data;
  } catch (error) {
    console.error('Hastalık detayı alınamadı:', error);
    throw error;
  }
};

export const getPoliklinikDetay = async (poliklinikId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/poliklinikler/${poliklinikId}`);
    console.log('Poliklinik Detay:', response.data);  // Veriyi kontrol et

    return response.data;
  } catch (error) {
    console.error('Poliklinik detayı alınamadı:', error);
    throw error;
  }
};

export const postTahmin = async (selectedSymptoms) => {
  try {
    console.log('Gönderilen belirtiler:', selectedSymptoms);
    const response = await axios.post(`${API_BASE_URL}/tahmin`, {
      belirtiler: selectedSymptoms
    });
    console.log('Tahmin yanıtı:', response.data);

    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Geçersiz API yanıtı');
    }

    // API yanıtını web uygulamasındaki formata dönüştür
    const formattedResponse = response.data.map(hastalik => ({
      hastalikID: hastalik.id,
      hastalikAdi: hastalik.adi,
      hastalikAciklama: hastalik.aciklama,
      belirtiler: hastalik.belirtiler || [],
      tumBelirtiler: hastalik.tumBelirtiler || [],
      poliklinikler: hastalik.poliklinikler || []
    }));

    return formattedResponse;
  } catch (error) {
    console.error('Tahmin yapılırken hata oluştu:', error);
    if (error.response) {
      console.error('Sunucu yanıtı:', error.response.data);
    }
    throw error;
  }
};
