// // DataTable.tsx
// "use client";
// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import { ColumnDef, flexRender, getCoreRowModel, useReactTable, ColumnOrderState } from "@tanstack/react-table";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
// import { FaPlus, FaEllipsisV, FaSync, FaSearch, FaFilter } from "react-icons/fa";
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Check, ChevronsUpDown } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { generateColumns } from "./columns"; // Import the generateColumns function
// import { useRouter } from "next/navigation";

// interface DataTableProps {
//   // data: any[];
//   itemTypes: Record<string, any>;
//   token: string;
//   ocpKey: string;
// }

// interface ColumnVisibility {
//   [key: string]: boolean;
// }

// export default function DataTable({ itemTypes, token, ocpKey }: DataTableProps) {
//   const router = useRouter();
//   const [filter, setFilter] = useState("");
//   const [open, setOpen] = useState(false);
//   const [value, setValue] = useState("");
//   const [selectedItemType, setSelectedItemType] = useState<any>(null);
//   const [filteredData, setFilteredData] = useState<any[]>([]);
//   const [columns, setColumns] = useState<ColumnDef<any>[]>(generateColumns([])); // Initialize with generateColumns
//   const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});
//   const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
//   const [lastSelectedRowId, setLastSelectedRowId] = useState<string | null>(null);

//   const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(
//     generateColumns([]).reduce((acc, column: any) => {
//       acc[column.accessorKey as string] = true; // Ensure all columns are visible initially
//       return acc;
//     }, {} as ColumnVisibility)
//   );

//   const [loading, setLoading] = useState<boolean>(false); // New loading state

//   const itemTypeValues = useMemo(() => Object.values(itemTypes), [itemTypes]);

//   useEffect(() => {
//     const storedItemType = localStorage.getItem("itemType");
//     if (storedItemType) {
//       const selectedType = itemTypeValues.find((itemType: any) => itemType.name === storedItemType);
//       setValue(storedItemType);
//       setSelectedItemType(selectedType);
//       if (selectedType) {
//         const newColumns = generateColumns(selectedType.propertyDefinitions); // Generate columns dynamically
//         setColumns(newColumns);

//         // Load column visibility from localStorage
//         const storedVisibility = localStorage.getItem(`columnVisibility_${selectedType.name}`);
//         if (storedVisibility) {
//           setColumnVisibility(JSON.parse(storedVisibility));
//         } else {
//           // Use default visibility
//           const newVisibility = newColumns.reduce((acc, column: any) => {
//             acc[column.accessorKey as string] = column.accessorKey === "name" || selectedType.options.includes(column.header) || column.id === "select";
//             return acc;
//           }, {} as ColumnVisibility);
//           setColumnVisibility(newVisibility);
//         }
//       }
//     }
//   }, [itemTypeValues]);

//   useEffect(() => {
//     if (selectedItemType) {
//       localStorage.setItem("itemType", selectedItemType.name);
//     }
//   }, [selectedItemType]);

//   // Save column visibility to localStorage whenever it changes
//   useEffect(() => {
//     if (selectedItemType) {
//       localStorage.setItem(`columnVisibility_${selectedItemType.name}`, JSON.stringify(columnVisibility));
//     }
//   }, [columnVisibility, selectedItemType]);

//   const fetchData = useCallback(
//     async (itemTypeId: string) => {
//       setLoading(true); // Start loading
//       try {
//         const response = await fetch("https://e2e-tm-prod-services.nsg-e2e.com/api/items/v2/search?notificationRequired=false&size=1000&page=0", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: token,
//             "Ocp-Apim-Subscription-Key": ocpKey,
//           },
//           body: JSON.stringify({
//             filter: {
//               _type: "operation",
//               dataType: "FILTER",
//               operand1: {
//                 _type: "operation",
//                 dataType: "NUMERIC",
//                 operand1: {
//                   _type: "field",
//                   field: "ITEM_TYPE_ID",
//                 },
//                 operand2: {
//                   _type: "value",
//                   dataType: "NUMERIC",
//                   text: itemTypeId,
//                 },
//                 operator: "EQ",
//               },
//               operand2: {
//                 _type: "operation",
//                 dataType: "BOOLEAN",
//                 operand1: {
//                   _type: "field",
//                   field: "DELETED",
//                 },
//                 operand2: {
//                   _type: "value",
//                   dataType: "BOOLEAN",
//                   text: "false",
//                 },
//                 operator: "EQ",
//               },
//               operator: "AND",
//             },
//             ordering: [
//               {
//                 _type: "field",
//                 orderDirection: "DESC",
//                 orderPosition: 1,
//                 field: "ITEM_ID",
//               },
//             ],
//           }),
//         });

