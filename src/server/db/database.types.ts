/**
 * Mirrors supabase/migrations. Regenerate with:
 *   npx supabase gen types typescript --project-id <id> > src/server/db/database.types.ts
 */
export type Database = {
  public: {
    Tables: {
      polls: {
        Row: {
          id: string;
          title: string;
          creator_id: number;
          creator_name: string;
          dates: string[];
          hour_from: number;
          hour_to: number;
          slot_minutes: number;
          timezone: string;
          expected_count: number | null;
          locale: string;
          created_at: string;
        };
        Insert: {
          id: string;
          title: string;
          creator_id: number;
          creator_name: string;
          dates: string[];
          hour_from: number;
          hour_to: number;
          slot_minutes: number;
          timezone: string;
          expected_count?: number | null;
          locale?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['polls']['Insert']>;
        Relationships: [];
      };
      poll_messages: {
        Row: {
          id: number;
          poll_id: string;
          source: 'inline' | 'group';
          inline_message_id: string | null;
          chat_id: number | null;
          message_id: number | null;
          created_at: string;
        };
        Insert: {
          poll_id: string;
          source: 'inline' | 'group';
          inline_message_id?: string | null;
          chat_id?: number | null;
          message_id?: number | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['poll_messages']['Insert']>;
        Relationships: [];
      };
      responses: {
        Row: {
          poll_id: string;
          user_id: number;
          name: string;
          username: string | null;
          slots: string[];
          updated_at: string;
        };
        Insert: {
          poll_id: string;
          user_id: number;
          name: string;
          username?: string | null;
          slots?: string[];
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['responses']['Insert']>;
        Relationships: [];
      };
      tips: {
        Row: {
          id: number;
          user_id: number;
          amount: number;
          telegram_payment_charge_id: string;
          created_at: string;
          refunded_at: string | null;
        };
        Insert: {
          user_id: number;
          amount: number;
          telegram_payment_charge_id: string;
          created_at?: string;
          refunded_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['tips']['Insert']>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
