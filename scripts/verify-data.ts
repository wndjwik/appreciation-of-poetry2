// 验证数据导入结果
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// 加载环境变量
config()

async function verifyData() {
  console.log('🔍 验证数据导入结果...\n')

  const supabaseUrl = process.env.VITE_SUPABASE_URL!
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // 1. 统计各表数据量
    console.log('1. 📊 数据统计:')
    
    const { count: authorCount } = await supabase
      .from('authors')
      .select('*', { count: 'exact', head: true })
    
    const { count: poemCount } = await supabase
      .from('poems')
      .select('*', { count: 'exact', head: true })
    
    const { count: appreciationCount } = await supabase
      .from('appreciations')
      .select('*', { count: 'exact', head: true })

    console.log(`   👥 作者数量: ${authorCount || 0}`)
    console.log(`   📖 诗词数量: ${poemCount || 0}`)
    console.log(`   💭 赏析数量: ${appreciationCount || 0}`)
    console.log('')

    // 2. 查看样本数据
    console.log('2. 📝 样本数据预览:')
    
    if (authorCount && authorCount > 0) {
      const { data: authors } = await supabase
        .from('authors')
        .select('name, dynasty')
        .limit(3)
      
      console.log('   👥 作者样例:')
      authors?.forEach(author => {
        console.log(`     - ${author.name} (${author.dynasty})`)
      })
    }

    if (poemCount && poemCount > 0) {
      const { data: poems } = await supabase
        .from('poems')
        .select('title, dynasty, authors(name)')
        .limit(3)
      
      console.log('   📖 诗词样例:')
      poems?.forEach(poem => {
        const authorName = (poem.authors as any)?.name || '未知'
        console.log(`     - ${poem.title} (${authorName}, ${poem.dynasty})`)
      })
    }
    console.log('')

    // 3. 测试搜索功能
    console.log('3. 🔍 测试搜索功能:')
    
    const { data: searchResults } = await supabase
      .from('poems')
      .select('title, authors(name)')
      .ilike('title', '%静夜%')
      .limit(3)

    if (searchResults && searchResults.length > 0) {
      console.log('   ✅ 搜索"静夜"结果:')
      searchResults.forEach(result => {
        const authorName = (result.authors as any)?.name || '未知'
        console.log(`     - ${result.title} (${authorName})`)
      })
    } else {
      console.log('   ℹ️  未找到匹配的诗词')
    }
    console.log('')

    // 4. 总结
    console.log('🎉 验证完成！')
    
    if (poemCount && poemCount > 0) {
      console.log(`✅ 成功导入 ${poemCount} 首诗词数据`)
      console.log('🚀 现在可以启动应用进行测试了！')
    } else {
      console.log('❌ 数据导入可能未成功')
      console.log('💡 请检查数据导入脚本或手动导入数据')
    }

  } catch (error) {
    console.error('❌ 验证过程中发生错误:', error)
  }
}

verifyData()