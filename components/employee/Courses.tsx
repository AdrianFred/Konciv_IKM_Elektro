import React from "react";

interface Item {
  id: number;
  type: { name: string };
  propertyValues: { definition: { id: number }; value: string }[];
}

interface LinkedItems {
  childItems: Item[];
}

interface CoursesProps {
  linkedItems: any;
  itemTypes: any;
}

export default function Courses({ linkedItems, itemTypes }: CoursesProps) {
  const courses = linkedItems?.childItems?.filter((item: Item) => item.type.name === "Competency");
  const certificates = linkedItems?.childItems?.filter((item: Item) => item.type.name === "Craft Certificates");

  const getColorClass = (expiryDate: string | undefined) => {
    if (!expiryDate) return "";
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "bg-red-300"; // Expired
    if (diffDays <= 30) return "bg-orange-300"; // 1 month or less
    if (diffDays <= 90) return "bg-yellow-300"; // 3 months or less
    if (diffDays >= 91) return "bg-green-300"; // 6 months or less
    return "";
  };

  const renderItems = (items: Item[], itemTypeName: string) => {
    // Determine property definitions based on item type
    const itemType = itemTypes[itemTypeName.toLowerCase()];
    const competencyTypeId = itemType?.propertyDefinitions?.find((pd: any) => pd.name === "Type")?.id;
    const competencyValidThroughId = itemType?.propertyDefinitions?.find((pd: any) => pd.name === "Valid Through")?.id;

    const certificatesProffessionId = itemType?.propertyDefinitions?.find((pd: any) => pd.name === "Profession")?.id;
    const certificatesValidThroughId = itemType?.propertyDefinitions?.find((pd: any) => pd.name === "Valid Through")?.id;

    return items?.map((item) => {
      const name = item.propertyValues.find(
        (prop) => prop.definition.id === competencyTypeId || prop.definition.id === certificatesProffessionId // Fallback ID
      )?.value;
      const expiryDate = item.propertyValues.find(
        (prop) => prop.definition.id === competencyValidThroughId || prop.definition.id === certificatesValidThroughId // Fallback ID
      )?.value;
      const formattedDate = expiryDate ? new Date(expiryDate).toLocaleDateString("en-GB") : "N/A";
      const colorClass = getColorClass(expiryDate);

      return (
        <tr key={item.id} className={colorClass}>
          <td className="px-4 py-2 border">{name}</td>
          <td className="px-4 py-2 border">{formattedDate}</td>
        </tr>
      );
    });
  };

  return (
    <div className="max-w-md mx-auto mt-4 p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-2 text-center">Courses</h2>
      <table className="min-w-full divide-y divide-gray-200 border mb-4">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Course</th>
            <th className="px-4 py-2 border">Expires</th>
          </tr>
        </thead>
        <tbody>{renderItems(courses, "Competency")}</tbody>
      </table>

      <h2 className="text-xl font-bold mb-2 text-center">Certificates</h2>
      <table className="min-w-full divide-y divide-gray-200 border">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Certificate</th>
            <th className="px-4 py-2 border">Expires</th>
          </tr>
        </thead>
        <tbody>{renderItems(certificates, "CraftCertificates")}</tbody>
      </table>
    </div>
  );
}
