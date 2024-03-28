import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";
import { PatientNotes } from "@/types/patient_notes";
import { firebaseAdapter } from "@/lib/firebase-adapter";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const supabase = createClient();

  const search = searchParams.get("search");
  const patient_id = searchParams.get("patient_id");
  const { data: patient_notes } = await supabase.from("patient_notes").select();

  if (patient_id) {
    const { data: patient_notes } = await supabase
      .from("patient_notes")
      .select()
      .eq("patient_id", patient_id);

    const firebaseData = await firebaseAdapter.get({
      collectionPath: "patientNotes",
      id: patient_id,
    });

    return NextResponse.json({
      message: patient_notes,
      firebaseData: firebaseData,
    });
  }

  if (search) {
    const backendURL = `${process.env.NER_BACKEND_URL}/ner`;

    const { data: axiosData } = await axios.post(
      backendURL,
      {
        patient_notes: search,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const supabaseData = axiosData.supabase_data;

    console.log("supabaseData", typeof supabaseData);

    if (Object.keys(supabaseData).length === 0) {
      console.log("no data");
      return NextResponse.json({ message: [] });
    }

    const fields = Object.keys(supabaseData);

    let query = supabase.from("patient_notes").select();

    fields.forEach((field) => {
      query = query.ilike(field, `%${supabaseData[field]}%`);
    });

    const { data: patient_notes } = await query;

    return NextResponse.json({
      message: patient_notes,
    });

    // Based on the fields, we can filter the patient notes, multiple ilike queries can be used
    // for each field
  }

  //   const { data: patient_notes } = await supabase.from("patient_notes").select();

  return NextResponse.json({ message: patient_notes });
}

export async function POST(request: NextRequest) {
  try {
    const patientNotessupabaseData = await request.json();

    const patientNotes = patientNotessupabaseData.patient_notes;

    const backendURL = `${process.env.NER_BACKEND_URL}/ner`;

    const { data: axiosData } = await axios.post(
      backendURL,
      {
        patient_notes: patientNotes,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const supabaseData = axiosData.supabase_data;
    const firebaseData = axiosData.firebase_data;

    const id = uuidv4();

    const supabase = createClient();
    const patientData: PatientNotes = {
      patient_id: id,
      title: supabaseData.title || "",
      activity: supabaseData.activity || "",
      administration: supabaseData.administration || "",
      age: supabaseData.age || "",
      area: supabaseData.area || "",
      biological_attribute: supabaseData.biological_attribute || "",
      biological_structure: supabaseData.biological_structure || "",
      clinical_event: supabaseData.clinical_event || "",
      color: supabaseData.color || "",
      coreference: supabaseData.coreference || "",
      date: supabaseData.date || "",
      detailed_description: supabaseData.detailed_description || "",
      diagnostic_procedure: supabaseData.diagnostic_procedure || "",
      disease_disorder: supabaseData.disease_disorder || "",
      distance: supabaseData.distance || "",
      dosage: supabaseData.dosage || "",
      duration: supabaseData.duration || "",
      family_history: supabaseData.family_history || "",
      frequency: supabaseData.frequency || "",
      height: supabaseData.height || "",
      history: supabaseData.history || "",
      lab_value: supabaseData.lab_value || "",
      mass: supabaseData.mass || "",
      medication: supabaseData.medication || "",
      nonbiological_location: supabaseData.nonbiological_location || "",
      occupation: supabaseData.occupation || "",
      other_entity: supabaseData.other_entity || "",
      other_event: supabaseData.other_event || "",
      outcome: supabaseData.outcome || "",
      personal_background: supabaseData.personal_background || "",
      qualitative_concept: supabaseData.qualitative_concept || "",
      quantitative_concept: supabaseData.quantitative_concept || "",
      severity: supabaseData.severity || "",
      sex: supabaseData.sex || "",
      shape: supabaseData.shape || "",
      sign_symptom: supabaseData.sign_symptom || "",
      subject: supabaseData.subject || "",
      texture: supabaseData.texture || "",
      therapeutic_procedure: supabaseData.therapeutic_procedure || "",
      time: supabaseData.time || "",
      volume: supabaseData.volume || "",
      weight: supabaseData.weight || "",
      patient_notes: patientNotes,
    };

    const { data, error } = await supabase
      .from("patient_notes")
      .insert([patientData]);

    await firebaseAdapter.set({
      collectionPath: "patientNotes",
      data: {
        patientNotes: patientNotes,
        ner: firebaseData,
      },
      id: id,
    });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ message: "Patient note created successfully" });
  } catch (error) {
    // console.log("error", error);
    console.log("HELLLOoooooo");
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
}
