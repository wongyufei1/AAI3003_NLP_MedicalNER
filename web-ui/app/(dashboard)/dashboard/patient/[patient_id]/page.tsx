"use client";
import React, { useState, useEffect } from "react";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { patientNotesApi } from "@/api/patient_notes";
import type { PatientNotes } from "@/types/patient_notes";
import { useParams } from "next/navigation";
import Visualizer from "@/components/ner-visualiser";

interface Entity {
  start: number;
  end: number;
  entity_group: string;
  score: number;
  word: string;
}

export default function Component() {
  // Get the patient ID from the URL
  const { patient_id } = useParams();
  const [patientNotes, setPatientNotes] = useState<PatientNotes | null>(null);
  const [firebaseData, setFirebaseData] = useState<any | null>(null);

  const handleGetPatientNotes = async () => {
    try {
      if (patient_id) {
        const data = await patientNotesApi.get({
          patient_id: patient_id as string,
        });
        const patientNotes = data.patientData;
        console.log("patientNotes", patientNotes);
        setPatientNotes(patientNotes[0] as PatientNotes);
        setFirebaseData(data.firebaseData.ner as Entity[]);
      }
    } catch (error) {
      console.error("Error getting patient notes", error);
    }
  };

  useEffect(() => {
    handleGetPatientNotes();
  }, []);

  return (
    <div className="flex  justify-center pt-10">
      <Card className="w-full max-w-3xl">
        <CardHeader className="space-y-1">
          <h2 className="text-lg font-bold">Patient Information</h2>
          <p className="text-sm leading-none text-gray-500">ID: {patient_id}</p>
        </CardHeader>
        <CardContent className="grid gap-4">
          {patientNotes &&
            Object.entries(patientNotes).map(([key, value]) => {
              if (value !== "" && key !== "patient_id" && key !== "id") {
                return (
                  <div className="grid gap-1" key={key}>
                    <h3 className="text-sm font-medium">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </h3>
                    <p className="text-sm leading-none">{value}</p>
                  </div>
                );
              }
            })}
          {firebaseData && (
            <div className="grid gap-1">
              <h3 className="text-sm font-medium">NER</h3>
              <Visualizer
                text={patientNotes?.patient_notes as string}
                entities={firebaseData}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
