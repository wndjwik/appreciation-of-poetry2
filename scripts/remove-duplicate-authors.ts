import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// 加载环境变量
dotenv.config()

// 直接创建Supabase客户端
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * 安全地去除诗人表中的重复记录
 * 考虑到诗词表的外键约束，需要先处理引用关系
 */

async function removeDuplicateAuthors() {
  console.log('开始分析诗人表重复情况...')

  try {
    // 1. 首先分析重复情况
    const { data: duplicateAnalysis, error: analysisError } = await supabase
      .from('authors')
      .select('name, id, created_at, dynasty')
      .order('name')
      .order('created_at', { ascending: false })

    if (analysisError) {
      throw new Error(`分析重复情况失败: ${analysisError.message}`)
    }

    // 按名字分组，找出重复的诗人
    const authorsByName = new Map<string, any[]>()
    duplicateAnalysis?.forEach(author => {
      if (!authorsByName.has(author.name)) {
        authorsByName.set(author.name, [])
      }
      authorsByName.get(author.name)!.push(author)
    })

    // 找出有重复的诗人
    const duplicateAuthors = Array.from(authorsByName.entries())
      .filter(([name, authors]) => authors.length > 1)
      .map(([name, authors]) => ({
        name,
        authors: authors.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      }))

    console.log(`发现 ${duplicateAuthors.length} 个重复的诗人名字:`)
    duplicateAuthors.forEach(dup => {
      console.log(`- ${dup.name}: ${dup.authors.length} 个记录`)
      dup.authors.forEach((author, index) => {
        console.log(`  ${index + 1}. ID: ${author.id}, 朝代: ${author.dynasty}, 创建时间: ${author.created_at}`)
      })
    })

    if (duplicateAuthors.length === 0) {
      console.log('没有发现重复的诗人记录')
      return
    }

    // 2. 检查每个重复诗人的诗词关联情况
    console.log('\n检查诗词关联情况...')
    for (const dup of duplicateAuthors) {
      console.log(`\n检查诗人 "${dup.name}" 的诗词关联:`)
      
      for (const author of dup.authors) {
        const { data: poems, error: poemsError } = await supabase
          .from('poems')
          .select('id, title')
          .eq('author_id', author.id)

        if (poemsError) {
          console.error(`查询诗人 ${author.name} 的诗词失败:`, poemsError)
          continue
        }

        console.log(`  ${author.id} (${author.dynasty}): ${poems?.length || 0} 首诗词`)
        if (poems && poems.length > 0) {
          poems.slice(0, 3).forEach(poem => {
            console.log(`    - ${poem.title}`)
          })
          if (poems.length > 3) {
            console.log(`    - ... 还有 ${poems.length - 3} 首`)
          }
        }
      }
    }

    // 3. 询问用户确认操作
    console.log('\n⚠️  安全警告: 此操作将修改数据库数据')
    console.log('建议先备份数据，然后选择要执行的操作:')
    console.log('1. 仅分析，不执行任何修改')
    console.log('2. 执行安全的去重操作（保留最新记录）')
    console.log('3. 退出')

    // 在实际执行前，这里应该等待用户输入
    // 由于这是脚本，我们先只进行分析，不执行修改
    console.log('\n当前设置为仅分析模式，不执行实际修改')
    console.log('如需执行去重操作，请修改脚本中的执行模式')

    // 4. 安全去重逻辑（注释掉，需要时启用）
    /*
    console.log('\n开始执行去重操作...')
    
    for (const dup of duplicateAuthors) {
      // 保留第一个（最新的）记录，删除其他重复记录
      const authorToKeep = dup.authors[0]
      const authorsToRemove = dup.authors.slice(1)

      console.log(`处理诗人 "${dup.name}":`)
      console.log(`  保留: ID ${authorToKeep.id} (${authorToKeep.dynasty})`)
      console.log(`  删除: ${authorsToRemove.map(a => `${a.id} (${a.dynasty})`).join(', ')}`)

      // 首先更新诗词表的引用
      for (const authorToRemove of authorsToRemove) {
        const { data: poems, error: poemsError } = await supabase
          .from('poems')
          .select('id')
          .eq('author_id', authorToRemove.id)

        if (poemsError) {
          console.error(`查询要转移的诗词失败:`, poemsError)
          continue
        }

        if (poems && poems.length > 0) {
          console.log(`  转移 ${poems.length} 首诗词到主诗人`)
          
          const { error: updateError } = await supabase
            .from('poems')
            .update({ author_id: authorToKeep.id })
            .eq('author_id', authorToRemove.id)

          if (updateError) {
            console.error(`转移诗词失败:`, updateError)
            continue
          }
        }

        // 删除重复的诗人记录
        const { error: deleteError } = await supabase
          .from('authors')
          .delete()
          .eq('id', authorToRemove.id)

        if (deleteError) {
          console.error(`删除诗人记录失败:`, deleteError)
        } else {
          console.log(`  成功删除诗人记录 ${authorToRemove.id}`)
        }
      }
    }
    */

    console.log('\n分析完成！如需执行去重操作，请:')
    console.log('1. 备份数据库')
    console.log('2. 取消注释脚本中的执行代码')
    console.log('3. 重新运行脚本')

  } catch (error) {
    console.error('执行过程中发生错误:', error)
  }
}

// 执行分析
removeDuplicateAuthors().catch(console.error)