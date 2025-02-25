
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FormFieldsProps {
  content: string;
  setContent: (value: string) => void;
  mark: string;
  setMark: (value: string) => void;
  kLevel: string;
  setKLevel: (value: string) => void;
  part: string;
  setPart: (value: string) => void;
  coLevel: string;
  setCoLevel: (value: string) => void;
  hasOr: boolean;
  setHasOr: (value: boolean) => void;
  orContent: string;
  setOrContent: (value: string) => void;
  orMark: string;
  setOrMark: (value: string) => void;
  orKLevel: string;
  setOrKLevel: (value: string) => void;
  orPart: string;
  setOrPart: (value: string) => void;
  orCoLevel: string;
  setOrCoLevel: (value: string) => void;
  hasFormula: boolean;
  setHasFormula: (value: boolean) => void;
  orHasFormula: boolean;
  setOrHasFormula: (value: boolean) => void;
}

export const parts = ["A", "B", "C"];
export const marks = ["2", "8", "12", "16"];
export type FormFieldsPropsWithLevels = Omit<FormFieldsProps, "hasFormula" | "setHasFormula" | "orHasFormula" | "setOrHasFormula"> & {
  availableKLevels?: string[];
  availableCOLevels?: string[];
  hasFormula?: boolean;
  setHasFormula?: (value: boolean) => void;
  orHasFormula?: boolean;
  setOrHasFormula?: (value: boolean) => void;
};

export const FormFields = ({
  availableKLevels = ["K1", "K2", "K3", "K4", "K5", "K6"],
  availableCOLevels = ["CO1", "CO2", "CO3", "CO4", "CO5"],
  content,
  setContent,
  mark,
  setMark,
  kLevel,
  setKLevel,
  part,
  setPart,
  coLevel,
  setCoLevel,
  hasOr,
  setHasOr,
  orContent,
  setOrContent,
  orMark,
  setOrMark,
  orKLevel,
  setOrKLevel,
  orPart,
  setOrPart,
  orCoLevel,
  setOrCoLevel,
}: FormFieldsPropsWithLevels) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>Part</Label>
          <Select value={part} onValueChange={setPart}>
            <SelectTrigger>
              <SelectValue placeholder="Select part" />
            </SelectTrigger>
            <SelectContent>
              {parts.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Marks</Label>
          <Select value={mark} onValueChange={setMark}>
            <SelectTrigger>
              <SelectValue placeholder="Select marks" />
            </SelectTrigger>
            <SelectContent>
              {marks.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>K-Level</Label>
          <Select value={kLevel} onValueChange={setKLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Select K-Level" />
            </SelectTrigger>
            <SelectContent>
              {availableKLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>CO-Level</Label>
          <Select value={coLevel} onValueChange={setCoLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Select CO-Level" />
            </SelectTrigger>
            <SelectContent>
              {availableCOLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="has-or"
            checked={hasOr}
            onCheckedChange={(checked) => setHasOr(checked as boolean)}
          />
          <Label htmlFor="has-or" className="font-medium">
            Add OR Question
          </Label>
        </div>

        {hasOr && (
          <div className="pl-6 border-l-2 border-gray-200 space-y-4 mt-4">
            <h4 className="font-medium mb-4">OR Question Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Part</Label>
                <Select value={orPart} onValueChange={setOrPart}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select part" />
                  </SelectTrigger>
                  <SelectContent>
                    {parts.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Marks</Label>
                <Select value={orMark} onValueChange={setOrMark}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select marks" />
                  </SelectTrigger>
                  <SelectContent>
                    {marks.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>K-Level</Label>
                <Select value={orKLevel} onValueChange={setOrKLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select K-Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableKLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>CO-Level</Label>
                <Select value={orCoLevel} onValueChange={setOrCoLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select CO-Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCOLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
