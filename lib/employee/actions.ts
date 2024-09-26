import { linkItems } from "../api";
import { createItemLinkOrderPayload } from "../payloads";

export const getEventLogs = async (itemId: string, token: string, ocpKey: string) => {
  try {
    const response = await fetch(`https://e2e-tm-prod-services.nsg-e2e.com/api/items/event-log?itemId=${itemId}`, {
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
    console.error("Error fetching event logs:", error);
  }
};

export const saveComment = async (itemId: string, itemName: string, comment: string, token: string, ocpKey: string) => {
  try {
    const response = await fetch(`https://api.konciv.com/api/items/event-log`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        "Ocp-Apim-Subscription-Key": ocpKey,
      },
      body: JSON.stringify([
        {
          value: comment,
          itemId: itemId,
          itemName: itemName,
        },
      ]),
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

export const deleteComment = async (commentId: string, token: string, ocpKey: string) => {
  try {
    const response = await fetch(`https://api.konciv.com/api/items/event-log/${commentId}`, {
      method: "DELETE",
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
    console.error("Error fetching event logs:", error);
  }
};

//Interview notes
export const updateInterviewNotes = async (itemId: string, token: string, ocpKey: string, body: any) => {
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

export const createFirstLinkedNote = async (parentId: string, token: string, ocpKey: string, body: any) => {
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
      //linkItems
      const linkItemsPayload = createItemLinkOrderPayload({ parentItems: [], childItems: [{ id: result[0]?.id }], relatedItems: [] });
      const linkItemsResponse = await linkItems(parentId, token, ocpKey, linkItemsPayload);

      return { result, linkItemsResponse };
    } else {
      if (result) {
        return result;
      } else {
        return null;
      }
    }
  } catch (error) {
    console.error("Error fetching event logs:", error);
  }
};

export const fetchImageDetails = async (filePath: string, token: string, ocpKey: string) => {
  try {
    const response = await fetch(`https://api.konciv.com/api/files/v2/${filePath}`, {
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

    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error("Error fetching image details:", error);
  }
};

// Employee personal preferences apis
export const updatePersonalPreferences = async (itemId: string, token: string, ocpKey: string, body: any) => {
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

export const createFirstLinkedPersonalPreferences = async (parentId: string, token: string, ocpKey: string, body: any) => {
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
      //linkItems
      const linkItemsPayload = createItemLinkOrderPayload({ parentItems: [], childItems: [{ id: result[0]?.id }], relatedItems: [] });
      const linkItemsResponse = await linkItems(parentId, token, ocpKey, linkItemsPayload);

      return { result, linkItemsResponse };
    } else {
      if (result) {
        return result;
      } else {
        return null;
      }
    }
  } catch (error) {
    console.error("Error fetching event logs:", error);
  }
};
