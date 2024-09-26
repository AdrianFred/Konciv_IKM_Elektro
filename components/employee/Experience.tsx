import React from "react";

type PropertyValue = {
  id: number;
  value?: string;
  definition: { id: number };
};

type Item = {
  id: number;
  name: string;
  type: { id: number; name: string };
  propertyValues: PropertyValue[];
  project: { id: number; name: string };
  displayOrder: number;
};

type LinkedItemsProps = {
  linkedItems: any;
  itemTypes: any;
  experienceGroups: any;
};

export default function Experience({ linkedItems, itemTypes, experienceGroups }: LinkedItemsProps) {
  // Filter experiences of type 'Experience'
  const experiences = linkedItems?.childItems?.filter((item: Item) => item.type.name === "Experience");
  console.log("Experiences:", experiences);
  console.log("Experience Groups:", experienceGroups);

  // Process experience groups to build a mapping
  const experienceMapping = processExperienceGroups(experienceGroups);

  // Get top 8 experiences with proper name and hours
  const topExperiences = experiences
    ?.map((experience: any) => {
      // Get the category name based on definition IDs
      const categoryValue = experience.propertyValues.find((prop: any) => prop.definition.id === 14823134)?.value;
      const alternativeName = experience.propertyValues.find((prop: any) => prop.definition.id === 14823142)?.value;
      const name = alternativeName || categoryValue || "Unknown";

      // Get the hours for the experience
      const hoursStr = experience.propertyValues.find((prop: any) => prop.definition.id === 14823140)?.value || "0";
      const hours = parseInt(hoursStr, 10);

      // Normalize the experience name for matching
      const normalizedName = name.trim().toLowerCase();

      // Get group and thresholds from mapping
      const mapping = experienceMapping[normalizedName];

      // Compute level
      const level = getLevel(hours, mapping?.thresholds);

      // Get background style
      const backgroundStyle = getBackgroundStyle(hours, mapping?.thresholds);

      return { name, hours, level, backgroundStyle };
    })
    // Sort by hours descending to get top 8
    .sort((a: any, b: any) => b.hours - a.hours)
    // Take the top 8 items
    .slice(0, 8);

  // Function to process experience groups and build the mapping
  function processExperienceGroups(experienceGroups: any) {
    const experienceMapping: any = {};

    if (Array.isArray(experienceGroups)) {
      experienceGroups.forEach((group: any) => {
        const groupNamePV = group.propertyValues.find((pv: any) => pv.definitionId === 14952706);
        const groupName = groupNamePV ? groupNamePV.value : null;

        const experienceNamesPV = group.propertyValues.find((pv: any) => pv.definitionId === 14952708);
        const experienceNamesStr = experienceNamesPV ? experienceNamesPV.value : "";
        const experienceNames = experienceNamesStr.split(",").map((name: string) => name.trim());

        // Thresholds
        const thresholds: any[] = [];

        // Level 1
        const level1ThresholdPV = group.propertyValues.find((pv: any) => pv.definitionId === 14952709);
        const level1Threshold = level1ThresholdPV ? parseThreshold(level1ThresholdPV.value) : null;
        if (level1Threshold) {
          thresholds.push({ level: 1, ...level1Threshold });
        }
        // Level 2
        const level2ThresholdPV = group.propertyValues.find((pv: any) => pv.definitionId === 14952710);
        const level2Threshold = level2ThresholdPV ? parseThreshold(level2ThresholdPV.value) : null;
        if (level2Threshold) {
          thresholds.push({ level: 2, ...level2Threshold });
        }
        // Level 3
        const level3ThresholdPV = group.propertyValues.find((pv: any) => pv.definitionId === 14952711);
        const level3Threshold = level3ThresholdPV ? parseThreshold(level3ThresholdPV.value) : null;
        if (level3Threshold) {
          thresholds.push({ level: 3, ...level3Threshold });
        }

        // Map experience names to group and thresholds
        experienceNames.forEach((name: string) => {
          const normalizedName = name.trim().toLowerCase();
          experienceMapping[normalizedName] = {
            groupName,
            thresholds,
          };
        });
      });
    } else {
      console.warn("No experience groups provided or invalid format.");
    }

    return experienceMapping;
  }

  // Function to parse thresholds like '0-500' or '1500+'
  function parseThreshold(value: string) {
    value = value.trim();
    if (value.includes("-")) {
      const [minStr, maxStr] = value.split("-");
      const min = parseInt(minStr, 10);
      const max = parseInt(maxStr, 10);
      return { min, max };
    } else if (value.endsWith("+")) {
      const minStr = value.slice(0, -1);
      const min = parseInt(minStr, 10);
      return { min, max: Infinity };
    } else {
      console.error(`Invalid threshold format: ${value}`);
      return null;
    }
  }

  // Function to get the level based on hours and thresholds
  function getLevel(hours: number, thresholds: any) {
    if (!thresholds) return "Level 0";

    for (let i = thresholds.length - 1; i >= 0; i--) {
      const threshold = thresholds[i];
      if (hours >= threshold.min) {
        return `Level ${threshold.level}`;
      }
    }
    return "Level 0";
  }

  // Function to get the background style based on hours and thresholds
  function getBackgroundStyle(hours: number, thresholds: any) {
    if (!thresholds) {
      // Default background
      return {
        background: `linear-gradient(to right, #d1d5db 0%, #d1d5db 100%)`,
      };
    }

    // Find the level
    for (let i = thresholds.length - 1; i >= 0; i--) {
      const threshold = thresholds[i];
      if (hours >= threshold.min) {
        let percentage = 0;
        if (threshold.max === Infinity) {
          percentage = 100;
        } else {
          percentage = ((hours - threshold.min) / (threshold.max - threshold.min)) * 100;
          if (percentage > 100) percentage = 100;
          if (percentage < 0) percentage = 0;
        }
        let color = "#86efac"; // Tailwind's green-300
        return {
          background: `linear-gradient(to right, ${color} ${percentage}%, #d1d5db ${percentage}%)`,
        };
      }
    }
    // If no thresholds matched
    return {
      background: `linear-gradient(to right, #d1d5db 0%, #d1d5db 100%)`,
    };
  }

  return (
    <div className="max-w-2xl mx-auto mt-4 p-4 bg-white shadow-md rounded-lg">
      {/* Main Title */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold">Mechanic</h2>
        <div className="bg-green-300 rounded px-2 inline-block mt-1">Level 2</div>
      </div>

      {/* Categories */}
      {topExperiences && topExperiences.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {/* Divide topExperiences into two columns */}
          {topExperiences.map((exp: any, index: any) => (
            <div key={index} className={`flex flex-col mb-2 ${index < 4 ? "" : "col-span-1"}`}>
              <div className="text-sm">{exp.name}</div>
              <div className="rounded px-2 py-1 text-sm text-center border" style={exp.backgroundStyle}>
                {exp.level}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Display a message if no experiences are found
        <div className="text-center text-gray-500">No experiences found.</div>
      )}
    </div>
  );
}
