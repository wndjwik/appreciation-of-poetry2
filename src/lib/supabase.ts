import { createClient } from '@supabase/supabase-js'

// 使用环境变量直接导入
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// 简化类型定义，避免导入问题
export const supabase = createClient(supabaseUrl, supabaseAnonKey)