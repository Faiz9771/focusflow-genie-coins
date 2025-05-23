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
      habit_logs: {
        Row: {
          completed_at: string
          habit_id: string
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          habit_id: string
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string
          habit_id?: string
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_logs_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          category: string
          created_at: string
          frequency: string
          id: string
          name: string
          streak: number
          target_per_period: number
          total_completions: number
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          frequency?: string
          id?: string
          name: string
          streak?: number
          target_per_period?: number
          total_completions?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          frequency?: string
          id?: string
          name?: string
          streak?: number
          target_per_period?: number
          total_completions?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      internships: {
        Row: {
          application_date: string
          company: string
          created_at: string
          deadline_date: string | null
          id: string
          notes: string | null
          position: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          application_date: string
          company: string
          created_at?: string
          deadline_date?: string | null
          id?: string
          notes?: string | null
          position: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          application_date?: string
          company?: string
          created_at?: string
          deadline_date?: string | null
          id?: string
          notes?: string | null
          position?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          category: string | null
          content: string | null
          created_at: string
          id: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      procrastination_logs: {
        Row: {
          actual_activity: string | null
          created_at: string
          distraction_level: number | null
          id: string
          notes: string | null
          planned_task_id: string | null
          session_end: string | null
          session_start: string
          user_id: string
        }
        Insert: {
          actual_activity?: string | null
          created_at?: string
          distraction_level?: number | null
          id?: string
          notes?: string | null
          planned_task_id?: string | null
          session_end?: string | null
          session_start: string
          user_id: string
        }
        Update: {
          actual_activity?: string | null
          created_at?: string
          distraction_level?: number | null
          id?: string
          notes?: string | null
          planned_task_id?: string | null
          session_end?: string | null
          session_start?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "procrastination_logs_planned_task_id_fkey"
            columns: ["planned_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      procrastination_patterns: {
        Row: {
          created_at: string
          frequency: number
          id: string
          pattern_type: string
          pattern_value: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          frequency: number
          id?: string
          pattern_type: string
          pattern_value: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          frequency?: number
          id?: string
          pattern_type?: string
          pattern_value?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      productivity_insights: {
        Row: {
          confidence_score: number
          created_at: string
          id: string
          insight_type: string
          insight_value: string
          updated_at: string
          user_id: string
        }
        Insert: {
          confidence_score: number
          created_at?: string
          id?: string
          insight_type: string
          insight_value: string
          updated_at?: string
          user_id: string
        }
        Update: {
          confidence_score?: number
          created_at?: string
          id?: string
          insight_type?: string
          insight_value?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      productivity_logs: {
        Row: {
          created_at: string
          end_time: string | null
          energy_level: number | null
          focus_score: number | null
          id: string
          notes: string | null
          start_time: string
          task_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          end_time?: string | null
          energy_level?: number | null
          focus_score?: number | null
          id?: string
          notes?: string | null
          start_time?: string
          task_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          end_time?: string | null
          energy_level?: number | null
          focus_score?: number | null
          id?: string
          notes?: string | null
          start_time?: string
          task_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "productivity_logs_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          coins: number | null
          created_at: string | null
          genie_credits: number
          id: string
          notification_preferences: Json | null
          pomodoro_preferences: Json | null
          preferred_work_hours: Json | null
          streak_days: number | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          coins?: number | null
          created_at?: string | null
          genie_credits?: number
          id: string
          notification_preferences?: Json | null
          pomodoro_preferences?: Json | null
          preferred_work_hours?: Json | null
          streak_days?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          coins?: number | null
          created_at?: string | null
          genie_credits?: number
          id?: string
          notification_preferences?: Json | null
          pomodoro_preferences?: Json | null
          preferred_work_hours?: Json | null
          streak_days?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          completion_percentage: number
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: string
          start_date: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completion_percentage?: number
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          start_date?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completion_percentage?: number
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      task_analytics: {
        Row: {
          actual_focus_score: number | null
          completion_date: string | null
          completion_time_minutes: number | null
          created_at: string
          id: string
          task_id: string | null
          user_id: string
          was_on_schedule: boolean | null
        }
        Insert: {
          actual_focus_score?: number | null
          completion_date?: string | null
          completion_time_minutes?: number | null
          created_at?: string
          id?: string
          task_id?: string | null
          user_id: string
          was_on_schedule?: boolean | null
        }
        Update: {
          actual_focus_score?: number | null
          completion_date?: string | null
          completion_time_minutes?: number | null
          created_at?: string
          id?: string
          task_id?: string | null
          user_id?: string
          was_on_schedule?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "task_analytics_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          category: string
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          estimated_minutes: number | null
          id: string
          priority: string
          reminder_time: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          estimated_minutes?: number | null
          id?: string
          priority?: string
          reminder_time?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          estimated_minutes?: number | null
          id?: string
          priority?: string
          reminder_time?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_task_analytics: {
        Args: { user_id_param: string }
        Returns: {
          id: string
          task_id: string
          user_id: string
          completion_time_minutes: number
          actual_focus_score: number
          completion_date: string
          was_on_schedule: boolean
          task_title: string
          task_category: string
          task_priority: string
          estimated_minutes: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
