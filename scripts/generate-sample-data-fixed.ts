// 修复后的诗词样本数据生成脚本
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// 加载环境变量
config()

const supabaseUrl = process.env.VITE_SUPABASE_URL!
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// 作者数据 - 只包含已定义的作者
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
  },
  {
    name: '苏轼',
    dynasty: '宋',
    introduction: '苏轼（1037年－1101年），字子瞻，号东坡居士，北宋文学家、书画家，唐宋八大家之一。',
    birth_year: 1037,
    death_year: 1101
  },
  {
    name: '李清照',
    dynasty: '宋',
    introduction: '李清照（1084年－1155年），号易安居士，宋代著名女词人，婉约词派代表。',
    birth_year: 1084,
    death_year: 1155
  },
  {
    name: '辛弃疾',
    dynasty: '宋',
    introduction: '辛弃疾（1140年－1207年），字幼安，号稼轩，南宋豪放派词人，有"词中之龙"之称。',
    birth_year: 1140,
    death_year: 1207
  }
]

// 诗词数据 - 只包含已定义作者的诗词，避免重复
const poems = [
  {
    title: '静夜思',
    content: '床前明月光，疑是地上霜。\n举头望明月，低头思故乡。',
    dynasty: '唐',
    author: '李白',
    type: '诗',
    themes: ['思乡', '月亮'],
    appreciation: '这首诗通过简洁的语言描绘了游子思乡之情，明月成为思乡的象征，情感真挚动人。'
  },
  {
    title: '相思',
    content: '红豆生南国，春来发几枝。\n愿君多采撷，此物最相思。',
    dynasty: '唐',
    author: '王维',
    type: '诗',
    themes: ['爱情', '相思'],
    appreciation: '以红豆象征相思，语言含蓄优美，表达了深沉的思念之情。'
  },
  {
    title: '水调歌头·明月几时有',
    content: '明月几时有？把酒问青天。\n不知天上宫阙，今夕是何年。\n我欲乘风归去，又恐琼楼玉宇，高处不胜寒。\n起舞弄清影，何似在人间。',
    dynasty: '宋',
    author: '苏轼',
    type: '词',
    themes: ['月亮', '思亲', '人生'],
    appreciation: '这首词以问月开篇，抒发了对人生的思考和对亲人的思念，意境开阔深远。'
  },
  {
    title: '声声慢·寻寻觅觅',
    content: '寻寻觅觅，冷冷清清，凄凄惨惨戚戚。\n乍暖还寒时候，最难将息。\n三杯两盏淡酒，怎敌他、晚来风急？\n雁过也，正伤心，却是旧时相识。',
    dynasty: '宋',
    author: '李清照',
    type: '词',
    themes: ['忧愁', '孤独'],
    appreciation: '词作通过叠字手法，淋漓尽致地表现了词人内心的孤寂和忧伤。'
  },
  {
    title: '青玉案·元夕',
    content: '东风夜放花千树。更吹落、星如雨。\n宝马雕车香满路。\n凤箫声动，玉壶光转，一夜鱼龙舞。',
    dynasty: '宋',
    author: '辛弃疾',
    type: '词',
    themes: ['元宵', '热闹'],
    appreciation: '描绘了元宵佳节的热闹景象，语言华丽，意境优美。'
  },
  {
    title: '望庐山瀑布',
    content: '日照香炉生紫烟，遥看瀑布挂前川。\n飞流直下三千尺，疑是银河落九天。',
    dynasty: '唐',
    author: '李白',
    type: '诗',
    themes: ['山水', '壮观'],
    appreciation: '以夸张的手法描绘庐山瀑布的雄伟壮观，展现了诗人豪放的风格。'
  },
  {
    title: '黄鹤楼送孟浩然之广陵',
    content: '故人西辞黄鹤楼，烟花三月下扬州。\n孤帆远影碧空尽，唯见长江天际流。',
    dynasty: '唐',
    author: '李白',
    type: '诗',
    themes: ['送别', '友情'],
    appreciation: '送别诗中的经典之作，情景交融，表达了深挚的友情。'
  },
  {
    title: '题西林壁',
    content: '横看成岭侧成峰，远近高低各不同。\n不识庐山真面目，只缘身在此山中。',
    dynasty: '宋',
    author: '苏轼',
    type: '诗',
    themes: ['哲理', '山水'],
    appreciation: '通过观山悟出人生哲理，语言浅显而含义深刻。'
  },
  {
    title: '春望',
    content: '国破山河在，城春草木深。\n感时花溅泪，恨别鸟惊心。\n烽火连三月，家书抵万金。\n白头搔更短，浑欲不胜簪。',
    dynasty: '唐',
    author: '杜甫',
    type: '诗',
    themes: ['忧国', '思乡'],
    appreciation: '表达了诗人在战乱中对国家和家人的深切忧虑，情感深沉。'
  },
  {
    title: '破阵子·为陈同甫赋壮词以寄之',
    content: '醉里挑灯看剑，梦回吹角连营。\n八百里分麾下炙，五十弦翻塞外声。沙场秋点兵。',
    dynasty: '宋',
    author: '辛弃疾',
    type: '词',
    themes: ['豪放', '军事'],
    appreciation: '展现了词人豪放的风格和对军旅生活的向往。'
  }
]

async function generateSampleData() {
  console.log('开始生成修复后的样本数据...')

  try {
    // 1. 插入作者数据
    console.log('插入作者数据...')
    const authorMap = new Map()
    
    for (const authorData of authors) {
      const { data: author, error } = await supabase
        .from('authors')
        .insert([authorData])
        .select()
        .single()

      if (error) {
        console.error(`插入作者 ${authorData.name} 失败:`, error)
        continue
      }

      authorMap.set(authorData.name, author.id)
      console.log(`作者 ${authorData.name} 插入成功`)
    }

    // 2. 插入诗词数据
    console.log('插入诗词数据...')
    let successCount = 0
    
    for (const poemData of poems) {
      const authorId = authorMap.get(poemData.author)
      
      if (!authorId) {
        console.warn(`未找到作者 ${poemData.author}，跳过诗词 ${poemData.title}`)
        continue
      }

      const { data: poem, error: poemError } = await supabase
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

      if (poemError) {
        console.error(`插入诗词 ${poemData.title} 失败:`, poemError)
        continue
      }

      console.log(`诗词 ${poemData.title} 插入成功`)
      successCount++

      // 3. 插入赏析数据
      if (poemData.appreciation) {
        const { error: appreciationError } = await supabase
          .from('appreciations')
          .insert([{
            poem_id: poem.id,
            content: poemData.appreciation,
            source: '唐诗宋词鉴赏'
          }])

        if (appreciationError) {
          console.error(`插入赏析失败:`, appreciationError)
        } else {
          console.log(`诗词 ${poemData.title} 的赏析插入成功`)
        }
      }
    }

    console.log('修复后的样本数据生成完成！')
    console.log(`共插入 ${authors.length} 位作者，${successCount} 首诗词`)

  } catch (error) {
    console.error('生成样本数据时发生错误:', error)
  }
}

// 运行脚本
console.log('开始生成修复后的诗词样本数据...')
generateSampleData().then(() => {
  console.log('修复后的诗词样本数据生成完成！')
}).catch(error => {
  console.error('生成数据时出错:', error)
})

export { generateSampleData }