export function getPropertyValueByName({ itemType, projectData, propertyName }) {
  if (!itemType || !projectData) {
    console.error("itemType or projectData is not available.");
    return null;
  }

  // Find the property definition ID by name
  const propertyDefinition = itemType.propertyDefinitions?.find((pd) => pd.name === propertyName);

  if (!propertyDefinition) {
    console.error(`Property "${propertyName}" not found in itemType.`);
    return null;
  }

  // Find the property value in projectData that matches the definition ID
  const propertyValue = projectData.propertyValues?.find((prop) => prop.definition.id === propertyDefinition.id);

  if (!propertyValue) {
    console.error(`Property value for "${propertyName}" not found in projectData.`);
    return null;
  }

  let label = propertyValue.value || "";
  let value = propertyValue.value || "";
  // Check if the value is a JSON stringified array of objects
  if (typeof propertyValue.value === "string") {
    try {
      const parsedValue = JSON.parse(propertyValue.value);

      // Check if the parsed value is an array and has objects with id and name
      if (Array.isArray(parsedValue) && parsedValue.length > 0 && parsedValue[0].id && parsedValue[0].name) {
        label = parsedValue[0].name;
        value = parsedValue[0].id;
      }
    } catch (error) {
      console.warn(`Could not parse value for "${propertyName}". Returning raw value.`);
    }
  }

  // Return in the desired format
  return {
    label,
    value,
  };
}

export function getPropertyValueAsDate({ itemType, projectData, propertyName }) {
  if (!itemType || !projectData) {
    console.error("itemType or projectData is not available.");
    return null;
  }

  // Find the property definition ID by name
  const propertyDefinition = itemType.propertyDefinitions?.find((pd) => pd.name === propertyName);

  if (!propertyDefinition) {
    console.error(`Property "${propertyName}" not found in itemType.`);
    return null;
  }

  // Find the property value in projectData that matches the definition ID
  const propertyValue = projectData.propertyValues?.find((prop) => prop.definition.id === propertyDefinition.id);

  if (!propertyValue) {
    console.error(`Property value for "${propertyName}" not found in projectData.`);
    return null;
  }

  let value = propertyValue.value || "";

  // Check if the value is a string and if it is a valid date
  if (typeof propertyValue.value === "string") {
    try {
      const date = new Date(propertyValue.value);
      if (!isNaN(date.getTime())) {
        value = date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
      } else {
        console.warn(`Value for "${propertyName}" is not a valid date. Returning raw value.`);
      }
    } catch (error) {
      console.warn(`Could not parse date for "${propertyName}". Returning raw value.`);
    }
  }

  // Return the formatted date
  return value;
}

export function getPropertyValueByString({ itemType, projectData, propertyName }) {
  if (!itemType || !projectData) {
    console.error("itemType or projectData is not available.");
    return null;
  }

  // Find the property definition ID by name
  const propertyDefinition = itemType.propertyDefinitions?.find((pd) => pd.name === propertyName);

  if (!propertyDefinition) {
    console.error(`Property "${propertyName}" not found in itemType.`);
    return null;
  }

  // Find the property value in projectData that matches the definition ID
  const propertyValue = projectData.propertyValues?.find((prop) => prop.definition.id === propertyDefinition.id);

  if (!propertyValue) {
    console.error(`Property value for "${propertyName}" not found in projectData.`);
    return null;
  }

  let value = propertyValue.value || "";

  // Return in the desired format
  return value;
}
