import { createClient } from '@supabase/supabase-js'

// 使用环境变量直接导入
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 更好的错误处理 - 在开发环境显示警告，在生产环境创建降级客户端
if (!supabaseUrl || !supabaseAnonKey) {
  if (import.meta.env.DEV) {
    console.warn('Missing Supabase environment variables. Application may not work correctly.')
  }
}

// 创建客户端，即使环境变量缺失也返回有效的客户端实例
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')