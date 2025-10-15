export interface Database {
  public: {
    Tables: {
      authors: {
        Row: {
          id: string
          name: string
          dynasty: string
          introduction: string | null
          birth_year: number | null
          death_year: number | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          dynasty: string
          introduction?: string | null
          birth_year?: number | null
          death_year?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          dynasty?: string
          introduction?: string | null
          birth_year?: number | null
          death_year?: number | null
          created_at?: string
        }
      }
      poems: {
        Row: {
          id: string
          title: string
          content: string
          dynasty: string
          author_id: string
          type: string
          themes: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          dynasty: string
          author_id: string
          type: string
          themes?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          dynasty?: string
          author_id?: string
          type?: string
          themes?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      appreciations: {
        Row: {
          id: string
          poem_id: string
          content: string
          source: string | null
          created_at: string
        }
        Insert: {
          id?: string
          poem_id: string
          content: string
          source?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          poem_id?: string
          content?: string
          source?: string | null
          created_at?: string
        }
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
  }
}