//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }

//         const result = await response.json();
//         const transformedData = result.map((item: any) => {
//           const itemData: any = { id: item.id, name: item.name };
//           selectedItemType.propertyDefinitions.forEach((def: any) => {
//             const propertyValue = item.propertyValues.find((pv: any) => pv.definitionId === def.id);
//             itemData[def.name] = propertyValue ? propertyValue.value : "N/A";
//           });
//           return itemData;
//         });
//         setFilteredData(transformedData);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false); // Stop loading
//       }
//     },
//     [selectedItemType, token, ocpKey]
//   );

//   useEffect(() => {
//     if (selectedItemType) {
//       fetchData(selectedItemType.id);
//     } else {
//       setFilteredData([]);
//     }
//   }, [selectedItemType, fetchData]);

//   const filteredResults = useMemo(() => {
//     return filteredData.filter((item) => Object.values(item).some((val) => String(val).toLowerCase().includes(filter.toLowerCase())));
//   }, [filter, filteredData]);

//   const table = useReactTable({
//     data: filteredResults,
//     columns: columns.filter((column: any) => columnVisibility[column.accessorKey as string] !== false),
//     getCoreRowModel: getCoreRowModel(),
//     state: {
//       rowSelection,
//     },
//     onRowSelectionChange: setRowSelection,
//     enableRowSelection: true,
//     getRowId: (row) => row.id,
//   });

//   const toggleColumnVisibility = (accessorKey: string) => {
//     if (accessorKey === "name") return; // Prevent toggling off the "Name" column
//     setColumnVisibility((prev) => ({
//       ...prev,
//       [accessorKey]: !prev[accessorKey],
//     }));
//   };

//   const handleItemTypeSelect = useCallback(
//     (itemType: any) => {
//       if (itemType.name === value) {
//         // If the same item type is selected, reset
//         setValue("");
//         setSelectedItemType(null);
//         setFilteredData([]);
//         const newColumns = generateColumns([]);
//         setColumns(newColumns);
//         setColumnVisibility(
//           newColumns.reduce((acc, column: any) => {
//             acc[column.accessorKey as string] = true; // Ensure all columns are visible initially
//             return acc;
//           }, {} as ColumnVisibility)
//         );
//         localStorage.removeItem("itemType");
//       } else {
//         setValue(itemType.name);
//         setSelectedItemType(itemType);
//         const newColumns = generateColumns(itemType.propertyDefinitions); // Generate columns dynamically
//         setColumns(newColumns);

//         // Load column visibility from localStorage
//         const storedVisibility = localStorage.getItem(`columnVisibility_${itemType.name}`);
//         if (storedVisibility) {
//           setColumnVisibility(JSON.parse(storedVisibility));
//         } else {
//           // Use default visibility
//           const newVisibility = newColumns.reduce((acc, column: any) => {
//             acc[column.accessorKey as string] = column.accessorKey === "name" || itemType.options.includes(column.header) || column.id === "select";
//             return acc;
//           }, {} as ColumnVisibility);
//           setColumnVisibility(newVisibility);
//         }

//         localStorage.setItem("itemType", itemType.name);
//       }
//       setOpen(false);
//     },
//     [value]
//   );

//   // Handle row clicks for selection
//   const handleRowClick = (event: React.MouseEvent, row: any) => {
//     const rowId = row.id;

