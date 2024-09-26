// components/SubTabs.js
import React from "react";

interface SubTabsProps {
  selectedTab: string;
  selectedSubTab: string;
  setSelectedSubTab: (subTab: string) => void;
}

const subTabMapping: { [key: string]: { id: string; label: string }[] } = {
  dashboard: [
    { id: "general", label: "General" },
    { id: "projectParameters", label: "Project Parameters" },
    { id: "subprojects", label: "Subprojects" },
    { id: "riskManagement", label: "Risk Management" },
  ],
  tasks: [
    { id: "planning", label: "Planning" },
    { id: "execution", label: "Execution" },
    { id: "closing", label: "Closing" },
    { id: "invoicing", label: "Invoicing" },
  ],
  personnel: [
    { id: "rotation", label: "Rotation" },
    { id: "experience", label: "Experience" },
    { id: "competencies", label: "Competencies" },
    { id: "itinerary", label: "Itinerary" },
  ],
  documents: [
    { id: "technical", label: "Technical" },
    { id: "reports", label: "Reports" },
    { id: "safetyDataSheets", label: "Safety Data Sheets" },
    { id: "handover", label: "Handover" },
  ],
  communication: [
    { id: "mail", label: "Mail" },
    { id: "field", label: "Field" },
    { id: "office", label: "Office" },
    { id: "feedback", label: "Feedback" },
  ],
  material: [
    { id: "resourcePlanner", label: "Resource Planner" },
    { id: "tracking", label: "Tracking" },
    { id: "itemList", label: "Item List" },
    { id: "more", label: "More" },
  ],
  economy: [
    { id: "status", label: "Status" },
    { id: "hours", label: "Hours" },
    { id: "documents", label: "Documents" },
    { id: "invoicing", label: "Invoicing" },
  ],
};

const SubTabs = ({ selectedTab, selectedSubTab, setSelectedSubTab }: SubTabsProps) => {
  const subTabs = subTabMapping[selectedTab] || [];

  if (!subTabs.length) {
    return null;
  }

  return (
    <div className="mt-2 flex flex-wrap md:flex-nowrap w-full">
      {subTabs.map((subTab, index) => (
        <button
          key={subTab.id}
          className={`flex-1 px-4 py-2 text-sm rounded mb-2 md:mb-0 ${index !== subTabs.length - 1 ? "mr-2" : ""} ${
            selectedSubTab === subTab.id ? "bg-[#546872] text-white" : "bg-gray-300 hover:bg-gray-400 text-gray-800"
          }`}
          onClick={() => setSelectedSubTab(subTab.id)}
        >
          {subTab.label}
        </button>
      ))}
    </div>
  );
};

export default SubTabs;
