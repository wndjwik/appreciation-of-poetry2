/**
 * 简单的诗人表重复分析脚本
 * 直接使用前端配置进行分析
 */

// 使用前端已有的配置
const supabaseUrl = 'https://your-project-ref.supabase.co'  // 需要替换为实际URL
const supabaseAnonKey = 'your-anon-key'  // 需要替换为实际密钥

async function analyzeDuplicates() {
  console.log('诗人表重复分析工具')
  console.log('===================')
  
  try {
    // 检查Supabase配置
    if (!supabaseUrl || supabaseUrl.includes('your-project-ref') || 
        !supabaseAnonKey || supabaseAnonKey.includes('your-anon-key')) {
      console.log('❌ 请先配置Supabase连接信息:')
      console.log('1. 修改 scripts/analyze-duplicates.ts 文件')
      console.log('2. 设置正确的 supabaseUrl 和 supabaseAnonKey')
      console.log('3. 或者使用前端已有的配置')
      return
    }

    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    console.log('🔍 连接Supabase数据库...')

    // 1. 查询所有诗人
    const { data: authors, error } = await supabase
      .from('authors')
      .select('id, name, dynasty, created_at')
      .order('name')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ 查询诗人表失败:', error)
      return
    }

    if (!authors || authors.length === 0) {
      console.log('✅ 诗人表为空，没有重复记录')
      return
    }

    console.log(`📊 总共 ${authors.length} 位诗人`)

    // 2. 分析重复情况
    const nameCounts = new Map()
    authors.forEach(author => {
      const count = nameCounts.get(author.name) || 0
      nameCounts.set(author.name, count + 1)
    })

    const duplicates = Array.from(nameCounts.entries())
      .filter(([name, count]) => count > 1)
      .map(([name, count]) => ({ name, count }))

    console.log(`\n🔍 发现 ${duplicates.length} 个重复的诗人名字:`)
    
    if (duplicates.length === 0) {
      console.log('✅ 没有发现重复的诗人记录')
      return
    }

    // 3. 显示重复详情
    duplicates.forEach(dup => {
      const duplicateAuthors = authors.filter(a => a.name === dup.name)
      console.log(`\n📝 "${dup.name}" - ${dup.count} 个记录:`)
      
      duplicateAuthors.forEach((author, index) => {
        console.log(`   ${index + 1}. ID: ${author.id}, 朝代: ${author.dynasty}`)
      })
    })

    // 4. 检查诗词关联
    console.log('\n📚 检查诗词关联情况...')
    
    for (const dup of duplicates) {
      const duplicateAuthors = authors.filter(a => a.name === dup.name)
      
      console.log(`\n诗人 "${dup.name}":`)
      
      for (const author of duplicateAuthors) {
        const { data: poems } = await supabase
          .from('poems')
          .select('id, title')
          .eq('author_id', author.id)
          .limit(5) // 只检查前5首

        console.log(`  ${author.id}: ${poems?.length || 0} 首诗词`)
        
        if (poems && poems.length > 0) {
          poems.forEach(poem => {
            console.log(`    - ${poem.title}`)
          })
        }
      }
    }

    // 5. 提供解决方案
    console.log('\n💡 解决方案建议:')
    console.log('1. 保留最新的诗人记录（按created_at排序）')
    console.log('2. 将重复诗人的诗词关联到保留的诗人')
    console.log('3. 删除其他重复的诗人记录')
    
    console.log('\n⚠️  安全提示:')
    console.log('- 操作前请备份数据库')
    console.log('- 确保诗词表的外键约束正确处理')
    console.log('- 建议在Supabase控制台执行SQL操作')

  } catch (error) {
    console.error('❌ 分析过程中发生错误:', error)
  }
}

// 执行分析
analyzeDuplicates().catch(console.error)