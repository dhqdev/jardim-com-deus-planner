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
      bible_books: {
        Row: {
          book_name: string
          book_number: number
          chapters: number
          created_at: string | null
          id: number
          testament: string
        }
        Insert: {
          book_name: string
          book_number: number
          chapters: number
          created_at?: string | null
          id?: number
          testament: string
        }
        Update: {
          book_name?: string
          book_number?: number
          chapters?: number
          created_at?: string | null
          id?: number
          testament?: string
        }
        Relationships: []
      }
      bible_verses: {
        Row: {
          book_id: number
          chapter: number
          created_at: string | null
          id: number
          text: string
          verse: number
        }
        Insert: {
          book_id: number
          chapter: number
          created_at?: string | null
          id?: number
          text: string
          verse: number
        }
        Update: {
          book_id?: number
          chapter?: number
          created_at?: string | null
          id?: number
          text?: string
          verse?: number
        }
        Relationships: [
          {
            foreignKeyName: "bible_verses_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "bible_books"
            referencedColumns: ["id"]
          },
        ]
      }
      community_invites: {
        Row: {
          accepted_at: string | null
          email: string
          id: string
          invite_token: string | null
          invited_at: string | null
          is_accepted: boolean | null
          user_id: string
        }
        Insert: {
          accepted_at?: string | null
          email: string
          id?: string
          invite_token?: string | null
          invited_at?: string | null
          is_accepted?: boolean | null
          user_id: string
        }
        Update: {
          accepted_at?: string | null
          email?: string
          id?: string
          invite_token?: string | null
          invited_at?: string | null
          is_accepted?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      daily_quotes: {
        Row: {
          author: string
          bible_passage: string
          bible_reference: string
          created_at: string | null
          day_of_week: number
          devotional_text: string
          id: string
          quote: string
          updated_at: string | null
        }
        Insert: {
          author: string
          bible_passage: string
          bible_reference: string
          created_at?: string | null
          day_of_week: number
          devotional_text: string
          id?: string
          quote: string
          updated_at?: string | null
        }
        Update: {
          author?: string
          bible_passage?: string
          bible_reference?: string
          created_at?: string | null
          day_of_week?: number
          devotional_text?: string
          id?: string
          quote?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      diary_entries: {
        Row: {
          content: string
          created_at: string | null
          id: string
          mood: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          mood?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          mood?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      friendships: {
        Row: {
          created_at: string | null
          friend_id: string
          id: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          friend_id: string
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          friend_id?: string
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          image_url: string | null
          message_type: string | null
          prayer_id: string | null
          read_at: string | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          message_type?: string | null
          prayer_id?: string | null
          read_at?: string | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          message_type?: string | null
          prayer_id?: string | null
          read_at?: string | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_prayer_id_fkey"
            columns: ["prayer_id"]
            isOneToOne: false
            referencedRelation: "prayers"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string
          created_at: string | null
          from_user_id: string | null
          id: string
          is_read: boolean | null
          related_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          from_user_id?: string | null
          id?: string
          is_read?: boolean | null
          related_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          from_user_id?: string | null
          id?: string
          is_read?: boolean | null
          related_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      prayer_support: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          prayer_id: string
          supporter_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          prayer_id: string
          supporter_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          prayer_id?: string
          supporter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prayer_support_prayer_id_fkey"
            columns: ["prayer_id"]
            isOneToOne: false
            referencedRelation: "prayers"
            referencedColumns: ["id"]
          },
        ]
      }
      prayers: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_answered: boolean | null
          is_private: boolean | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_answered?: boolean | null
          is_private?: boolean | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_answered?: boolean | null
          is_private?: boolean | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          church: string | null
          community_access: boolean | null
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          testimony: string | null
          updated_at: string | null
        }
        Insert: {
          church?: string | null
          community_access?: boolean | null
          created_at?: string | null
          email?: string | null
          id: string
          name?: string | null
          testimony?: string | null
          updated_at?: string | null
        }
        Update: {
          church?: string | null
          community_access?: boolean | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          testimony?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_daily_progress: {
        Row: {
          created_at: string | null
          date: string
          devotional_completed: boolean | null
          id: string
          passage_completed: boolean | null
          quote_completed: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date?: string
          devotional_completed?: boolean | null
          id?: string
          passage_completed?: boolean | null
          quote_completed?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          devotional_completed?: boolean | null
          id?: string
          passage_completed?: boolean | null
          quote_completed?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string | null
          email_reminders: boolean | null
          id: string
          notifications: boolean | null
          sound_effects: boolean | null
          theme: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email_reminders?: boolean | null
          id: string
          notifications?: boolean | null
          sound_effects?: boolean | null
          theme?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email_reminders?: boolean | null
          id?: string
          notifications?: boolean | null
          sound_effects?: boolean | null
          theme?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_tasks: {
        Row: {
          category: string
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          id: string
          title: string
          updated_at: string | null
          user_id: string
          verse: string | null
        }
        Insert: {
          category: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          title: string
          updated_at?: string | null
          user_id: string
          verse?: string | null
        }
        Update: {
          category?: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string
          verse?: string | null
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
