"use client";
import React, { useState } from "react";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { patientNotesApi } from "@/api/patient_notes";
import { useParams, useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const [patientNotes, setPatientNotes] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    console.log("patientNotes", patientNotes);
    try {
      await patientNotesApi.post({ patient_notes: patientNotes });
    } catch (error) {
      console.error("Error submitting patient notes", error);
    }

    setSubmitting(false);
    setPatientNotes("");

    router.push("/dashboard");
  };

  return (
    <div key="1" className="flex items-center justify-center pb-0 pt-6">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-xl">Enter Patient's Notes</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-col gap-1.5">
            <Textarea
              id="script"
              placeholder="Enter the patient's notes here"
              required
              rows={20}
              value={patientNotes}
              onChange={(e) => setPatientNotes(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button disabled={submitting} onClick={handleSubmit} size="sm">
            Submit
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
