export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type QuestionType =
  | "multiple_choice"
  | "fill_blank"
  | "sentence_order"
  | "listening";

export type LessonStatus = "not_started" | "in_progress" | "completed";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          level: string;
          total_xp: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          level?: string;
          total_xp?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      units: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          sort_order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          sort_order: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["units"]["Insert"]>;
        Relationships: [];
      };
      lessons: {
        Row: {
          id: string;
          unit_id: string;
          title: string;
          description: string | null;
          xp_reward: number;
          sort_order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          unit_id: string;
          title: string;
          description?: string | null;
          xp_reward?: number;
          sort_order: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["lessons"]["Insert"]>;
        Relationships: [];
      };
      questions: {
        Row: {
          id: string;
          lesson_id: string;
          type: QuestionType;
          prompt: string;
          explanation: string;
          data: Json;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          type: QuestionType;
          prompt: string;
          explanation: string;
          data: Json;
          sort_order: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["questions"]["Insert"]>;
        Relationships: [];
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          unit_id: string | null;
          lesson_id: string | null;
          status: LessonStatus;
          best_accuracy: number;
          total_xp_earned: number;
          completed_at: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          unit_id?: string | null;
          lesson_id?: string | null;
          status?: LessonStatus;
          best_accuracy?: number;
          total_xp_earned?: number;
          completed_at?: string | null;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_progress"]["Insert"]>;
        Relationships: [];
      };
      lesson_attempts: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          xp_earned: number;
          accuracy: number;
          mistakes_count: number;
          completed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          xp_earned?: number;
          accuracy?: number;
          mistakes_count?: number;
          completed?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["lesson_attempts"]["Insert"]>;
        Relationships: [];
      };
      mistakes: {
        Row: {
          id: string;
          attempt_id: string;
          user_id: string;
          question_id: string;
          user_answer: string;
          correct_answer: string;
          explanation: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          attempt_id: string;
          user_id: string;
          question_id: string;
          user_answer: string;
          correct_answer: string;
          explanation: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["mistakes"]["Insert"]>;
        Relationships: [];
      };
      streaks: {
        Row: {
          user_id: string;
          current_streak: number;
          longest_streak: number;
          last_activity_date: string | null;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          current_streak?: number;
          longest_streak?: number;
          last_activity_date?: string | null;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["streaks"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      question_type: QuestionType;
      lesson_status: LessonStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
