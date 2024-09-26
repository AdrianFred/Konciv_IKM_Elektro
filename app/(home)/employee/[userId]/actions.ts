export const fetchSpecificEmployee = async (itemType: any, token: string, ocpKey: string, userId: string) => {
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
            dataType: "FILTER",
            operand1: {
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
                  text: itemType.id,
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
            operand2: {
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
                  text: itemType.id,
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
                  text: false,
                },
                operator: "EQ",
              },
              operator: "AND",
            },
            operator: "AND",
          },
          operand2: {
            _type: "operation",
            dataType: "USERGROUP",
            operand1: {
              _type: "itemProperty",
              propertyDefinitionId: itemType.propertyDefinitions.find((pd: any) => pd.name === "User").id,
            },
            operand2: {
              _type: "value",
              dataType: "STRING",
              text: userId,
              array: false,
            },
            operator: "CONTAINS",
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
    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
