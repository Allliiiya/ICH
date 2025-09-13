import React, { useState, useCallback } from 'react';
import Papa from 'papaparse';
import type { Event, EventInput } from '../types/event';

interface CsvDropZoneProps {
  setEvents: React.Dispatch<React.SetStateAction<EventInput[]>>;
}

const CsvDropZone: React.FC<CsvDropZoneProps> = ({ setEvents }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];

        if (!file.name.endsWith(".csv")) {
          alert("Please upload a CSV file");
          return;
        }

        Papa.parse<EventInput>(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            console.log("Parsed CSV data:", results.data);

            // Map CSV rows to Event array
            const newEvents: Event[] = results.data.map((row, idx) => ({
              id: Date.now() + idx, // temporary unique id for frontend
              created_at: new Date().toISOString(),
              ...row,
            }));

            setEvents((prev) => (prev ? [...prev, ...newEvents] : newEvents));
          },
          error: (err) => {
            console.error("CSV parse error:", err);
          },
        });
      }
    },
    [setEvents]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      style={{
        border: "2px dashed gray",
        padding: "40px",
        textAlign: "center",
        borderRadius: "8px",
        backgroundColor: dragActive ? "#f0f0f0" : "white",
      }}
    >
      {dragActive ? "Release to upload CSV" : "Drag & Drop CSV here"}
    </div>
  );
};

export default CsvDropZone;