//     if (event.shiftKey && lastSelectedRowId) {
//       // Shift-click: select range from lastSelectedRowId to rowId
//       const allRows = table.getRowModel().rows;
//       const startIndex = allRows.findIndex((r) => r.id === lastSelectedRowId);
//       const endIndex = allRows.findIndex((r) => r.id === rowId);
//       const [from, to] = startIndex < endIndex ? [startIndex, endIndex] : [endIndex, startIndex];
//       const newRowSelection = { ...rowSelection };
//       for (let i = from; i <= to; i++) {
//         const id = allRows[i].id;
//         newRowSelection[id] = true;
//       }
//       setRowSelection(newRowSelection);
//       setLastSelectedRowId(rowId);
//     } else if (event.ctrlKey || event.metaKey) {
//       // Ctrl/Cmd-click: toggle selection of the row
//       setRowSelection({
//         ...rowSelection,
//         [rowId]: !rowSelection[rowId],
//       });
//       setLastSelectedRowId(rowId);
//     } else {
//       // Regular click: do nothing
//       return;
//     }
//   };

//   console.log("selectedRows", table.getSelectedRowModel().rows);
//   return (
//     <div className="p-4 bg-white shadow-md rounded-md min-h-[90vh] flex flex-col">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
//         <div className="flex flex-wrap space-x-2">
//           {/* Add new button */}
//           <Button className="flex items-center space-x-2 bg-green-500 text-white">
//             <FaPlus />
//             <span>Add New</span>
//           </Button>
//           {/* Options dropdown */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button className="flex items-center space-x-2 bg-teal-500 text-white">
//                 <FaEllipsisV />
//                 <span>Options</span>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent>
//               <DropdownMenuItem>Option 1</DropdownMenuItem>
//               <DropdownMenuItem>Option 2</DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>

//           {/* Refresh button */}
//           <Button className="bg-gray-500 text-white" onClick={() => fetchData(selectedItemType?.id)}>
//             <FaSync />
//           </Button>
//           {/* Column visibility toggle */}
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button className="bg-gray-300 text-black">
//                 <FaFilter />
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-64 p-2">
//               <Command>
//                 <CommandGroup>
//                   {columns
//                     .filter((column: any) => typeof column.accessorKey === "string")
//                     .map((column: any) => (
//                       <CommandItem key={column.accessorKey} value={column.accessorKey} onSelect={() => toggleColumnVisibility(column.accessorKey as string)}>
//                         <Check className={cn("mr-2 h-4 w-4", columnVisibility[column.accessorKey as string] ? "opacity-100" : "opacity-0")} />
//                         {column.header}
//                       </CommandItem>
//                     ))}
//                 </CommandGroup>
//               </Command>
//             </PopoverContent>
//           </Popover>
//         </div>
//         <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 items-stretch md:items-center w-full md:w-auto">
//           <div className="flex items-center w-full md:w-auto">
//             <Input placeholder="Search" value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full md:w-64" />
//             <Button className="bg-gray-300">
//               <FaSearch />
//             </Button>
//           </div>
//           <div className="relative w-full md:w-auto">
//             <Popover open={open} onOpenChange={setOpen}>
//               <PopoverTrigger asChild>
//                 <Button variant="outline" role="combobox" aria-expanded={open} className="w-full md:w-[200px] justify-between">
//                   {value ? itemTypeValues.find((itemType: any) => itemType.name === value)?.name : "Select item type..."}
//                   <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-full md:w-[200px] p-0">
//                 <Command>
//                   <CommandInput placeholder="Search item type..." />
//                   <CommandEmpty>No item type found.</CommandEmpty>
//                   <CommandGroup>
//                     {itemTypeValues.map((itemType: any) => (
//                       <CommandItem key={itemType.id} value={itemType.name} onSelect={() => handleItemTypeSelect(itemType)}>
//                         <Check className={cn("mr-2 h-4 w-4", value === itemType.name ? "opacity-100" : "opacity-0")} />
//                         {itemType.name}
//                       </CommandItem>
//                     ))}
//                   </CommandGroup>
//                 </Command>
//               </PopoverContent>
//             </Popover>
//           </div>
//         </div>
//       </div>
//       {/* Added flex-grow to make the table container fill available space */}
//       <div className="overflow-x-auto flex-grow">
//         {loading ? (
//           // Display loading indicator
//           <div className="flex justify-center items-center h-full">
//             <div className="text-gray-500 text-xl">Loading...</div>
//           </div>
//         ) : filteredResults.length > 0 ? (
//           <table className="min-w-full bg-white">
//             <thead>
//               {table.getHeaderGroups().map((headerGroup) => (
//                 <tr key={headerGroup.id}>
//                   {headerGroup.headers.map((header) => (
//                     <th
//                       key={header.id}
//                       className="px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider"
//                       onClick={(e) => e.stopPropagation()} // Prevent sorting on click if needed
//                     >
//                       {flexRender(header.column.columnDef.header, header.getContext())}
//                     </th>
//                   ))}
//                 </tr>
//               ))}
//             </thead>
//             <tbody>
//               {table.getRowModel().rows.map((row) => (
//                 <tr key={row.id} className={`cursor-pointer hover:bg-gray-100 border-b border-gray-200 ${rowSelection[row.id] ? "bg-blue-100" : ""}`} onClick={(event) => handleRowClick(event, row)}>
//                   {row.getVisibleCells().map((cell: any) => (
//                     <td
//                       key={cell.id}
//                       className={`${cell.column.columnDef.accessorKey === "name" ? "!text-blue-500 cursor-pointer" : ""} px-6 py-4 whitespace-nowrap text-sm text-gray-900`}
//                       onClick={(event) => {
//                         if (cell.column.id === "select") {
//                           // Do nothing; Checkbox handles its own events
//                           return;
//                         }
//                         if (cell.column.columnDef.accessorKey === "name") {
//                           event.stopPropagation(); // Prevent the row's onClick from firing
//                           if (selectedItemType?.name === "Employee") {
//                             router.push(`/employee/${row.original.id}`);
//                           } else if (selectedItemType?.name === "Project") {
//                             router.push(`/project/specific/${row.original.id}`);
//                           }
//                         }
//                       }}
//                     >
//                       {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           // Display a message when there are no results
//           <div className="flex justify-center items-center h-full">
//             <div className="text-gray-500 text-xl">No matching records found.</div>
//           </div>
//         )}
//       </div>
//       <div className="mt-4 flex justify-between items-center">
//         <span>Matching Item Count: {filteredResults.length}</span>
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable, ColumnOrderState, getSortedRowModel, SortingState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { FaPlus, FaEllipsisV, FaSync, FaSearch, FaFilter } from "react-icons/fa";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, ArrowUpDown, ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateColumns } from "./columns";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";

