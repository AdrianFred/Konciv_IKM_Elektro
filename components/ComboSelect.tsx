// import React from "react";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
// import { Button } from "@/components/ui/button";
// import { Check, ChevronsUpDown } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface OptionType {
//   label: string;
//   value: string;
//   // Add any other properties you might pass in the option object
//   [key: string]: any;
// }

// interface PopoverSelectProps {
//   options: OptionType[];
//   placeholder: string;
//   selectedValue: OptionType | null;
//   onSelect: (selected: OptionType | null) => void;
//   searchPlaceholder?: string;
// }

// export function ComboSelect({ options, placeholder, selectedValue, onSelect, searchPlaceholder = "Search..." }: PopoverSelectProps) {
//   const [open, setOpen] = React.useState(false);
//   const selectedLabel = selectedValue ? selectedValue.label : placeholder;

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
//           {selectedLabel}
//           <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-full p-0">
//         <Command>
//           <CommandInput placeholder={searchPlaceholder} />
//           <CommandList>
//             <CommandEmpty>No items found.</CommandEmpty>
//             <CommandGroup>
//               {options.map((option) => (
//                 <CommandItem
//                   key={option.value}
//                   value={`${option.value} ${option.label}`}
//                   onSelect={() => {
//                     // If the same value is selected again, clear it
//                     if (selectedValue && selectedValue.value === option.value) {
//                       onSelect(null); // Clear the selection
//                     } else {
//                       onSelect(option); // Pass the entire option object
//                     }
//                     setOpen(false);
//                   }}
//                 >
//                   <Check className={cn("mr-2 h-4 w-4", selectedValue?.value === option.value ? "opacity-100" : "opacity-0")} />
//                   {option.label}
//                 </CommandItem>
//               ))}
//             </CommandGroup>
//           </CommandList>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   );
// }

// import React from "react";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
// import { Button } from "@/components/ui/button";
// import { Check, ChevronsUpDown } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface OptionType {
//   label: string;
//   value: string;
//   // Add any other properties you might pass in the option object
//   [key: string]: any;
// }

// interface PopoverSelectProps {
//   options: OptionType[];
//   placeholder: string;
//   selectedValue: OptionType | null;
//   onSelect: (selected: OptionType | null) => void;
//   searchPlaceholder?: string;
// }

// export function ComboSelect({ options, placeholder, selectedValue, onSelect, searchPlaceholder = "Search..." }: PopoverSelectProps) {
//   const [open, setOpen] = React.useState(false);
//   const selectedLabel = selectedValue ? selectedValue.label : placeholder;

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
//           {selectedLabel || placeholder}
//           <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-full p-0">
//         <Command>
//           <CommandInput placeholder={searchPlaceholder} />
//           <CommandList>
//             <CommandEmpty>No items found.</CommandEmpty>
//             <CommandGroup>
//               {options.map((option) => (
//                 <CommandItem
//                   key={option.value}
//                   value={`${option.value} ${option.label}`}
//                   onSelect={() => {
//                     if (selectedValue && selectedValue.value === option.value) {
//                       onSelect(null); // Clear the selection
//                     } else {
//                       onSelect(option); // Pass the entire option object
//                     }
//                     setOpen(false);
//                   }}
//                 >
//                   <Check className={cn("mr-2 h-4 w-4", selectedValue?.value === option.value ? "opacity-100" : "opacity-0")} />
//                   {option.label}
//                 </CommandItem>
//               ))}
//             </CommandGroup>
//           </CommandList>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   );
// }

import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptionType {
  label: string;
  value: string;
  // Add any other properties you might pass in the option object
  [key: string]: any;
}

interface PopoverSelectProps {
  options: OptionType[];
  placeholder: string;
  selectedValue: OptionType | null;
  onSelect: (selected: OptionType | null) => void;
  searchPlaceholder?: string;
  noClick?: boolean; // New prop to disable interaction
}

export function ComboSelect({ options, placeholder, selectedValue, onSelect, searchPlaceholder = "Search...", noClick = false }: PopoverSelectProps) {
  const [open, setOpen] = React.useState(false);
  const selectedLabel = selectedValue ? selectedValue.label : placeholder;

  // If noClick is true, prevent the popover from opening
  const handleOpenChange = (openState: boolean) => {
    if (!noClick) {
      setOpen(openState);
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedLabel || placeholder}
          {!noClick && <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
        </Button>
      </PopoverTrigger>
      {!noClick && ( // Render PopoverContent only if noClick is false
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>No items found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={`${option.value} ${option.label}`}
                    onSelect={() => {
                      if (selectedValue && selectedValue.value === option.value) {
                        onSelect(null); // Clear the selection
                      } else {
                        onSelect(option); // Pass the entire option object
                      }
                      setOpen(false);
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", selectedValue?.value === option.value ? "opacity-100" : "opacity-0")} />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  );
}
