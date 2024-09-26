// components/MainTabs.js
import React from "react";

interface MainTabsProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  setSelectedSubTab: (subTab: string) => void;
}

const tabs = [
  { id: "dashboard", label: "Dashboard", defaultSubTab: "general" },
  { id: "tasks", label: "Tasks", defaultSubTab: "planning" },
  { id: "personnel", label: "Personnel", defaultSubTab: "rotation" },
  { id: "documents", label: "Documents", defaultSubTab: "technical" },
  { id: "communication", label: "Communication", defaultSubTab: "mail" },
  { id: "material", label: "Material", defaultSubTab: "resourcePlanner" },
  { id: "economy", label: "Economy", defaultSubTab: "status" },
];

const MainTabs = ({ selectedTab, setSelectedTab, setSelectedSubTab }: MainTabsProps) => (
  <div className="flex flex-wrap md:flex-nowrap w-full">
    {tabs.map((tab, index) => (
      <button
        key={tab.id}
        className={`flex-1 px-4 py-2 text-sm rounded mb-2 md:mb-0 ${index !== tabs.length - 1 ? "mr-2" : ""} ${
          selectedTab === tab.id ? "bg-[#869ea5] text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"
        }`}
        onClick={() => {
          setSelectedTab(tab.id);
          setSelectedSubTab(tab.defaultSubTab);
        }}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default MainTabs;
