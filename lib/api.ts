export const fetchData = async (itemTypeId: string, token: string, ocpKey: string) => {
  try {
    const response = await fetch("https://e2e-tm-prod-services.nsg-e2e.com/api/items/v2/search?notificationRequired=false&size=1000&page=0", {
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
              text: itemTypeId,
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
        ordering: [
          {
            _type: "field",
            orderDirection: "DESC",
            orderPosition: 1,
            field: "ITEM_ID",
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    return result; // Assuming the data is in the 'data' field
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const fetchItems = async (itemId: string, token: string, ocpKey: string) => {
  try {
    const response = await fetch(`https://e2e-tm-prod-services.nsg-e2e.com/api/items/${itemId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        "Ocp-Apim-Subscription-Key": ocpKey,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    return result; // Assuming the data is in the 'data' field
  } catch (error) {
    console.error("Error fetching items:", error);
  }
};

export const fetchLinkedItems = async (itemId: string, token: string, ocpKey: string) => {
  try {
    const response = await fetch(`https://e2e-tm-prod-services.nsg-e2e.com/api/items/list/ItemLinks/${itemId}?filter=0`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        "Ocp-Apim-Subscription-Key": ocpKey,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    return result; // Assuming the data is in the 'data' field
  } catch (error) {
    console.error("Error fetching linked items:", error);
  }
};

// Linking items (Parent to Child)
export const linkItems = async (parentId: any, token: string, ocpKey: string, payload: any) => {
  try {
    const response = await fetch(`https://api.konciv.com/api/item/items-link-order/${parentId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        "Ocp-Apim-Subscription-Key": ocpKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();

    return result; // Assuming the data is in the 'data' field
  } catch (error) {
    console.error("Error fetching event logs:", error);
  }
};

// Properties updater
export const updateProperties = async (token: string, ocpKey: string, body: any) => {
  try {
    const response = await fetch(`https://api.konciv.com/api/items/v2/properties?notify=true`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        "Ocp-Apim-Subscription-Key": ocpKey,
      },
      body: JSON.stringify(body), // Body needs to be an array with objects containing the itemId and propertyValues
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    return result; // Assuming the data is in the 'data' field
  } catch (error) {
    console.error("Error fetching event logs:", error);
  }
};

export const createItem = async (token: string, ocpKey: string, body: any) => {
  try {
    const response = await fetch(`https://api.konciv.com/api/items?amount=1`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        "Ocp-Apim-Subscription-Key": ocpKey,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();

    if (result) {
      return result;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching event logs:", error);
  }
};

export const fetchLocations = async (projectId: string, token: string, ocpKey: string) => {
  try {
    const response = await fetch(`https://api.konciv.com/api/locations?size=500&projectId=${projectId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        "Ocp-Apim-Subscription-Key": ocpKey,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    return result; // Assuming the data is in the 'data' field
  } catch (error) {
    console.error("Error fetching locations:", error);
  }
};

export const fetchLoggedUser = async (token: string, ocpKey: string) => {
  try {
    const response = await fetch(`https://api.konciv.com/api/users/me?ignoreErrors=true`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        "Ocp-Apim-Subscription-Key": ocpKey,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error: ${errorData.message || "Request failed when fetching logged user"}`);
    }

    const result = await response.json();
    return result; // Assuming the data is in the 'data' field
  } catch (error) {
    console.error("Error fetching logged user:", error);
  }
};
