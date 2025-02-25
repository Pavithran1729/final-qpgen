import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

interface YearSelectProps {
  selectedYears: string[];
  onYearChange: (years: string[]) => void;
}

export const YearSelect = ({ selectedYears, onYearChange }: YearSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const years = ["I", "II", "III", "IV"];

  const handleYearToggle = (year: string) => {
    const newYears = selectedYears.includes(year)
      ? selectedYears.filter(y => y !== year)
      : [...selectedYears, year];
    onYearChange(newYears);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {selectedYears.length 
            ? `${selectedYears.length} year(s) selected`
            : "Select year"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-4">
        <div className="grid grid-cols-2 gap-4">
          {years.map((year) => (
            <label key={year} className="flex items-center space-x-2">
              <Checkbox
                checked={selectedYears.includes(year)}
                onCheckedChange={() => handleYearToggle(year)}
              />
              <span>{year}</span>
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};