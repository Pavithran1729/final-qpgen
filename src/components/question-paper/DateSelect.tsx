import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface DateSelectProps {
  selectedDates: string[];
  onDateChange: (dates: string[]) => void;
}

export const DateSelect = ({ selectedDates, onDateChange }: DateSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [dates, setDates] = useState(["July/Dec 2024", "Jan/May 2024"]);

  const handleDateToggle = (date: string) => {
    const newDates = selectedDates.includes(date)
      ? selectedDates.filter(d => d !== date)
      : [...selectedDates, date];
    onDateChange(newDates);
  };

  const handleAddDate = () => {
    if (newDate && !dates.includes(newDate)) {
      setDates([...dates, newDate]);
      onDateChange([...selectedDates, newDate]);
      setNewDate("");
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {selectedDates.length 
            ? `${selectedDates.length} date(s) selected`
            : "Select date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-4">
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              placeholder="Add new date"
            />
            <Button onClick={handleAddDate}>Add</Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {dates.map((date) => (
              <label key={date} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedDates.includes(date)}
                  onCheckedChange={() => handleDateToggle(date)}
                />
                <span>{date}</span>
              </label>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};