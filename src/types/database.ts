import { Poem, Author } from '../services/poemService'

// 诗人介绍相关类型
export interface AuthorFilters {
  dynasty?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'name' | 'dynasty' | 'popular';
}

export interface AuthorsResponse {
  authors: Author[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  filters: AuthorFilters;
}

export interface AuthorStats {
  dynasty: {
    [key: string]: number;
  };
  total: number;
}

// 经典诗词筛选参数
export interface ClassicalPoemFilters {
  dynasty?: string;
  genre?: string;
  sortBy?: 'popular' | 'time' | 'length';
  page?: number;
  pageSize?: number;
  search?: string;
}

// 经典诗词响应
export interface ClassicalPoemsResponse {
  poems: Poem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  filters: ClassicalPoemFilters;
}

// 分类统计信息
export interface CategoryStats {
  dynasty: {
    [key: string]: number;
  };
  genre: {
    [key: string]: number;
  };
  total: number;
}

// 用户认证相关类型
export interface User {
  id: string;
  email: string;
  nickname: string;
  created_at: string;
  updated_at: string;
}

export interface RegisterRequest {
  email: string;
  nickname: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  session?: any;
}

// Supabase用户表结构
export interface UserProfile {
  id: string;
  email: string;
  nickname: string;
  created_at: string;
  updated_at: string;
}

export interface AuthError {
  message: string;
  status?: number;
}

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
      user_profiles: {
        Row: {
          id: string
          email: string
          nickname: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          nickname: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          nickname?: string
          created_at?: string
          updated_at?: string
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