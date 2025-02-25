import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface DepartmentSelectProps {
  selectedDepts: string[];
  onDepartmentChange: (depts: string[]) => void;
}

export const DepartmentSelect = ({ selectedDepts, onDepartmentChange }: DepartmentSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newDept, setNewDept] = useState("");
  const [departments, setDepartments] = useState(["CSE", "EEE", "IT", "ECE", "AERO", "BIO TECH", "CIVIL", "MECH"]);

  const handleDepartmentToggle = (dept: string) => {
    const newDepts = selectedDepts.includes(dept)
      ? selectedDepts.filter(d => d !== dept)
      : [...selectedDepts, dept];
    onDepartmentChange(newDepts);
  };

  const handleAddDepartment = () => {
    if (newDept && !departments.includes(newDept)) {
      setDepartments([...departments, newDept]);
      onDepartmentChange([...selectedDepts, newDept]);
      setNewDept("");
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {selectedDepts.length 
            ? `${selectedDepts.length} department(s) selected`
            : "Select departments"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-4">
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={newDept}
              onChange={(e) => setNewDept(e.target.value)}
              placeholder="Add new department"
            />
            <Button onClick={handleAddDepartment}>Add</Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {departments.map((dept) => (
              <label key={dept} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedDepts.includes(dept)}
                  onCheckedChange={() => handleDepartmentToggle(dept)}
                />
                <span>{dept}</span>
              </label>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};