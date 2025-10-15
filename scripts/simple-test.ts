// 简单的Supabase连接测试
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// 加载环境变量
config()

async function testConnection() {
  console.log('🔗 测试Supabase连接...\n')

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

  console.log('URL:', supabaseUrl)
  console.log('Key length:', supabaseKey?.length)

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ 缺少环境变量')
    return
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // 测试连接
    const { data, error } = await supabase.from('authors').select('count', { 
      count: 'exact', 
      head: true 
    })

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('✅ 连接成功！表不存在（需要初始化数据库）')
      } else {
        console.error('❌ 连接错误:', error.message)
      }
    } else {
      console.log('✅ 连接成功！')
    }

  } catch (error) {
    console.error('❌ 测试失败:', error)
  }
}

testConnection()