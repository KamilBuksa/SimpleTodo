export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      todos: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          created_at: string;
          updated_at: string;
          deadline: string | null;
          completed: boolean;
          priority: "low" | "medium" | "high" | "urgent";
          time_estimate: number | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
          deadline?: string | null;
          completed?: boolean;
          priority?: "low" | "medium" | "high" | "urgent";
          time_estimate?: number | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
          deadline?: string | null;
          completed?: boolean;
          priority?: "low" | "medium" | "high" | "urgent";
          time_estimate?: number | null;
        };
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
  };
}