interface DataTableProps {
  itemTypes: Record<string, any>;
  token: string;
  ocpKey: string;
}

interface ColumnVisibility {
  [key: string]: boolean;
}

export default function DataTable({ itemTypes, token, ocpKey }: DataTableProps) {
  const router = useRouter();
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [selectedItemType, setSelectedItemType] = useState<any>(null);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [columns, setColumns] = useState<ColumnDef<any>[]>(generateColumns([]));
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [lastSelectedRowId, setLastSelectedRowId] = useState<string | null>(null);

  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(
    generateColumns([]).reduce((acc, column: any) => {
      acc[column.accessorKey as string] = true;
      return acc;
    }, {} as ColumnVisibility)
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortingState>([]);

  const itemTypeValues = useMemo(() => Object.values(itemTypes), [itemTypes]);

  useEffect(() => {
    const storedItemType = localStorage.getItem("itemType");
    if (storedItemType) {
      const selectedType = itemTypeValues.find((itemType: any) => itemType.name === storedItemType);
      setValue(storedItemType);
      setSelectedItemType(selectedType);
      if (selectedType) {
        const newColumns = generateColumns(selectedType.propertyDefinitions);
        setColumns(newColumns);

        const storedVisibility = localStorage.getItem(`columnVisibility_${selectedType.name}`);
        if (storedVisibility) {
          setColumnVisibility(JSON.parse(storedVisibility));
        } else {
          const newVisibility = newColumns.reduce((acc, column: any) => {
            acc[column.accessorKey as string] = column.accessorKey === "name" || selectedType.options.includes(column.header) || column.id === "select";
            return acc;
          }, {} as ColumnVisibility);
          setColumnVisibility(newVisibility);
        }
      }
    }
  }, [itemTypeValues]);

  useEffect(() => {
    if (selectedItemType) {
      localStorage.setItem("itemType", selectedItemType.name);
    }
  }, [selectedItemType]);

  useEffect(() => {
    if (selectedItemType) {
      localStorage.setItem(`columnVisibility_${selectedItemType.name}`, JSON.stringify(columnVisibility));
    }
  }, [columnVisibility, selectedItemType]);

  const fetchData = useCallback(
    async (itemTypeId: string) => {
      setLoading(true);
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
        const transformedData = result.map((item: any) => {
          const itemData: any = { id: item.id, name: item.name };
          selectedItemType.propertyDefinitions.forEach((def: any) => {
            const propertyValue = item.propertyValues.find((pv: any) => pv.definitionId === def.id);
            itemData[def.name] = propertyValue ? propertyValue.value : "N/A";
          });
          return itemData;
        });
        setFilteredData(transformedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    },
    [selectedItemType, token, ocpKey]
  );

  useEffect(() => {
    if (selectedItemType) {
      fetchData(selectedItemType.id);
    } else {
      setFilteredData([]);
    }
  }, [selectedItemType, fetchData]);

  const filteredResults = useMemo(() => {
    return filteredData.filter((item) => Object.values(item).some((val) => String(val).toLowerCase().includes(filter.toLowerCase())));
  }, [filter, filteredData]);

  const table = useReactTable({
    data: filteredResults,
    columns: columns.filter((column: any) => columnVisibility[column.accessorKey as string] !== false),
    state: {
      sorting,
      rowSelection,
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
    getRowId: (row) => row.id,
  });

  const toggleColumnVisibility = (accessorKey: string) => {
    if (accessorKey === "name") return; // Prevent toggling off the "Name" column
    setColumnVisibility((prev) => ({
      ...prev,
      [accessorKey]: !prev[accessorKey],
    }));
  };

  const handleItemTypeSelect = useCallback(
    (itemType: any) => {
      if (itemType.name === value) {
        // If the same item type is selected, reset
        setValue("");
        setSelectedItemType(null);
        setFilteredData([]);
        const newColumns = generateColumns([]);
        setColumns(newColumns);
        setColumnVisibility(
          newColumns.reduce((acc, column: any) => {
            acc[column.accessorKey as string] = true;
            return acc;
          }, {} as ColumnVisibility)
        );
        localStorage.removeItem("itemType");
      } else {
        setValue(itemType.name);
        setSelectedItemType(itemType);
        const newColumns = generateColumns(itemType.propertyDefinitions);
        setColumns(newColumns);

        // Load column visibility from localStorage
        const storedVisibility = localStorage.getItem(`columnVisibility_${itemType.name}`);
        if (storedVisibility) {
          setColumnVisibility(JSON.parse(storedVisibility));
        } else {
          // Use default visibility
          const newVisibility = newColumns.reduce((acc, column: any) => {
            acc[column.accessorKey as string] = column.accessorKey === "name" || itemType.options.includes(column.header) || column.id === "select";
            return acc;
          }, {} as ColumnVisibility);
          setColumnVisibility(newVisibility);
        }

        localStorage.setItem("itemType", itemType.name);
      }
      setOpen(false);
    },
    [value]
  );

  // Handle row clicks for selection with Ctrl/Shift keys
  const handleRowClick = (event: React.MouseEvent, row: any) => {
    const rowId = row.id;

    if (event.shiftKey && lastSelectedRowId) {
      // Shift-click: select range from lastSelectedRowId to rowId
      const allRows = table.getRowModel().rows;
      const startIndex = allRows.findIndex((r) => r.id === lastSelectedRowId);
      const endIndex = allRows.findIndex((r) => r.id === rowId);
      const [from, to] = startIndex < endIndex ? [startIndex, endIndex] : [endIndex, startIndex];
      const newRowSelection = { ...rowSelection };
      for (let i = from; i <= to; i++) {
        const id = allRows[i].id;
        newRowSelection[id] = true;
      }
      setRowSelection(newRowSelection);
      setLastSelectedRowId(rowId);
    } else if (event.ctrlKey || event.metaKey) {
      // Ctrl/Cmd-click: toggle selection of the row
      setRowSelection({
        ...rowSelection,
        [rowId]: !rowSelection[rowId],
      });
      setLastSelectedRowId(rowId);
    } else {
      // Regular click: navigate if name column is clicked
      return;
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md min-h-[90vh] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
        <div className="flex flex-wrap space-x-2">
          {/* Add new button */}
          <Button className="flex items-center space-x-2 bg-green-500 text-white">
            <FaPlus />
            <span>Add New</span>
          </Button>
          {/* Options dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center space-x-2 bg-teal-500 text-white">
                <FaEllipsisV />
                <span>Options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Option 1</DropdownMenuItem>
              <DropdownMenuItem>Option 2</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Refresh button */}
          <Button className="bg-gray-500 text-white" onClick={() => fetchData(selectedItemType?.id)}>
            <FaSync />
          </Button>
          {/* Column visibility toggle */}
          <Popover>
            <PopoverTrigger asChild>
              <Button className="bg-gray-300 text-black">
                <FaFilter />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2">
              <Command>
                <CommandGroup>
                  {columns
                    .filter((column: any) => typeof column.accessorKey === "string")
                    .map((column: any) => (
                      <CommandItem key={column.accessorKey} value={column.accessorKey} onSelect={() => toggleColumnVisibility(column.accessorKey as string)}>
                        <Check className={cn("mr-2 h-4 w-4", columnVisibility[column.accessorKey as string] ? "opacity-100" : "opacity-0")} />
                        {column.header}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 items-stretch md:items-center w-full md:w-auto">
          <div className="flex items-center w-full md:w-auto">
            <Input placeholder="Search" value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full md:w-64" />
            <Button className="bg-gray-300">
              <FaSearch />
            </Button>
          </div>
          <div className="relative w-full md:w-auto">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full md:w-[200px] justify-between">
                  {value ? itemTypeValues.find((itemType: any) => itemType.name === value)?.name : "Select item type..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full md:w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search item type..." />
                  <CommandEmpty>No item type found.</CommandEmpty>
                  <CommandGroup>
                    {itemTypeValues.map((itemType: any) => (
                      <CommandItem key={itemType.id} value={itemType.name} onSelect={() => handleItemTypeSelect(itemType)}>
                        <Check className={cn("mr-2 h-4 w-4", value === itemType.name ? "opacity-100" : "opacity-0")} />
                        {itemType.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      {/* Added flex-grow to make the table container fill available space */}
      <div className="overflow-x-auto flex-grow">
        {loading ? (
          // Display loading indicator
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-500 text-xl">Loading...</div>
          </div>
        ) : filteredResults.length > 0 ? (
          <table className="min-w-full bg-white">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`px-6 py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider ${
                        header.column.getCanSort() ? "cursor-pointer select-none" : ""
                      } bg-gray-200 text-gray-700`}
                      onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                    >
                      <div className="flex items-center">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() ? (
                          header.column.getIsSorted() ? (
                            header.column.getIsSorted() === "asc" ? (
                              <ArrowUpWideNarrow className="inline h-4 w-4 ml-1" />
                            ) : (
                              <ArrowDownWideNarrow className="inline h-4 w-4 ml-1" />
                            )
                          ) : (
                            <ArrowUpDown className="inline h-4 w-4 ml-1 opacity-50" />
                          )
                        ) : null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`cursor-pointer hover:bg-gray-100 border-b border-gray-200 ${rowSelection[row.id] ? "bg-blue-100" : ""}`}
                  onClick={(event) => handleRowClick(event, row)}
                  onMouseDown={(event) => {
                    if (event.shiftKey) {
                      event.preventDefault();
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell: any) => (
                    <td
                      key={cell.id}
                      className={`${cell.column.columnDef.accessorKey === "name" ? "!text-blue-500 cursor-pointer" : ""} px-6 py-4 whitespace-nowrap text-sm text-gray-900`}
                      onClick={(event) => {
                        if (cell.column.id === "select") {
                          // Do nothing; Checkbox handles its own events
                          return;
                        }
                        if (cell.column.columnDef.accessorKey === "name") {
                          event.stopPropagation(); // Prevent the row's onClick from firing
                          if (selectedItemType?.name === "Employee") {
                            router.push(`/employee/${row.original.id}`);
                          } else if (selectedItemType?.name === "Project") {
                            router.push(`/project/specific/${row.original.id}`);
                          }
                        }
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          // Display a message when there are no results
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-500 text-xl">No matching records found.</div>
          </div>
        )}
      </div>
      <div className="mt-4 flex justify-between items-center">
        <span>Matching Item Count: {filteredResults.length}</span>
      </div>
    </div>
  );
}
