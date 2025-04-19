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
      blog_posts: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          image_url: string | null
          is_published: boolean
          short_description: string
          title: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_published?: boolean
          short_description: string
          title: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_published?: boolean
          short_description?: string
          title?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
          phone: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          message: string
          name: string
          phone?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          phone?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      dangerous_areas: {
        Row: {
          created_at: string
          description: string
          id: string
          is_approved: boolean
          location: string
          map_link: string | null
          region: string | null
          reported_by_name: string | null
          severity: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          is_approved?: boolean
          location: string
          map_link?: string | null
          region?: string | null
          reported_by_name?: string | null
          severity: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_approved?: boolean
          location?: string
          map_link?: string | null
          region?: string | null
          reported_by_name?: string | null
          severity?: string
        }
        Relationships: []
      }
      good_deeds: {
        Row: {
          author_name: string | null
          created_at: string
          date: string
          description: string | null
          id: string
          ip_address: string
          is_approved: boolean | null
          title: string | null
        }
        Insert: {
          author_name?: string | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          ip_address: string
          is_approved?: boolean | null
          title?: string | null
        }
        Update: {
          author_name?: string | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          ip_address?: string
          is_approved?: boolean | null
          title?: string | null
        }
        Relationships: []
      }
      partners: {
        Row: {
          company_name: string
          created_at: string
          id: string
          logo_url: string
          website_url: string | null
        }
        Insert: {
          company_name: string
          created_at?: string
          id?: string
          logo_url: string
          website_url?: string | null
        }
        Update: {
          company_name?: string
          created_at?: string
          id?: string
          logo_url?: string
          website_url?: string | null
        }
        Relationships: []
      }
      partners_requests: {
        Row: {
          company_name: string
          contact_person: string
          created_at: string
          email: string
          id: string
          is_approved: boolean
          logo_url: string | null
          message: string | null
          phone: string | null
        }
        Insert: {
          company_name: string
          contact_person: string
          created_at?: string
          email: string
          id?: string
          is_approved?: boolean
          logo_url?: string | null
          message?: string | null
          phone?: string | null
        }
        Update: {
          company_name?: string
          contact_person?: string
          created_at?: string
          email?: string
          id?: string
          is_approved?: boolean
          logo_url?: string | null
          message?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_admin: boolean | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      push_subscribers: {
        Row: {
          category: string[] | null
          city: string | null
          created_at: string
          id: string
          player_id: string
          user_id: string | null
        }
        Insert: {
          category?: string[] | null
          city?: string | null
          created_at?: string
          id?: string
          player_id: string
          user_id?: string | null
        }
        Update: {
          category?: string[] | null
          city?: string | null
          created_at?: string
          id?: string
          player_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          id: string
          reason: string
          reported_by: string
          signal_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reason: string
          reported_by: string
          signal_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reason?: string
          reported_by?: string
          signal_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_signal_id_fkey"
            columns: ["signal_id"]
            isOneToOne: false
            referencedRelation: "signals"
            referencedColumns: ["id"]
          },
        ]
      }
      rescuers: {
        Row: {
          city: string
          created_at: string
          help_date: string
          help_description: string
          id: string
          image_url: string | null
          name: string
        }
        Insert: {
          city: string
          created_at?: string
          help_date: string
          help_description: string
          id?: string
          image_url?: string | null
          name: string
        }
        Update: {
          city?: string
          created_at?: string
          help_date?: string
          help_description?: string
          id?: string
          image_url?: string | null
          name?: string
        }
        Relationships: []
      }
      signals: {
        Row: {
          category: string
          city: string
          created_at: string
          description: string
          id: string
          image_url: string | null
          is_approved: boolean
          is_resolved: boolean
          link: string | null
          phone: string | null
          status: string
          title: string
          user_id: string
        }
        Insert: {
          category: string
          city: string
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          is_approved?: boolean
          is_resolved?: boolean
          link?: string | null
          phone?: string | null
          status?: string
          title: string
          user_id: string
        }
        Update: {
          category?: string
          city?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          is_approved?: boolean
          is_resolved?: boolean
          link?: string | null
          phone?: string | null
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_published: boolean
          title: string
          youtube_url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          title: string
          youtube_url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          title?: string
          youtube_url?: string
        }
        Relationships: []
      }
      volunteers: {
        Row: {
          can_help_with: string[]
          city: string
          created_at: string | null
          email: string
          full_name: string
          id: string
          is_approved: boolean | null
          motivation: string | null
          phone: string | null
          user_id: string
        }
        Insert: {
          can_help_with: string[]
          city: string
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          is_approved?: boolean | null
          motivation?: string | null
          phone?: string | null
          user_id: string
        }
        Update: {
          can_help_with?: string[]
          city?: string
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          is_approved?: boolean | null
          motivation?: string | null
          phone?: string | null
          user_id?: string
        }
        Relationships: []
      }
      witnesses: {
        Row: {
          contact_name: string
          created_at: string
          date: string
          description: string
          expires_at: string
          id: string
          image_url: string | null
          is_approved: boolean
          location: string
          phone: string | null
          title: string
          user_id: string
        }
        Insert: {
          contact_name: string
          created_at?: string
          date: string
          description: string
          expires_at: string
          id?: string
          image_url?: string | null
          is_approved?: boolean
          location: string
          phone?: string | null
          title: string
          user_id: string
        }
        Update: {
          contact_name?: string
          created_at?: string
          date?: string
          description?: string
          expires_at?: string
          id?: string
          image_url?: string | null
          is_approved?: boolean
          location?: string
          phone?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      user_profiles_with_email: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string | null
          is_admin: boolean | null
          role: Database["public"]["Enums"]["user_role"] | null
        }
        Relationships: []
      }
    }
    Functions: {
      admin_update_user_role: {
        Args: { admin_id: string; target_user_id: string; new_role: string }
        Returns: boolean
      }
      can_add_good_deed: {
        Args: { client_ip: string }
        Returns: boolean
      }
      get_good_deeds_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_count: number
          today_count: number
          pending_count: number
        }[]
      }
    }
    Enums: {
      user_role: "admin" | "moderator" | "user"
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
    Enums: {
      user_role: ["admin", "moderator", "user"],
    },
  },
} as const
