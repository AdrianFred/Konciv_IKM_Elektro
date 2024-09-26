import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandList, CommandInput, CommandEmpty } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiSelectProps {
  options: { label: string; value: string }[];
  placeholder: string;
  selectedValues: string[];
  onChange: (selected: string[]) => void;
  noClick?: boolean; // New prop to disable interaction
}

export function MultiSelect({ options, placeholder, selectedValues, onChange, noClick = false }: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((val) => val !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const displayText = () => {
    if (selectedValues.length === 0) {
      return placeholder;
    }
    const firstLabel = options.find((option) => option.value === selectedValues[0])?.label;
    const additionalCount = selectedValues.length - 1;

    return additionalCount > 0 ? `${firstLabel} +${additionalCount}` : firstLabel;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {displayText()}
          {!noClick && <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
        </Button>
      </PopoverTrigger>
      {!noClick && (
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No options found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem key={option.value} value={option.value} onSelect={() => toggleOption(option.value)}>
                    <Check className={cn("mr-2 h-4 w-4", selectedValues.includes(option.value) ? "opacity-100" : "opacity-0")} />
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
