export interface PatientNotes {
  patient_id?: string;
  title?: string;
  activity?: string | null;
  administration?: string | null;
  age?: string | null;
  area?: string | null;
  biological_attribute?: string | null;
  biological_structure?: string | null;
  clinical_event?: string | null;
  color?: string | null;
  coreference?: string | null;
  date?: string | null;
  detailed_description?: string | null;
  diagnostic_procedure?: string | null;
  disease_disorder?: string | null;
  distance?: string | null;
  dosage?: string | null;
  duration?: string | null;
  family_history?: string | null;
  frequency?: string | null;
  height?: string | null;
  history?: string | null;
  lab_value?: string | null;
  mass?: string | null;
  medication?: string | null;
  nonbiological_location?: string | null;
  occupation?: string | null;
  other_entity?: string | null;
  other_event?: string | null;
  outcome?: string | null;
  personal_background?: string | null;
  qualitative_concept?: string | null;
  quantitative_concept?: string | null;
  severity?: string | null;
  sex?: string | null;
  shape?: string | null;
  sign_symptom?: string | null;
  subject?: string | null;
  texture?: string | null;
  therapeutic_procedure?: string | null;
  time?: string | null;
  volume?: string | null;
  weight?: string | null;
  patient_notes?: string | null;
}
