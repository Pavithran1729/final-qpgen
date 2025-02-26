import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

interface RegulationSelectProps {
  selectedRegulations: string[];
  onRegulationChange: (regulations: string[]) => void;
}

export const RegulationSelect = ({ selectedRegulations, onRegulationChange }: RegulationSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [regulations] = useState(["2021", "2022", "2023", "2024", "2025", "2026"]);

  const handleRegulationToggle = (regulation: string) => {
    const newRegulations = selectedRegulations.includes(regulation)
      ? selectedRegulations.filter(r => r !== regulation)
      : [...selectedRegulations, regulation];
    onRegulationChange(newRegulations);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {selectedRegulations.length 
            ? `${selectedRegulations.length} regulation(s) selected`
            : "Select regulation"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-4">
        <div className="grid grid-cols-2 gap-4">
          {regulations.map((regulation) => (
            <label key={regulation} className="flex items-center space-x-2">
              <Checkbox
                checked={selectedRegulations.includes(regulation)}
                onCheckedChange={() => handleRegulationToggle(regulation)}
              />
              <span>{regulation}</span>
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};