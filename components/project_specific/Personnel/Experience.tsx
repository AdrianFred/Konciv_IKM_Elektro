import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function ProjectExperience({ token, ocpKey, assignedEmployeeData }: any) {
  const [uniqueIds, setUniqueIds] = useState<number[]>([]);

  useEffect(() => {
    if (assignedEmployeeData?.childItems) {
      const ids = new Set<number>();

      assignedEmployeeData.childItems.forEach((item: any) => {
        item.propertyValues.forEach((propertyValue: any) => {
          // Check if the definition id matches and the value is defined and not empty
          if (propertyValue.definition.id === 12821069 && propertyValue.value) {
            try {
              const parsedValue = JSON.parse(propertyValue.value);
              if (parsedValue && Array.isArray(parsedValue)) {
                parsedValue.forEach((entry: any) => ids.add(entry.id));
              }
            } catch (error) {
              console.error("Error parsing value:", propertyValue.value, error);
            }
          }
        });
      });

      setUniqueIds(Array.from(ids));
    }
  }, [assignedEmployeeData]);

  console.log("Unique IDs:", uniqueIds);

  if (!token || !ocpKey) {
    return null; // Render nothing or a loading spinner while checking local storage
  }

  return (
    <div>
      <div className="w-full h-[calc(100vh-5rem)]">
        <iframe className="w-full h-full border-0" src={`https://tomaxorders.konciv.com/ikme/exp-matrix?token=${token}&itemId=${uniqueIds.join(",")}`}></iframe>
      </div>
    </div>
  );
}
