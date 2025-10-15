// 简单的数据导入脚本
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// 加载环境变量
config()

// 样本数据
const authors = [
  {
    name: '李白',
    dynasty: '唐',
    introduction: '李白（701年－762年），字太白，号青莲居士，唐代伟大的浪漫主义诗人，被后人誉为"诗仙"。',
    birth_year: 701,
    death_year: 762
  },
  {
    name: '杜甫',
    dynasty: '唐',
    introduction: '杜甫（712年－770年），字子美，自号少陵野老，唐代伟大的现实主义诗人，被后人称为"诗圣"。',
    birth_year: 712,
    death_year: 770
  },
  {
    name: '王维',
    dynasty: '唐',
    introduction: '王维（701年－761年），字摩诘，号摩诘居士，唐代著名诗人、画家，有"诗佛"之称。',
    birth_year: 701,
    death_year: 761
  }
]

const poems = [
  {
    title: '静夜思',
    content: '床前明月光，疑是地上霜。\n举头望明月，低头思故乡。',
    dynasty: '唐',
    author_name: '李白',
    type: '诗',
    themes: ['思乡', '月亮'],
    appreciation: '这首诗通过简洁的语言描绘了游子思乡之情，明月成为思乡的象征，情感真挚动人。'
  },
  {
    title: '春晓',
    content: '春眠不觉晓，处处闻啼鸟。\n夜来风雨声，花落知多少。',
    dynasty: '唐',
    author_name: '孟浩然',
    type: '诗',
    themes: ['春天', '自然'],
    appreciation: '诗歌描绘了春日早晨的景色，语言清新自然，表现了诗人对大自然的热爱。'
  },
  {
    title: '登鹳雀楼',
    content: '白日依山尽，黄河入海流。\n欲穷千里目，更上一层楼。',
    dynasty: '唐',
    author_name: '王之涣',
    type: '诗',
    themes: ['登高', '哲理'],
    appreciation: '诗歌通过登高望远的景象，表达了不断进取、追求更高境界的人生哲理。'
  }
]

async function importData() {
  console.log('🚀 开始导入样本数据...\n')

  const supabaseUrl = process.env.VITE_SUPABASE_URL!
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // 1. 导入作者数据
    console.log('1. 👥 导入作者数据...')
    const authorMap = new Map()
    
    for (const authorData of authors) {
      const { data: author, error } = await supabase
        .from('authors')
        .insert([authorData])
        .select()
        .single()

      if (error) {
        console.error(`   导入作者 ${authorData.name} 失败:`, error.message)
        continue
      }

      authorMap.set(authorData.name, author.id)
      console.log(`   ✅ ${authorData.name} 导入成功`)
    }

    // 2. 导入诗词数据
    console.log('\n2. 📖 导入诗词数据...')
    
    for (const poemData of poems) {
      const authorId = authorMap.get(poemData.author_name)
      
      if (!authorId) {
        console.log(`   ⚠️  未找到作者 ${poemData.author_name}，跳过诗词 ${poemData.title}`)
        continue
      }

      const { data: poem, error } = await supabase
        .from('poems')
        .insert([{
          title: poemData.title,
          content: poemData.content,
          dynasty: poemData.dynasty,
          author_id: authorId,
          type: poemData.type,
          themes: poemData.themes
        }])
        .select()
        .single()

      if (error) {
        console.error(`   导入诗词 ${poemData.title} 失败:`, error.message)
        continue
      }

      console.log(`   ✅ ${poemData.title} 导入成功`)

      // 3. 导入赏析数据
      if (poemData.appreciation) {
        const { error: appreciationError } = await supabase
          .from('appreciations')
          .insert([{
            poem_id: poem.id,
            content: poemData.appreciation,
            source: '唐诗鉴赏辞典'
          }])

        if (appreciationError) {
          console.error(`   导入赏析失败:`, appreciationError.message)
        } else {
          console.log(`   💭 ${poemData.title} 赏析导入成功`)
        }
      }
    }

    console.log('\n🎉 数据导入完成！')
    console.log(`📊 导入统计:`)
    console.log(`   - 作者: ${authorMap.size} 位`)
    console.log(`   - 诗词: ${poems.length} 首`)
    console.log(`   - 赏析: ${poems.length} 篇`)

  } catch (error) {
    console.error('❌ 数据导入失败:', error)
  }
}

importData()