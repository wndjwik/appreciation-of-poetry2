#!/usr/bin/env node
// Supabase连接测试脚本
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// 加载环境变量
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: join(__dirname, '..', '.env') })

async function testConnection() {
  console.log('🔗 测试Supabase连接...\n')

  try {
    // 检查环境变量
    const supabaseUrl = process.env.VITE_SUPABASE_URL
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ 错误：缺少Supabase环境变量')
      console.log('请确保 .env 文件包含以下内容：')
      console.log('VITE_SUPABASE_URL=你的项目URL')
      console.log('VITE_SUPABASE_ANON_KEY=你的anon key')
      console.log('\n💡 提示：复制 .env.example 为 .env 并填入实际值')
      process.exit(1)
    }

    console.log('✅ 环境变量检查通过')
    console.log(`📋 项目URL: ${supabaseUrl.substring(0, 30)}...`)
    console.log(`🔑 API密钥: ${supabaseKey.substring(0, 10)}...\n`)

    // 动态导入Supabase客户端
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('🔄 测试数据库连接...')

    // 测试连接
    const { data, error } = await supabase.from('authors').select('count', { count: 'exact', head: true })

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('ℹ️  表不存在（正常情况，需要先初始化数据库）')
        console.log('✅ Supabase连接成功！')
        console.log('\n📋 下一步操作：')
        console.log('1. 在Supabase控制台执行 scripts/init-database.sql')
        console.log('2. 运行 npm run db:init 导入样本数据')
      } else {
        console.error('❌ 连接失败:', error.message)
        process.exit(1)
      }
    } else {
      console.log('✅ Supabase连接成功！')
      console.log(`📊 当前数据量：${data?.length || 0} 条记录`)
    }

    console.log('\n🎉 连接测试完成！')

  } catch (error) {
    console.error('❌ 测试失败:', error)
    process.exit(1)
  }
}

// 运行测试
if (import.meta.url === `file://${process.argv[1]}`) {
  testConnection()
}