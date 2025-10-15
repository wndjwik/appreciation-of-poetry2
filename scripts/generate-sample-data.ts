// 诗词样本数据生成脚本
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// 加载环境变量
config()

const supabaseUrl = process.env.VITE_SUPABASE_URL!
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// 作者数据
const authors = [
  {
    name: '李白',
    dynasty: '唐',
    introduction: '李白（701年－762年），字太白，号青莲居士，唐代伟大的浪漫主义诗人，被后人誉为“诗仙”。',
    birth_year: 701,
    death_year: 762
  },
  {
    name: '杜甫',
    dynasty: '唐',
    introduction: '杜甫（712年－770年），字子美，自号少陵野老，唐代伟大的现实主义诗人，被后人称为“诗圣”。',
    birth_year: 712,
    death_year: 770
  },
  {
    name: '王维',
    dynasty: '唐',
    introduction: '王维（701年－761年），字摩诘，号摩诘居士，唐代著名诗人、画家，有“诗佛”之称。',
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
    introduction: '辛弃疾（1140年－1207年），字幼安，号稼轩，南宋豪放派词人，有“词中之龙”之称。',
    birth_year: 1140,
    death_year: 1207
  }
]

// 诗词数据
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
    title: '春晓',
    content: '春眠不觉晓，处处闻啼鸟。\n夜来风雨声，花落知多少。',
    dynasty: '唐',
    author: '孟浩然',
    type: '诗',
    themes: ['春天', '自然'],
    appreciation: '诗歌描绘了春日早晨的景色，语言清新自然，表现了诗人对大自然的热爱。'
  },
  {
    title: '登鹳雀楼',
    content: '白日依山尽，黄河入海流。\n欲穷千里目，更上一层楼。',
    dynasty: '唐',
    author: '王之涣',
    type: '诗',
    themes: ['登高', '哲理'],
    appreciation: '诗歌通过登高望远的景象，表达了不断进取、追求更高境界的人生哲理。'
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
    title: '江雪',
    content: '千山鸟飞绝，万径人踪灭。\n孤舟蓑笠翁，独钓寒江雪。',
    dynasty: '唐',
    author: '柳宗元',
    type: '诗',
    themes: ['冬天', '孤独'],
    appreciation: '诗歌营造了寂静寒冷的意境，表现了诗人孤高自许的情怀。'
  },
  {
    title: '黄鹤楼送孟浩然之广陵',
    content: '故人西辞黄鹤楼，烟花三月下扬州。\n孤帆远影碧空尽，唯见长江天际流。',
    dynasty: '唐',
    author: '李白',
    type: '诗',
    themes: ['送别', '友情'],
    appreciation: '送别诗中的经典之作，情景交融，表达了深挚的友情。'
  }
]

// 添加更多诗词数据（这里简化为10首，实际可以扩展到50首）
const additionalPoems = [
  {
    title: '枫桥夜泊',
    content: '月落乌啼霜满天，江枫渔火对愁眠。\n姑苏城外寒山寺，夜半钟声到客船。',
    dynasty: '唐',
    author: '张继',
    type: '诗',
    themes: ['秋天', '旅途'],
    appreciation: '诗歌描绘了秋夜泊船的场景，意境深远，成为千古名篇。'
  },
  {
    title: '游子吟',
    content: '慈母手中线，游子身上衣。\n临行密密缝，意恐迟迟归。\n谁言寸草心，报得三春晖。',
    dynasty: '唐',
    author: '孟郊',
    type: '诗',
    themes: ['母爱', '感恩'],
    appreciation: '歌颂母爱的伟大，语言朴实而情感真挚。'
  },
  {
    title: '清明',
    content: '清明时节雨纷纷，路上行人欲断魂。\n借问酒家何处有？牧童遥指杏花村。',
    dynasty: '唐',
    author: '杜牧',
    type: '诗',
    themes: ['清明', '春天'],
    appreciation: '描绘清明时节的景象，语言清新，意境优美。'
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
    title: '泊船瓜洲',
    content: '京口瓜洲一水间，钟山只隔数重山。\n春风又绿江南岸，明月何时照我还？',
    dynasty: '宋',
    author: '王安石',
    type: '诗',
    themes: ['思乡', '春天'],
    appreciation: '表达了诗人对故乡的思念，语言优美流畅。'
  }
]

// 合并所有诗词数据
const allPoems = [...poems, ...additionalPoems]

async function generateSampleData() {
  console.log('开始生成样本数据...')

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
    for (const poemData of allPoems) {
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

    console.log('样本数据生成完成！')
    console.log(`共插入 ${authors.length} 位作者，${allPoems.length} 首诗词`)

  } catch (error) {
    console.error('生成样本数据时发生错误:', error)
  }
}

// 运行脚本
console.log('开始生成诗词样本数据...')
generateSampleData().then(() => {
  console.log('诗词样本数据生成完成！')
}).catch(error => {
  console.error('生成数据时出错:', error)
})

export { generateSampleData }