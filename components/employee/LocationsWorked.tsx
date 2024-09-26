import React, { useState } from "react";

interface LocationGroup {
  company: string;
  locations: string[];
}

const locationsData: LocationGroup[] = [
  {
    company: "Odfjell",
    locations: ["Deepsea Mira", "Deepsea Yantai", "Deepsea Hercules"],
  },
  {
    company: "Transocean",
    locations: ["Transocean Spitsbergen", "Transocean Searcher", "Transocean Barents"],
  },
  {
    company: "Aker BP",
    locations: [],
  },
  {
    company: "Seadrill",
    locations: [],
  },
  {
    company: "Maersk",
    locations: [],
  },
];

const LocationsWorked: React.FC = () => {
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  const toggleGroup = (company: string) => {
    setOpenGroups((prev) => (prev.includes(company) ? prev.filter((c) => c !== company) : [...prev, company]));
  };

  return (
    <div className="p-4 max-w- mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-4">Locations worked</h2>
      <div className="max-h-96 overflow-y-auto">
        {locationsData.map((group) => (
          <div key={group.company} className="mb-2">
            <button onClick={() => toggleGroup(group.company)} className="w-full flex justify-between items-center text-left text-gray-800 font-semibold py-2 focus:outline-none">
              {group.company}
              <span className="ml-2">{openGroups.includes(group.company) ? "▲" : "▼"}</span>
            </button>
            {openGroups.includes(group.company) && group.locations.length > 0 && (
              <ul className="ml-4 text-gray-600">
                {group.locations.map((location) => (
                  <li key={location} className="py-1">
                    {location}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationsWorked;
