import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SubjectCard } from "./SubjectCard";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Subject {
  id: string;
  subject_code: string;
  subject_name: string;
  questions_count: number;  // Changed from questions array to direct count
}

interface QuestionsHeaderProps {
  onAddSubject: () => void;
  onSelectSubject: (subject: { id: string; code: string; name: string }) => void;
}

export const QuestionsHeader = ({ onAddSubject, onSelectSubject }: QuestionsHeaderProps) => {
  const queryClient = useQueryClient();
  const [visibleSubjects, setVisibleSubjects] = useState(9);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: subjects, isLoading, error } = useQuery<Subject[]>({
    queryKey: ['subjects'],
    queryFn: async (): Promise<Subject[]> => {
      console.log('Fetching subjects...');
      try {
        const { data, error: subjectsError } = await supabase
          .from('subjects')
          .select(`
            id,
            subject_code,
            subject_name,
            questions(count)
          `)
          .order('created_at', { ascending: false });

        if (subjectsError) {
          console.error('Error fetching subjects:', subjectsError);
          throw subjectsError;
        }

        if (!data) return [];

        const subjects: Subject[] = data.map(item => ({
          id: item.id,
          subject_code: item.subject_code,
          subject_name: item.subject_name,
          questions_count: item.questions?.[0]?.count || 0
        }));

        console.log('Subjects:', subjects);
        return subjects;
      } catch (error) {
        console.error('Error in subjects query:', error);
        throw error;
      }
    },
    refetchOnWindowFocus: true,
    staleTime: 0
  });

  if (error) {
    console.error('Error in subjects query:', error);
  }

  const handleLoadMore = () => {
    setVisibleSubjects(prev => prev + 9);
  };

  const filteredSubjects = useMemo(() => {
    if (!subjects) return [];
    return subjects.filter(subject => {
      const query = searchQuery.toLowerCase();
      return (
        subject.subject_code.toLowerCase().includes(query) ||
        subject.subject_name.toLowerCase().includes(query)
      );
    });
  }, [subjects, searchQuery]);

  const visibleSubjectsData = filteredSubjects.slice(0, visibleSubjects);
  const hasMoreSubjects = filteredSubjects.length > visibleSubjects;

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Question Banks</h1>
          <Button onClick={onAddSubject}>
            <Plus className="h-4 w-4 mr-2" />
            Add Subject
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search by subject code or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {!isLoading && visibleSubjectsData?.map((subject) => (
          <SubjectCard
            key={subject.id}
            subjectId={subject.id}
            subjectCode={subject.subject_code}
            subjectName={subject.subject_name}
            questionCount={subject.questions_count}
            onClick={() => onSelectSubject({
              id: subject.id,
              code: subject.subject_code,
              name: subject.subject_name
            })}
          />
        ))}
        {isLoading && (
          <div className="col-span-3 text-center py-8 text-gray-500">
            Loading subjects...
          </div>
        )}
        {!isLoading && filteredSubjects.length === 0 && (
          <div className="col-span-3 text-center py-8 text-gray-500">
            {searchQuery ? (
              <>No subjects match your search. Try a different search term.</>
            ) : (
              <>No subjects found. Add your first subject!</>
            )}
          </div>
        )}
      </div>
      
      {hasMoreSubjects && (
        <div className="flex justify-center mt-8">
          <Button 
            onClick={handleLoadMore}
            variant="outline"
          >
            Load More
          </Button>
        </div>
      )}
    </>
  );
};