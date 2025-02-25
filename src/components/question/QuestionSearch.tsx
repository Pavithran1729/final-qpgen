import { Input } from "@/components/ui/input";

interface QuestionSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const QuestionSearch = ({ searchQuery, setSearchQuery }: QuestionSearchProps) => {
  return (
    <div className="bg-white shadow-sm rounded-lg border mb-4">
      <div className="p-4">
        <Input 
          placeholder="Search questions by content, subject code, or subject name..." 
          className="max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};