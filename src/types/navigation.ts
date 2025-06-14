export interface Clinic {
  poliklinikID: number;
  poliklinikAdi: string;
  poliklinikAciklama: string;
  hastaliklar: Disease[];
}

export interface Disease {
  hastalikID: number;
  hastalikAdi: string;
  hastalikAciklama: string;
  belirtiler: Symptom[];
  poliklinikler: Clinic[];
}

export interface Symptom {
  belirtiID: number;
  belirtiAdi: string;
}

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  Clinics: undefined;
  Diseases: undefined;
  Symptoms: undefined;
  Hastaliginiz: { selectedSymptoms: number[] };
  DiseasesDetail: { diseaseId: string };
  ClinicDetail: { clinicId: string };
}; 