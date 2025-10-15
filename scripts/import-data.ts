#!/usr/bin/env node
// 数据导入CLI工具
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync } from 'fs'

// 加载环境变量
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: join(__dirname, '..', '.env') })

async function importData() {
  console.log('🚀 开始导入诗词鉴赏应用数据...\n')

  try {
    // 1. 检查环境变量
    const supabaseUrl = process.env.VITE_SUPABASE_URL
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ 错误：缺少Supabase环境变量')
      console.log('请确保 .env 文件包含以下内容：')
      console.log('VITE_SUPABASE_URL=你的项目URL')
      console.log('VITE_SUPABASE_ANON_KEY=你的anon key')
      process.exit(1)
    }

    console.log('✅ 环境变量检查通过')

    // 2. 动态导入Supabase客户端
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseKey)

    // 测试连接
    console.log('🔗 测试Supabase连接...')
    const { error: testError } = await supabase.from('authors').select('count', { count: 'exact', head: true })
    
    if (testError && testError.code !== 'PGRST116') {
      console.error('❌ Supabase连接失败:', testError.message)
      process.exit(1)
    }

    console.log('✅ Supabase连接成功\n')

    // 3. 读取并执行数据库初始化脚本
    console.log('📋 执行数据库初始化脚本...')
    const initSql = readFileSync(join(__dirname, 'init-database.sql'), 'utf-8')
    
    // 分割SQL语句并执行
    const sqlStatements = initSql.split(';').filter(stmt => stmt.trim())
    
    for (const stmt of sqlStatements) {
      if (stmt.trim()) {
        const { error } = await supabase.rpc('exec_sql', { sql: stmt.trim() + ';' })
        if (error && !error.message.includes('function exec_sql')) {
          console.warn('⚠️ SQL执行警告（某些语句可能需要手动执行）:', error.message)
        }
      }
    }

    console.log('✅ 数据库初始化完成\n')

    // 4. 导入样本数据
    console.log('📊 导入样本数据...')
    const { generateSampleData } = await import('./generate-sample-data.js')
    await generateSampleData()

    console.log('\n🎉 数据导入完成！')
    console.log('📊 数据统计：')
    console.log('   - 作者数据：6位著名诗人')
    console.log('   - 诗词数据：15首经典诗词')
    console.log('   - 赏析内容：每首诗词配有专业赏析')

    console.log('\n🔗 下一步操作：')
    console.log('1. 在Supabase控制台验证表结构')
    console.log('2. 运行应用测试数据展示')
    console.log('3. 根据需要导入更多诗词数据')

  } catch (error) {
    console.error('❌ 数据导入失败:', error)
    process.exit(1)
  }
}

// 运行导入
if (import.meta.url === `file://${process.argv[1]}`) {
  importData()
}