import React, { useEffect, useState, useCallback } from "react";
import { updatePersonalPreferences } from "@/lib/employee/actions";
import toast from "react-hot-toast";

export default function PersonalPreferences({ linkedItems, itemTypes, token, ocpKey }: any) {
  const [personalPreferences, setPersonalPreferences] = useState<any>(null);
  const [propertyDefinitions, setPropertyDefinitions] = useState<any>([]);
  const [inputValues, setInputValues] = useState<any>({}); // State to track input values for each property
  const [initialInputValues, setInitialInputValues] = useState<any>({}); // Track initial values for comparison

  // Function to initialize input values
  const initializeInputValues = useCallback((personalPreferencesItem: any) => {
    const parseValue = (value: string) => {
      if (!value) return [""];
      const groups = value.match(/\{(.*?)\}/g);
      return groups ? groups.map((group) => group.replace(/[{}]/g, "")) : [value];
    };
    const initialValues = {};
    personalPreferencesItem.propertyValues.forEach((propertyValue: any) => {
      const values = parseValue(propertyValue.value);
      (initialValues as any)[propertyValue.definition.id] = values;
    });
    setInputValues(initialValues);
    setInitialInputValues(initialValues); // Save initial values for comparison
  }, []);

  useEffect(() => {
    const personalPreferencesItem = linkedItems?.childItems?.find((item: any) => item.type?.name === "Personal Preferences");
    if (personalPreferencesItem) {
      setPersonalPreferences(personalPreferencesItem);
      setPropertyDefinitions(itemTypes?.personalpreferences?.propertyDefinitions || []);
      initializeInputValues(personalPreferencesItem); // Initialize input fields based on existing values
    }
  }, [linkedItems, itemTypes, initializeInputValues]);

  // Function to handle input change
  const handleInputChange = (propertyId: number, index: number, newValue: string) => {
    const updatedValues = [...(inputValues[propertyId] || [])];
    updatedValues[index] = newValue;
    setInputValues((prevState: any) => ({
      ...prevState,
      [propertyId]: updatedValues,
    }));
  };

  // Function to format input values into the "{value1},{value2}" format
  const formatInputValues = (valuesArray: string[]) => {
    return valuesArray.length > 0 ? `{${valuesArray.join("},{")}}` : "{}"; // Return empty curly braces if no values
  };

  // Function to handle input blur
  const handleBlur = async (propertyId: number) => {
    const currentValuesFormatted = formatInputValues(inputValues[propertyId] || []);
    const initialValuesFormatted = formatInputValues(initialInputValues[propertyId] || []);

    // Only proceed if the values have changed
    if (currentValuesFormatted !== initialValuesFormatted) {
      console.log(`Values for property ${propertyId} have changed:`, currentValuesFormatted);

      // Find the property definition name by ID
      const propertyDefinition = propertyDefinitions.find((def: any) => def.id === propertyId);
      const propertyName = propertyDefinition ? propertyDefinition.name : "Text";

      // Build the request body
      const requestBody = [
        {
          itemId: personalPreferences?.id,
          propertyValues: [
            {
              definition: {
                id: propertyId,
                name: propertyName,
              },
              value: currentValuesFormatted, // Formatted value
            },
          ],
        },
      ];

      console.log("Request Body to Save Changes:", requestBody);

      try {
        const response = await updatePersonalPreferences(personalPreferences?.id, token, ocpKey, requestBody);
        if (response) {
          toast.success("Personal Preferences updated successfully!");
        }
      } catch {
        toast.error("Error updating Personal Preferences!");
      }
    } else {
      console.log(`Values for property ${propertyId} have not changed.`);
    }
  };

  // Function to handle adding new inputs dynamically
  const handleAddInput = (propertyId: number) => {
    setInputValues((prevState: any) => ({
      ...prevState,
      [propertyId]: [...(prevState[propertyId] || []), ""],
    }));
  };

  console.log("personalPreferences:", personalPreferences);
  return (
    <div className="max-w-md mx-auto mt-4 p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Personal Preferences</h2>
      <div className="overflow-y-auto max-h-[680px]">
        {personalPreferences ? (
          <table className="min-w-full divide-y divide-gray-200 border">
            <tbody className="bg-white divide-y divide-gray-200">
              {propertyDefinitions.map((property: any) => {
                const values = inputValues[property.id] || [""];
                return (
                  <tr key={property.id} className="whitespace-nowrap">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r">{property.name}:</td>
                    <td className="px-6 py-4 text-sm text-gray-500 flex flex-col">
                      {values.map((value: string, index: number) => (
                        <div key={index} className="relative mb-2">
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => handleInputChange(property.id, index, e.target.value)}
                            onBlur={() => handleBlur(property.id)} // Call handleBlur on blur event
                            className="w-full border border-gray-300 rounded px-2 py-1"
                          />
                          {index === values.length - 1 && (
                            <button type="button" onClick={() => handleAddInput(property.id)} className="absolute top-1 right-2 text-blue-500 hover:text-blue-700">
                              +
                            </button>
                          )}
                        </div>
                      ))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">No personal preferences available.</p>
        )}
      </div>
    </div>
  );
}
