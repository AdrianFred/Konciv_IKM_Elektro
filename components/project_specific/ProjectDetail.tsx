import React, { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-hot-toast";
import moment from "moment-timezone";
import { createUpdatePayload } from "@/lib/payloads";
import { updateProperties } from "@/lib/api";
import { ComboSelect } from "../ComboSelect";
import { Input } from "../ui/input";

export default function ProjectDetail({ data, itemTypes, token, ocpKey, projects, locations }: any) {
  const [initialValues, setInitialValues] = useState<any>({});
  const [currentValues, setCurrentValues] = useState<any>({});
  const [referenceOptions, setReferenceOptions] = useState<any>({}); // Store fetched reference options
  const fetchedOptionIdsRef = useRef<Set<number>>(new Set()); // Use a ref to track fetched optionIds

  // Memoize getPropertyValue using useCallback
  const getPropertyValue = useCallback(
    (definitionId: number) => {
      const property = data?.propertyValues?.find((value: any) => value.definition.id === definitionId);
      return property ? property.value : "";
    },
    [data]
  );

  // Memoize fetchReferenceOptions using useCallback
  const fetchReferenceOptions = useCallback(
    async (definitionId: number, optionId: number) => {
      // Check if this optionId has already been fetched
      if (fetchedOptionIdsRef.current.has(optionId)) {
        console.log(`Option ID ${optionId} already fetched.`);
        return; // Skip fetching if this optionId has already been fetched
      }

      try {
        const response = await fetch("https://api.konciv.com/api/items/v2/search?notificationRequired=false&size=50&page=0", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
            "Ocp-Apim-Subscription-Key": ocpKey,
          },
          body: JSON.stringify({
            filter: {
              _type: "operation",
              dataType: "FILTER",
              operand1: {
                _type: "operation",
                dataType: "NUMERIC",
                operand1: {
                  _type: "field",
                  field: "ITEM_TYPE_ID",
                },
                operand2: {
                  _type: "value",
                  dataType: "NUMERIC",
                  text: optionId.toString(),
                },
                operator: "EQ",
              },
              operand2: {
                _type: "operation",
                dataType: "BOOLEAN",
                operand1: {
                  _type: "field",
                  field: "DELETED",
                },
                operand2: {
                  _type: "value",
                  dataType: "BOOLEAN",
                  text: "false",
                },
                operator: "EQ",
              },
              operator: "AND",
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("API Response Data:", data);
          if (data) {
            setReferenceOptions((prev: any) => ({
              ...prev,
              [definitionId]: data.map((item: any) => {
                return {
                  label: item.name, // Use item.name for the display label
                  value: item.id, // Use item.id as the value
                };
              }),
            }));
            // Mark this optionId as fetched
            fetchedOptionIdsRef.current.add(optionId);
          } else {
            console.warn("No items found in API response.");
          }
        } else {
          // Log more details about the failure
          const errorText = await response.text();
          console.error(`Failed to fetch reference options: ${response.status} ${response.statusText}`);
          console.error(`Response Text: ${errorText}`);
          toast.error(`Failed to fetch reference options: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error fetching reference options:", error);
        toast.error("Error fetching reference options!");
      }
    },
    [token, ocpKey] // Dependencies
  );

  // Initialize initialValues and currentValues when data or itemTypes change
  useEffect(() => {
    const initialPropertyValues: any = {};

    itemTypes?.project?.propertyDefinitions.forEach((property: any) => {
      initialPropertyValues[property.id] = getPropertyValue(property.id) || "";
      // Fetch reference options if propertyType is REFERENCE
      if (property.propertyType === "REFERENCE" && property.options) {
        let optionId;
        try {
          optionId = JSON.parse(property.options)[0];
        } catch (error) {
          console.error("Error parsing property options:", error, property.options);
        }
        if (optionId) {
          fetchReferenceOptions(property.id, optionId);
        } else {
          console.warn("Invalid or empty optionId for property:", property);
        }
      }
    });

    // Initialize area and location from the data
    initialPropertyValues.area = data?.project?.name || "";
    initialPropertyValues.location = data?.itemLocation?.locationValue?.name || "";

    setInitialValues(initialPropertyValues);
    setCurrentValues(initialPropertyValues);
  }, [data, itemTypes, getPropertyValue, fetchReferenceOptions]); // Included fetchReferenceOptions

  // Handle input changes
  const handleInputChange = (propertyId: string, newValue: any) => {
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
  const handleDateChange = (propertyId: string, dateValue: string) => {
    const formattedDate = moment.tz(dateValue, "Europe/Oslo").format("YYYY-MM-DDTHH:mm:ssZ");
    handleInputChange(propertyId, formattedDate);
  };

  // Render form fields based on property type
  const renderField = (property: any, value: any) => {
    switch (property.propertyType) {
      case "STRING":
        return (
          <div key={property.id} className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">{property.name}</label>
            <Input type="text" value={currentValues[property.id] || ""} onChange={(e) => handleInputChange(property.id, e.target.value)} />
          </div>
        );
      case "NUMERIC":
        return (
          <div key={property.id} className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">{property.name}</label>
            <Input type="number" value={currentValues[property.id] || ""} onChange={(e) => handleInputChange(property.id, e.target.value)} />
          </div>
        );
      case "DATE_ONLY":
        return (
          <div key={property.id} className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">{property.name}</label>
            <Input type="date" value={formatDateForInput(currentValues[property.id] || value)} onChange={(e) => handleDateChange(property.id, e.target.value)} />
          </div>
        );
      case "LIST":
        const options = JSON.parse(property.options);
        return (
          <div key={property.id} className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">{property.name}</label>
            <ComboSelect
              options={options}
              placeholder="Select"
              selectedValue={options.find((opt: any) => opt.value === currentValues[property.id]) || null}
              onSelect={(selected) => handleInputChange(property.id, selected ? selected.value : "")}
            />
          </div>
        );
      case "REFERENCE":
        // Use currentValues or fallback to initial value
        const propertyValue = currentValues[property.id] || getPropertyValue(property.id);
        const referenceValue = JSON.parse(propertyValue || "[]")[0] || {};
        const selectedOption = referenceOptions[property.id]?.find((opt: any) => opt.value === referenceValue.id);

        return (
          <div key={property.id} className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">{property.name}</label>
            <ComboSelect
              options={referenceOptions[property.id] || []} // Use the options from referenceOptions
              placeholder="Select"
              selectedValue={selectedOption || null} // Set the selected value correctly
              onSelect={(selected) => {
                // Handle selection and update currentValues
                handleInputChange(property.id, selected ? JSON.stringify([{ id: selected.value, name: selected.label }]) : "");
              }}
            />
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
        name: itemTypes.project.propertyDefinitions.find((pd: any) => pd.id == key)?.name || key,
        value: currentValues[key],
      }));

    const payload = createUpdatePayload({
      itemId: data.id,
      propertyValues: changedValues,
      itemTypes: itemTypes.project,
    });

    if (payload && changedValues.length > 0) {
      try {
        const response = await updateProperties(token, ocpKey, [payload]);
        if (response) {
          toast.success("Project details updated successfully!");
        } else {
          toast.error("Error updating project details!");
        }
      } catch {
        toast.error("Error updating project details!");
      }
    } else if (payload && changedValues.length === 0) {
      toast("No changes detected.");
    }
  };

  console.log("Reference Options:", referenceOptions);
  console.log("Fetched Option IDs:", fetchedOptionIdsRef.current);

  return (
    <div className="max-w-5xl mx-auto mt-6 p-4 sm:p-6 bg-white shadow-lg rounded-lg">
      {/* Top Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 p-4 bg-gray-100 rounded-lg">
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Item ID</label>
          <Input type="text" value={data?.id || ""} disabled />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Project Name *</label>
          <Input type="text" value={currentValues?.name || data?.name || ""} onChange={(e) => handleNameChange(e.target.value)} />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Area *</label>
          <ComboSelect
            options={projects.map((project: any) => ({
              label: project.name,
              value: project.name,
            }))}
            placeholder="Select Area"
            selectedValue={currentValues.area ? { label: currentValues.area, value: currentValues.area } : null}
            onSelect={(selected) => handleInputChange("area", selected ? selected.value : "")}
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Item Type *</label>
          <Input type="text" value={currentValues?.itemType || data?.type?.name || ""} disabled />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Created By</label>
          <Input type="text" value={data?.createdByName || ""} disabled />
        </div>{" "}
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Location</label>
          <ComboSelect
            options={locations.map((location: any) => ({
              label: location.name,
              value: location.name,
            }))}
            placeholder="Select Location"
            selectedValue={
              currentValues.location
                ? {
                    label: currentValues.location,
                    value: currentValues.location,
                  }
                : null
            }
            onSelect={(selected) => handleInputChange("location", selected ? selected.value : "")}
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Last Updated</label>
          <Input type="text" value={moment(data?.lastUpdated).format("YYYY-MM-DD HH:mm") || ""} disabled />
        </div>
      </div>

      {/* Horizontal Line Separator */}
      <hr className="border-t-2 border-gray-200 my-6" />

      {/* Remaining Project Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {itemTypes?.project?.propertyDefinitions.map((property: any) => renderField(property, getPropertyValue(property.id)))}
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 sm:px-6 rounded-lg focus:outline-none focus:shadow-outline" type="button" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
}
