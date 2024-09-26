import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import moment from "moment-timezone";

export const generateColumns = (propertyDefinitions: any[]): ColumnDef<any>[] => {
  const defaultColumns: ColumnDef<any>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox checked={table.getIsAllPageRowsSelected()} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />
        </div>
      ),
      cell: ({ row }) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
  ];

  const dynamicColumns: ColumnDef<any>[] = propertyDefinitions.map((def) => {
    // Handle "DATE_ONLY" type properties
    if (def.propertyType === "DATE_ONLY") {
      return {
        accessorKey: def.name,
        header: def.name,
        cell: ({ getValue }) => {
          const dateValue = getValue();
          if (dateValue) {
            return moment.tz(dateValue, "Your/Timezone").format("DD-MM-YYYY"); // Replace 'Your/Timezone' with the desired timezone
          }
          return "";
        },
      };
    }

    // Handle "REFERENCE" type properties
    if (def.propertyType === "REFERENCE") {
      return {
        accessorKey: def.name,
        header: def.name,
        cell: ({ getValue }) => {
          const referenceValue: any = getValue();
          try {
            const parsedValue = JSON.parse(referenceValue);
            if (Array.isArray(parsedValue)) {
              // If there are multiple references, map them to links, each on a new line
              return (
                <div>
                  {parsedValue.map(({ id, name }) => (
                    <div key={id}>
                      <a
                        href={`/path/to/resource/${id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "blue", textDecoration: "underline" }} // Add styles here
                      >
                        {name}
                      </a>
                    </div>
                  ))}
                </div>
              );
            } else if (parsedValue.id && parsedValue.name) {
              // If it's a single reference object, render it as a link
              const { id, name } = parsedValue;
              return (
                <a
                  href={`/path/to/resource/${id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "blue", textDecoration: "underline" }} // Add styles here
                >
                  {name}
                </a>
              );
            }
          } catch (error) {
            // Handle parsing error
            console.error("Error parsing reference value:", error);
          }
          return referenceValue;
        },
      };
    }

    // Default case for other property types
    return {
      accessorKey: def.name,
      header: def.name,
    };
  });

  return [...defaultColumns, ...dynamicColumns];
};

export const initialColumns: ColumnDef<any>[] = generateColumns([]);
