import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DurationSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const DurationSelect = ({ value, onChange }: DurationSelectProps) => {
  const durations = [
    "1:00", "1:15", "1:30", "1:45",
    "2:00", "2:15", "2:30", "2:45",
    "3:00"
  ];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select duration" />
      </SelectTrigger>
      <SelectContent>
        {durations.map((duration) => (
          <SelectItem key={duration} value={duration}>
            {duration} hours
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};