// types.ts
export interface Clinic {
  poliklinikID: number;
  poliklinikAdi: string;
}


export interface Disease {
  hastalikID: number;
  hastalikAdi: string;
}

export interface Symptom {
  belirtiID: number;
  belirtiAdi: string;
}

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Clinics: undefined;
  ClinicDetail: { clinicId: string };
  Diseases: undefined;
  DiseasesDetail: { diseaseId: string };
  Symptoms: undefined;
  Hastaliginiz: { selectedSymptoms: string[] };
  Appointments: undefined;
  AppointmentDetail: { appointmentId: string };
  CreateAppointment: undefined;
};
