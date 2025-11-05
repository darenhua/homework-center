export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      assignments: {
        Row: {
          chosen_due_date_id: string | null
          content_hash: string | null
          course_id: string | null
          created_at: string
          description: string | null
          id: string
          job_sync_id: string | null
          source_page_paths: string[] | null
          title: string | null
        }
        Insert: {
          chosen_due_date_id?: string | null
          content_hash?: string | null
          course_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          job_sync_id?: string | null
          source_page_paths?: string[] | null
          title?: string | null
        }
        Update: {
          chosen_due_date_id?: string | null
          content_hash?: string | null
          course_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          job_sync_id?: string | null
          source_page_paths?: string[] | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assigments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_chosen_due_date_id_fkey"
            columns: ["chosen_due_date_id"]
            isOneToOne: false
            referencedRelation: "due_dates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_job_sync_id_fkey"
            columns: ["job_sync_id"]
            isOneToOne: false
            referencedRelation: "job_syncs"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string
          id: string
          title: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          title?: string | null
        }
        Relationships: []
      }
      due_dates: {
        Row: {
          assignment_id: string | null
          created_at: string
          date: string | null
          date_certain: boolean | null
          description: string | null
          id: string
          time_certain: boolean | null
          title: string | null
          url: string | null
        }
        Insert: {
          assignment_id?: string | null
          created_at?: string
          date?: string | null
          date_certain?: boolean | null
          description?: string | null
          id?: string
          time_certain?: boolean | null
          title?: string | null
          url?: string | null
        }
        Update: {
          assignment_id?: string | null
          created_at?: string
          date?: string | null
          date_certain?: boolean | null
          description?: string | null
          id?: string
          time_certain?: boolean | null
          title?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "due_dates_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      job_sync_groups: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_sync_groups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      job_syncs: {
        Row: {
          course_id: string | null
          created_at: string
          id: string
          job_sync_group_id: string | null
          scraped_tree: Json | null
          source_id: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          id?: string
          job_sync_group_id?: string | null
          scraped_tree?: Json | null
          source_id?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string
          id?: string
          job_sync_group_id?: string | null
          scraped_tree?: Json | null
          source_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_syncs_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_syncs_job_sync_group_id_fkey"
            columns: ["job_sync_group_id"]
            isOneToOne: false
            referencedRelation: "job_sync_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_syncs_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      sources: {
        Row: {
          course_id: string | null
          created_at: string
          id: string
          needs_authentication: boolean
          source_instructions: string | null
          url: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          id?: string
          needs_authentication?: boolean
          source_instructions?: string | null
          url?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string
          id?: string
          needs_authentication?: boolean
          source_instructions?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sources_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_assignments: {
        Row: {
          assignment_id: string | null
          chosen_due_date_id: string | null
          completed_at: string | null
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          assignment_id?: string | null
          chosen_due_date_id?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          assignment_id?: string | null
          chosen_due_date_id?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_assignments_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_assignments_chosen_due_date_id_fkey"
            columns: ["chosen_due_date_id"]
            isOneToOne: false
            referencedRelation: "due_dates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_assignments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_auth_details: {
        Row: {
          cookies: Json | null
          cookies_type: string | null
          created_at: string
          id: string
          in_sync: boolean | null
          user_id: string | null
        }
        Insert: {
          cookies?: Json | null
          cookies_type?: string | null
          created_at?: string
          id?: string
          in_sync?: boolean | null
          user_id?: string | null
        }
        Update: {
          cookies?: Json | null
          cookies_type?: string | null
          created_at?: string
          id?: string
          in_sync?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_auth_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_courses: {
        Row: {
          course_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_courses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          auth_id: string | null
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          auth_id?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          auth_id?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      job_sync_group_status:
        | "SCRAPED_TREE"
        | "UNIQUE_ASSIGNMENTS"
        | "ASSIGNMENT_DATES"
        | "COMPLETE"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      job_sync_group_status: [
        "SCRAPED_TREE",
        "UNIQUE_ASSIGNMENTS",
        "ASSIGNMENT_DATES",
        "COMPLETE",
      ],
    },
  },
} as const
