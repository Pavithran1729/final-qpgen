export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      allowed_users: {
        Row: {
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          department: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          department?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      subjects: {
        Row: {
          id: string
          subject_code: string
          subject_name: string
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          subject_code: string
          subject_name: string
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          subject_code?: string
          subject_name?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subjects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      question_paper_items: {
        Row: {
          created_at: string
          id: string
          question_id: string
          question_number: number
          question_paper_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_id: string
          question_number: number
          question_paper_id: string
        }
        Update: {
          created_at?: string
          id?: string
          question_id?: string
          question_number?: number
          question_paper_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_paper_items_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_paper_items_question_paper_id_fkey"
            columns: ["question_paper_id"]
            isOneToOne: false
            referencedRelation: "question_papers"
            referencedColumns: ["id"]
          }
        ]
      }
      question_papers: {
        Row: {
          course_code: string
          course_name: string
          created_at: string
          department: string
          id: string
          title: string
          user_id: string
          year: string
        }
        Insert: {
          course_code: string
          course_name: string
          created_at?: string
          department: string
          id?: string
          title: string
          user_id: string
          year: string
        }
        Update: {
          course_code?: string
          course_name?: string
          created_at?: string
          department?: string
          id?: string
          title?: string
          user_id?: string
          year?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_papers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      questions: {
        Row: {
          co_level: string
          content: string | null
          created_at: string | null
          has_formula: boolean | null
          has_or: boolean | null
          id: string
          image_url: string | null
          k_level: string
          marks: number
          or_co_level: string | null
          or_content: string | null
          or_has_formula: boolean | null
          or_image_url: string | null
          or_k_level: string | null
          or_marks: number | null
          or_part: string | null
          part: string
          spreadsheet_url: string | null
          subject_id: string
          user_id: string
        }
        Insert: {
          co_level?: string
          content?: string | null
          created_at?: string | null
          has_formula?: boolean | null
          has_or?: boolean | null
          id?: string
          image_url?: string | null
          k_level: string
          marks: number
          or_co_level?: string | null
          or_content?: string | null
          or_has_formula?: boolean | null
          or_image_url?: string | null
          or_k_level?: string | null
          or_marks?: number | null
          or_part?: string | null
          part: string
          spreadsheet_url?: string | null
          subject_id: string
          user_id: string
        }
        Update: {
          co_level?: string
          content?: string | null
          created_at?: string | null
          has_formula?: boolean | null
          has_or?: boolean | null
          id?: string
          image_url?: string | null
          k_level?: string
          marks?: number
          or_co_level?: string | null
          or_content?: string | null
          or_has_formula?: boolean | null
          or_image_url?: string | null
          or_k_level?: string | null
          or_marks?: number | null
          or_part?: string | null
          part?: string
          spreadsheet_url?: string | null
          subject_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never
