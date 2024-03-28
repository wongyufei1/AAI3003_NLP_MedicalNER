import type { PatientNotes } from "@/types/patient_notes";
import axios from "axios";

type PostPatientNotesRequest = {
  patient_notes: string;
};

type GetPatientNotesRequest = {
  search?: string;
  patient_id?: string;
};

type GetPatientNotesResponse = {
  patientData: PatientNotes[];
  firebaseData: any;
};

class PatientNotesApi {
  async get(
    patientNotes: GetPatientNotesRequest,
  ): Promise<PatientNotes[] | any> {
    const { search, patient_id } = patientNotes;
    console.log("search", search);
    console.log("patient_id in indeds", patient_id);

    let axios_data;

    if (search === undefined && patient_id === undefined) {
      axios_data = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/patient_notes`,
      );
    } else if (search) {
      axios_data = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/patient_notes?search=${search}`,
      );
    } else if (patient_id) {
      console.log("patient_id there is", patient_id);
      axios_data = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/patient_notes?patient_id=${patient_id}`,
      );
    }

    if (!axios_data) {
      return [];
    }

    console.log("axios_data", axios_data);

    return {
      patientData: axios_data.data.message,
      firebaseData: axios_data.data?.firebaseData,
    };
  }

  async post(patientNotes: PostPatientNotesRequest): Promise<any> {
    const { patient_notes } = patientNotes;

    const axios_data = await axios.post(
      `${process.env.NEXT_PUBLIC_URL}/api/patient_notes`,
      {
        patient_notes,
      },
    );

    console.log("axios_data", axios_data);
  }
}

export const patientNotesApi = new PatientNotesApi();
