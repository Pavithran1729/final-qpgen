import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface TestSelectProps {
  selectedTests: string[];
  onTestChange: (tests: string[]) => void;
}

export const TestSelect = ({ selectedTests, onTestChange }: TestSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newTest, setNewTest] = useState("");
  const [tests, setTests] = useState([
    "UNIT TEST - 1",
    "UNIT TEST - 2",
    "UNIT TEST - 3",
    "UNIT TEST - 4",
    "UNIT TEST - 5"
  ]);

  const handleTestToggle = (test: string) => {
    const newTests = selectedTests.includes(test)
      ? selectedTests.filter(t => t !== test)
      : [...selectedTests, test];
    onTestChange(newTests);
  };

  const handleAddTest = () => {
    if (newTest && !tests.includes(newTest)) {
      setTests([...tests, newTest]);
      onTestChange([...selectedTests, newTest]);
      setNewTest("");
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {selectedTests.length 
            ? `${selectedTests.length} test(s) selected`
            : "Select tests"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-4">
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={newTest}
              onChange={(e) => setNewTest(e.target.value)}
              placeholder="Add new test"
            />
            <Button onClick={handleAddTest}>Add</Button>
          </div>
          <div className="grid gap-4">
            {tests.map((test) => (
              <label key={test} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedTests.includes(test)}
                  onCheckedChange={() => handleTestToggle(test)}
                />
                <span>{test}</span>
              </label>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};