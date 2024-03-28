// Visualizer.tsx
import React from "react";
import type { PatientNotes } from "@/types/patient_notes";

// types.ts
interface Entity {
  start: number;
  end: number;
  entity_group: string;
  score: number;
  word: string;
}

interface VisualizerProps {
  text: string;
  entities: Entity[];
}

// Tailwind classes for different entity groups
const entityStyles: { [key: string]: string } = {
  AGE: "bg-blue-200 text-blue-800",
  SEX: "bg-pink-200 text-pink-800",
  CLINICAL_EVENT: "bg-green-200 text-green-800",
  SIGN_SYMPTOM: "bg-yellow-200 text-yellow-800",
  HISTORY: "bg-purple-200 text-purple-800",
  LAB_VALUE: "bg-red-200 text-red-800",
  DISEASE_DISORDER: "bg-indigo-200 text-indigo-800",
  DETAILED_DESCRIPTION: "bg-gray-200 text-gray-800",
  THERAPEUTIC_PROCEDURE: "bg-teal-200 text-teal-800",
  DIAGNOSTIC_PROCEDURE: "bg-orange-200 text-orange-800",
  MEDICATION: "bg-yellow-200 text-yellow-800",
  FAMILY_HISTORY: "bg-green-200 text-green-800",
  PERSONAL_BACKGROUND: "bg-blue-200 text-blue-800",
  BIOLOGICAL_ATTRIBUTE: "bg-red-200 text-red-800",
  BIOLOGICAL_STRUCTURE: "bg-indigo-200 text-indigo-800",
  NONBIOLOGICAL_LOCATION: "bg-purple-200 text-purple-800",
  OCCUPATION: "bg-gray-200 text-gray-800",
  OTHER_ENTITY: "bg-teal-200 text-teal-800",
  OTHER_EVENT: "bg-orange-200 text-orange-800",
  OUTCOME: "bg-yellow-200 text-yellow-800",
  QUALITATIVE_CONCEPT: "bg-green-200 text-green-800",
  QUANTITATIVE_CONCEPT: "bg-blue-200 text-blue-800",
  SEVERITY: "bg-red-200 text-red-800",
  SHAPE: "bg-indigo-200 text-indigo-800",
  COLOR: "bg-purple-200 text-purple-800",
  TEXTURE: "bg-gray-200 text-gray-800",
  VOLUME: "bg-teal-200 text-teal-800",
  DISTANCE: "bg-orange-200 text-orange-800",
  DURATION: "bg-yellow-200 text-yellow-800",
  FREQUENCY: "bg-green-200 text-green-800",
  HEIGHT: "bg-blue-200 text-blue-800",
  MASS: "bg-red-200 text-red-800",
  TIME: "bg-indigo-200 text-indigo-800",
  WEIGHT: "bg-purple-200 text-purple-800",
};

const Visualizer: React.FC<VisualizerProps> = ({ text, entities }) => {
  let lastIndex = 0;
  const elements: JSX.Element[] = [];

  // Sort entities by start position
  entities.sort((a, b) => a.start - b.start);

  entities.forEach((entity) => {
    // Text before entity
    if (entity.start > lastIndex) {
      elements.push(
        <span key={`${lastIndex}-start`}>
          {text.substring(lastIndex, entity.start)}
        </span>,
      );
    }
    // Entity text
    elements.push(
      <span
        key={`${entity.start}-${entity.end}`}
        className={`${
          entityStyles[entity.entity_group] || "bg-grey-200"
        } px-1 rounded`}
      >
        {text.substring(entity.start, entity.end)} ({entity.entity_group})
      </span>,
    );
    lastIndex = entity.end;
  });

  // Text after the last entity
  if (lastIndex < text.length) {
    elements.push(
      <span key={`${lastIndex}-end`}>{text.substring(lastIndex)}</span>,
    );
  }

  return <div>{elements}</div>;
};

export default Visualizer;
