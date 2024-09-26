export const createPayload = ({ itemName, itemType, project, updates }: any) => {
  // Retrieve all properties for the selected item type
  const allPropertyDefinitions = itemType?.propertyDefinitions || [];

  // Constructing propertyValues array
  const propertyValues = allPropertyDefinitions.map((def: any) => {
    // Find if this property is in the updates array
    const update = updates.find((u: any) => u.name === def.name);

    // Property structure
    return {
      name: def.name,
      definition: {
        extendedOptions: def.extendedOptions,
        id: def.id,
        name: def.name,
        propertyType: def.propertyType,
        isDefault: def.isDefault,
        options: def.options, // Assuming this contains specifics like options for dropdowns, etc.
        isAdmin: def.isAdmin,
        isMandatory: def.isMandatory,
        order: def.order,
      },
      value: update ? update.value : null, // Set the value if an update is provided, otherwise null
      id: null,
      itemPropertyNotifications: null,
    };
  });

  // Building the overall payload
  const payload = {
    id: null,
    name: itemName,
    propertyValues,
    itemNotifications: [],
    nestedItems: [],
    adminPropertyValues: [],
    type: itemType,
    typeId: itemType.id,
    project: {
      id: project[0].id,
    },
    lastUpdated: null,
    amount: 1,
  };

  return payload;
};

export const createItemLinkOrderPayload = ({ parentItems = [], childItems = [], relatedItems = [] }: any) => {
  return {
    parentItemIds: parentItems.map((item: any) => ({
      id: item.id,
      displayOrder: item.displayOrder || 1, // Default display order to 1 if not provided
    })),
    childItemIds: childItems.map((item: any) => ({
      id: item.id,
      displayOrder: item.displayOrder || null, // Default display order to 1 if not provided
    })),
    relatedItemIds: relatedItems.map((item: any) => ({
      id: item.id,
      displayOrder: item.displayOrder || 1, // Default display order to 1 if not provided
    })),
  };
};

export const createUpdatePayload = ({ itemId, propertyValues, itemTypes }: any) => {
  // Map through propertyValues and find the corresponding property definition ID from itemTypes
  const updatedPropertyValues = propertyValues.map((prop: any) => {
    const definitionId = itemTypes.propertyDefinitions.find((pd: any) => pd.name === prop.name)?.id;

    return {
      definition: {
        id: definitionId,
        name: prop.name,
      },
      value: prop.value,
    };
  });

  return {
    itemId,
    propertyValues: updatedPropertyValues,
  };
};
