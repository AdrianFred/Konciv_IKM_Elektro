import React, { useState, useEffect } from "react";
import moment from "moment-timezone";
import { updateInterviewNotes, createFirstLinkedNote } from "@/lib/employee/actions";
import { createPayload } from "@/lib/payloads";
import toast from "react-hot-toast";

export default function EmployeeInterviewNotes({ linkedItems, itemTypes, token, ocpKey, project, employee, onNoteCreated }: any) {
  const [notesValue, setNotesValue] = useState<any>(null);
  const [firstLinkedNote, setFirstLinkedNote] = useState<any>(null);

  useEffect(() => {
    const notesItems = linkedItems?.childItems?.filter((item: any) => item.type?.name === "Notes");
    if (notesItems?.length > 0) {
      const { noteValue, noteDate, itemId } = extractNoteDetails(notesItems[0], itemTypes);
      setFirstLinkedNote({ noteValue, noteDate, itemId });
      setNotesValue(noteValue);
    }
  }, [linkedItems, itemTypes]);

  const extractNoteDetails = (noteItem: any, itemTypes: any) => {
    const getPropertyValue = (name: string) => noteItem?.propertyValues?.find((pv: any) => pv.definition.id === itemTypes?.notes?.propertyDefinitions?.find((pd: any) => pd.name === name)?.id)?.value;

    return {
      noteValue: getPropertyValue("Text"),
      noteDate: getPropertyValue("Date"),
      itemId: noteItem.id,
    };
  };

  const handleNoteCreation = async () => {
    const updates = [
      { name: "Text", value: notesValue },
      { name: "Date", value: moment().tz("Europe/Oslo").format("YYYY-MM-DDTHH:mm:ssZ") },
    ];
    const notesPayload = createPayload({ itemName: employee?.name, itemType: itemTypes.notes, project, updates });

    try {
      const response = await createFirstLinkedNote(employee?.id, token, ocpKey, notesPayload);
      if (response) {
        toast.success("Interview notes created successfully!");
        setFirstLinkedNote({ noteValue: notesValue, itemId: response.itemId });
        onNoteCreated();
      }
    } catch {
      toast.error("Error creating interview notes!");
    }
  };

  const handleNoteUpdate = async () => {
    const noteTextDefinitionId = itemTypes.notes.propertyDefinitions.find((pd: any) => pd.name === "Text")?.id;

    const requestBody = [
      {
        itemId: firstLinkedNote?.itemId,
        propertyValues: [
          {
            definition: {
              id: noteTextDefinitionId,
              name: "Text",
            },
            value: notesValue,
          },
        ],
      },
    ];

    try {
      const response = await updateInterviewNotes(firstLinkedNote?.itemId, token, ocpKey, requestBody);
      if (response) {
        toast.success("Interview notes updated successfully!");
        setFirstLinkedNote((prev: any) => ({ ...prev, noteValue: notesValue }));
      }
    } catch {
      toast.error("Error updating interview notes!");
    }
  };

  const handleBlur = async () => {
    if (!firstLinkedNote) {
      await handleNoteCreation();
    } else if (notesValue !== firstLinkedNote.noteValue) {
      await handleNoteUpdate();
    }
  };

  const formattedDate = firstLinkedNote?.noteDate ? moment(firstLinkedNote.noteDate).tz("Europe/Oslo").format("MMMM Do YYYY") : "";

  return (
    <div className="max-w-4xl mx-auto mt-4 p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-2">Employee Interview Notes</h2>
      <div className="mb-2">
        <span className="text-sm">Last updated: {formattedDate}</span>
      </div>
      <div className="mb-2 p-2 border border-gray-300 rounded">
        <textarea className="w-full h-32 p-2 border border-gray-300 rounded" value={notesValue || ""} onChange={(e) => setNotesValue(e.target.value)} onBlur={handleBlur} />
      </div>
    </div>
  );
}
