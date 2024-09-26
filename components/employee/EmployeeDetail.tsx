import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import moment from "moment-timezone";
import { createUpdatePayload } from "@/lib/payloads";
import { updateProperties } from "@/lib/api";
import { fetchImageDetails } from "@/lib/employee/actions";
import Image from "next/image";

export default function EmployeeDetail({ data, itemTypes, token, ocpKey }: any) {
  const [initialValues, setInitialValues] = useState<any>({});
  const [currentValues, setCurrentValues] = useState<any>({});
  const [imageDetails, setImageDetails] = useState<any>(null); // State to store the image details

  // Memoize getPropertyValue using useCallback
  const getPropertyValue = useCallback(
    (definitionId: number) => {
      const property = data?.propertyValues?.find((value: any) => value.definition.id === definitionId);
      return property ? property.value : "";
    },
    [data]
  );

  const getImageUrl = useCallback(
    (definitionId: number) => {
      const property = data?.propertyValues?.find((value: any) => value.definition.id === definitionId);

      if (property && property.files.length > 0) {
        // Map through the files array and modify the filePath
        return property.files.map((file: any) => ({
          ...file, // Keep the other properties (fileName, etc.) unchanged
          filePath: file.filePath.split("/files/")[1], // Only keep the part after /files/
        }));
      }

      return [];
    },
    [data]
  );

  // Initialize initialValues and currentValues when data or itemTypes change
  useEffect(() => {
    const initialPropertyValues: any = {};

    itemTypes?.employee?.propertyDefinitions.forEach((property: any) => {
      initialPropertyValues[property.id] = getPropertyValue(property.id) || "";
    });

    setInitialValues(initialPropertyValues);
    setCurrentValues(initialPropertyValues);
  }, [data, itemTypes, getPropertyValue]);

  // Fetch the image details using the file path
  const fetchAndSetImageDetails = useCallback(async () => {
    // Find the image property definition
    const imageProperty = itemTypes?.employee?.propertyDefinitions.find((pd: any) => pd.name === "Image");

    if (imageProperty) {
      // Get the image file path using the definition ID
      const imageFiles = getImageUrl(imageProperty.id);
      const filePath = imageFiles?.[0]?.filePath;

      if (filePath) {
        try {
          // Fetch image details from the API using the filePath
          const imageDetailResponse = await fetchImageDetails(filePath, token, ocpKey);
          setImageDetails(imageDetailResponse); // Save the response in the state
        } catch (error) {
          toast.error("Failed to fetch image details.");
        }
      }
    }
  }, [itemTypes, getImageUrl, token, ocpKey]);

  // Fetch image details on component mount
  useEffect(() => {
    fetchAndSetImageDetails();
  }, [fetchAndSetImageDetails]);

  // Handle input changes
  const handleInputChange = (propertyId: number, newValue: any) => {
    setCurrentValues((prev: any) => ({
      ...prev,
      [propertyId]: newValue,
    }));
  };

  const handleNameChange = (newValue: string) => {
    setCurrentValues((prev: any) => ({
      ...prev,
      name: newValue,
    }));
  };

  // Helper function to format date for the input[type="date"] element
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = moment.tz(dateString, "Europe/Oslo");
    return date.format("YYYY-MM-DD"); // Convert to "YYYY-MM-DD"
  };

  // Handle date input change
  const handleDateChange = (propertyId: number, dateValue: string) => {
    const formattedDate = moment.tz(dateValue, "Europe/Oslo").format("YYYY-MM-DDTHH:mm:ssZ");
    handleInputChange(propertyId, formattedDate);
  };

  // Render form fields
  const renderField = (property: any, value: any) => {
    switch (property.propertyType) {
      case "STRING":
        return (
          <div key={property.id} className="mb-2 w-1/2 px-1">
            <label className="block text-gray-700 text-xs font-bold mb-1">{property.name}</label>
            <input
              type="text"
              value={currentValues[property.id] || ""}
              onChange={(e) => handleInputChange(property.id, e.target.value)}
              className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        );
      case "NUMERIC":
        return (
          <div key={property.id} className="mb-2 w-1/2 px-1">
            <label className="block text-gray-700 text-xs font-bold mb-1">{property.name}</label>
            <input
              type="number"
              value={currentValues[property.id] || ""}
              onChange={(e) => handleInputChange(property.id, e.target.value)}
              className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        );
      case "DATE_ONLY":
        return (
          <div key={property.id} className="mb-2 w-1/2 px-1">
            <label className="block text-gray-700 text-xs font-bold mb-1">{property.name}</label>
            <input
              type="date"
              value={formatDateForInput(currentValues[property.id] || value)}
              onChange={(e) => handleDateChange(property.id, e.target.value)}
              className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        );
      case "LIST":
        const options = JSON.parse(property.options);
        return (
          <div key={property.id} className="mb-2 w-1/2 px-1">
            <label className="block text-gray-700 text-xs font-bold mb-1">{property.name}</label>
            <select
              value={currentValues[property.id] || ""}
              onChange={(e) => handleInputChange(property.id, e.target.value)}
              className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select</option>
              {options.map((option: any, index: any) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );
      default:
        return null;
    }
  };

  // Handle the Save button click
  const handleSave = async () => {
    const changedValues = Object.keys(currentValues)
      .filter((key) => currentValues[key] !== initialValues[key])
      .map((key) => ({
        name: itemTypes.employee.propertyDefinitions.find((pd: any) => pd.id == key).name,
        value: currentValues[key],
      }));

    const payload = createUpdatePayload({
      itemId: data.id,
      propertyValues: changedValues,
      itemTypes: itemTypes.employee,
    });

    console.log("Payload:", payload);

    if (payload && changedValues.length > 0) {
      try {
        const response = await updateProperties(token, ocpKey, [payload]);
        if (response) {
          toast.success("Employee details updated successfully!");
        } else {
          toast.error("Error updating employee details!");
        }
      } catch {
        toast.error("Error updating employee details!");
      }
    } else if (payload && changedValues.length === 0) {
      toast("No changes detected.");
    }
  };

  return (
    <div className="max-w-4xl min-w-4xl mx-auto mt-4 p-4 bg-white shadow-md rounded-lg">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold mb-4">Employee Details</h2>
        {imageDetails ? (
          <Image src={URL.createObjectURL(imageDetails)} alt="Employee Image" className="w-24 h-24 object-cover rounded-lg" width={1200} height={320} />
        ) : (
          <Image
            src="/assets/images/placeholder.jpg" // Placeholder image path
            alt="Placeholder Image"
            className="w-24 h-24 object-cover rounded-lg"
            width={1200}
            height={320}
          />
        )}
      </div>
      <div className="mb-4">
        <span className="block text-gray-700 text-sm font-bold">Name:</span>
        <input
          type="text"
          value={currentValues?.name || data?.name || ""}
          onChange={(e) => handleNameChange(e.target.value)}
          className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="flex flex-wrap -mx-1">{itemTypes?.employee?.propertyDefinitions.map((property: any) => renderField(property, getPropertyValue(property.id)))}</div>
      <div className="flex items-center justify-between mt-2">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
}
