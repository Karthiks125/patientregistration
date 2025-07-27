export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      "Patient registration": {
        Row: {
          Name: string
          Notes: string | null
          Type: string | null
        }
        Insert: {
          Name: string
          Notes?: string | null
          Type?: string | null
        }
        Update: {
          Name?: string
          Notes?: string | null
          Type?: string | null
        }
        Relationships: []
      }
      patient_registrations: {
        Row: {
          contact_lens_history: string | null
          created_at: string
          date_of_birth: Json
          drug_allergies: Json | null
          email: string
          eye_diseases: Json | null
          eye_drops: Json | null
          eye_injuries: Json | null
          eye_lasers: Json | null
          eye_medications: Json | null
          eye_surgeries: Json | null
          family_doctor: string | null
          first_name: string
          id: string
          last_name: string
          medical_conditions: Json | null
          medications: Json | null
          optometrist: string | null
          phone: string | null
          regular_conditions: Json | null
          regular_medications: Json | null
          specialists: Json | null
          specialists_with_doctors: Json | null
          updated_at: string
        }
        Insert: {
          contact_lens_history?: string | null
          created_at?: string
          date_of_birth: Json
          drug_allergies?: Json | null
          email: string
          eye_diseases?: Json | null
          eye_drops?: Json | null
          eye_injuries?: Json | null
          eye_lasers?: Json | null
          eye_medications?: Json | null
          eye_surgeries?: Json | null
          family_doctor?: string | null
          first_name: string
          id?: string
          last_name: string
          medical_conditions?: Json | null
          medications?: Json | null
          optometrist?: string | null
          phone?: string | null
          regular_conditions?: Json | null
          regular_medications?: Json | null
          specialists?: Json | null
          specialists_with_doctors?: Json | null
          updated_at?: string
        }
        Update: {
          contact_lens_history?: string | null
          created_at?: string
          date_of_birth?: Json
          drug_allergies?: Json | null
          email?: string
          eye_diseases?: Json | null
          eye_drops?: Json | null
          eye_injuries?: Json | null
          eye_lasers?: Json | null
          eye_medications?: Json | null
          eye_surgeries?: Json | null
          family_doctor?: string | null
          first_name?: string
          id?: string
          last_name?: string
          medical_conditions?: Json | null
          medications?: Json | null
          optometrist?: string | null
          phone?: string | null
          regular_conditions?: Json | null
          regular_medications?: Json | null
          specialists?: Json | null
          specialists_with_doctors?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      triagedata: {
        Row: {
          dob: string
          doctor: string
          duration: string
          eye: string
          healthcard: string
          id: number
          name: string
          specialsymptoms: string
          symptoms: string
          timestamp: string | null
          visionchanges: string
          visionsymptoms: string
        }
        Insert: {
          dob: string
          doctor: string
          duration: string
          eye: string
          healthcard: string
          id?: never
          name: string
          specialsymptoms: string
          symptoms: string
          timestamp?: string | null
          visionchanges: string
          visionsymptoms: string
        }
        Update: {
          dob?: string
          doctor?: string
          duration?: string
          eye?: string
          healthcard?: string
          id?: never
          name?: string
          specialsymptoms?: string
          symptoms?: string
          timestamp?: string | null
          visionchanges?: string
          visionsymptoms?: string
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
    Enums: {},
  },
} as const
