"use client";
import React, { useState, useEffect, use } from "react";
import { JSX, SVGProps } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { patientNotesApi } from "@/api/patient_notes";
import type { PatientNotes } from "@/types/patient_notes";

export default function page() {
  const [patientNotes, setPatientNotes] = useState<PatientNotes[]>([]);
  const [search, setSearch] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [noSearchResults, setNoSearchResults] = useState<boolean>(false);

  const handleGetPatientNotes = async () => {
    try {
      const data = await patientNotesApi.get({});
      const patientNotes = data.patientData;
      setPatientNotes(patientNotes);
    } catch (error) {
      console.error("Error getting patient notes", error);
    }
  };

  const handleSearch = async () => {
    try {
      setIsSearching(true);
      const data = await patientNotesApi.get({ search: search });
      const patientNotes = data.patientData;

      if (patientNotes.length === 0) {
        setNoSearchResults(true);
      } else {
        setNoSearchResults(false);
      }

      setPatientNotes(patientNotes);
    } catch (error) {
      console.error("Error searching patient notes", error);
    }

    setIsSearching(false);
  };

  const truncate = (input: string, length: number) => {
    if (!input) {
      return "";
    }

    if (input.length > length) {
      return input.substring(0, length) + "...";
    }
    return input;
  };

  useEffect(() => {
    handleGetPatientNotes();
  }, []);

  // Check if noSearchResults is true, if so, wait 3 seconds and set it back to false
  useEffect(() => {
    if (noSearchResults) {
      const timer = setTimeout(() => {
        setNoSearchResults(false);
        handleGetPatientNotes();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [noSearchResults]);

  return (
    <div className="flex items-center h-screen flex-col px-8 py-10">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center w-full justify-center">
          <div className="flex items-center space-x-2 mr-4">
            <SearchIcon className="w-4 h-4 opacity-25" />
            <Input
              className="w-96"
              placeholder="Describe your patient..."
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button disabled={isSearching} onClick={handleSearch}>
            Search
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-center w-full pt-2">
        <p className="text-xs text-red-500 text-center">
          {noSearchResults ? "No search results found" : ""}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-8">
        {patientNotes &&
          patientNotes.length > 0 &&
          patientNotes.map((patientNote) => (
            <Link
              key={patientNote.patient_id}
              href={`/dashboard/patient/${patientNote.patient_id}`}
            >
              <Card className="space-y-4 hover:shadow-lg cursor-pointer">
                <CardHeader className="space-y-2">
                  <CardTitle>{patientNote.patient_id}</CardTitle>
                  <CardDescription>
                    {truncate(patientNote.patient_notes || "", 100)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center cursor-pointer">
                  <div className="flex space-x-2">
                    <Badge variant="default">{patientNote.sex}</Badge>
                    {/* <Badge variant="default">{patientNote.gender}</Badge> */}
                  </div>

                  <span className="text-xs text-muted-foreground ml-auto">
                    {patientNote.age}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
      </div>

      <div className="flex items-center justify-center w-full pt-8">
        <Link href="/dashboard/create">
          <Button>Create New Patient Note</Button>
        </Link>
      </div>
    </div>
  );
}

function SearchIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ClockIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
