// 扩展诗词数据导入脚本 - 添加更多经典诗词
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

// 获取当前文件路径
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 加载环境变量 - 从项目根目录加载
config({ path: join(__dirname, '..', '.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL!
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// 扩展作者数据
const additionalAuthors = [
  {
    name: '白居易',
    dynasty: '唐',
    introduction: '白居易（772年－846年），字乐天，号香山居士，唐代伟大的现实主义诗人，作品通俗易懂。',
    birth_year: 772,
    death_year: 846
  },
  {
    name: '李商隐',
    dynasty: '唐',
    introduction: '李商隐（约813年－约858年），字义山，号玉溪生，唐代著名诗人，以无题诗著称。',
    birth_year: 813,
    death_year: 858
  },
  {
    name: '杜牧',
    dynasty: '唐',
    introduction: '杜牧（803年－约852年），字牧之，号樊川居士，唐代诗人，与李商隐并称"小李杜"。',
    birth_year: 803,
    death_year: 852
  },
  {
    name: '孟浩然',
    dynasty: '唐',
    introduction: '孟浩然（689年－740年），唐代山水田园诗派代表诗人，与王维并称"王孟"。',
    birth_year: 689,
    death_year: 740
  },
  {
    name: '王之涣',
    dynasty: '唐',
    introduction: '王之涣（688年－742年），唐代边塞诗人，以《登鹳雀楼》等诗作闻名。',
    birth_year: 688,
    death_year: 742
  },
  {
    name: '柳宗元',
    dynasty: '唐',
    introduction: '柳宗元（773年－819年），字子厚，唐代文学家、哲学家，唐宋八大家之一。',
    birth_year: 773,
    death_year: 819
  },
  {
    name: '韩愈',
    dynasty: '唐',
    introduction: '韩愈（768年－824年），字退之，唐代文学家、哲学家，唐宋八大家之首。',
    birth_year: 768,
    death_year: 824
  },
  {
    name: '王安石',
    dynasty: '宋',
    introduction: '王安石（1021年－1086年），字介甫，号半山，北宋政治家、文学家，唐宋八大家之一。',
    birth_year: 1021,
    death_year: 1086
  },
  {
    name: '陆游',
    dynasty: '宋',
    introduction: '陆游（1125年－1210年），字务观，号放翁，南宋爱国诗人，作品数量极多。',
    birth_year: 1125,
    death_year: 1210
  },
  {
    name: '晏殊',
    dynasty: '宋',
    introduction: '晏殊（991年－1055年），字同叔，北宋著名词人，婉约词派代表。',
    birth_year: 991,
    death_year: 1055
  }
]

// 扩展诗词数据 - 新增30首经典诗词
const additionalPoems = [
  // 白居易作品
  {
    title: '赋得古原草送别',
    content: '离离原上草，一岁一枯荣。\n野火烧不尽，春风吹又生。\n远芳侵古道，晴翠接荒城。\n又送王孙去，萋萋满别情。',
    dynasty: '唐',
    author: '白居易',
    type: '诗',
    themes: ['送别', '自然'],
    appreciation: '以草原的生生不息比喻友情的永恒，语言朴实而意境深远。'
  },
  {
    title: '琵琶行',
    content: '浔阳江头夜送客，枫叶荻花秋瑟瑟。\n主人下马客在船，举酒欲饮无管弦。\n醉不成欢惨将别，别时茫茫江浸月。',
    dynasty: '唐',
    author: '白居易',
    type: '诗',
    themes: ['音乐', '人生'],
    appreciation: '长篇叙事诗，通过琵琶女的遭遇反映了社会现实，情感真挚动人。'
  },
  
  // 李商隐作品
  {
    title: '锦瑟',
    content: '锦瑟无端五十弦，一弦一柱思华年。\n庄生晓梦迷蝴蝶，望帝春心托杜鹃。\n沧海月明珠有泪，蓝田日暖玉生烟。\n此情可待成追忆，只是当时已惘然。',
    dynasty: '唐',
    author: '李商隐',
    type: '诗',
    themes: ['爱情', '回忆'],
    appreciation: '李商隐的代表作，语言华丽，意境朦胧，表达了深沉的思念之情。'
  },
  {
    title: '夜雨寄北',
    content: '君问归期未有期，巴山夜雨涨秋池。\n何当共剪西窗烛，却话巴山夜雨时。',
    dynasty: '唐',
    author: '李商隐',
    type: '诗',
    themes: ['思乡', '爱情'],
    appreciation: '通过夜雨场景表达对远方亲人的思念，语言含蓄优美。'
  },
  
  // 杜牧作品
  {
    title: '清明',
    content: '清明时节雨纷纷，路上行人欲断魂。\n借问酒家何处有？牧童遥指杏花村。',
    dynasty: '唐',
    author: '杜牧',
    type: '诗',
    themes: ['清明', '春天'],
    appreciation: '描绘清明时节的景象，语言清新自然，意境优美。'
  },
  {
    title: '江南春',
    content: '千里莺啼绿映红，水村山郭酒旗风。\n南朝四百八十寺，多少楼台烟雨中。',
    dynasty: '唐',
    author: '杜牧',
    type: '诗',
    themes: ['春天', '江南'],
    appreciation: '以宏大的视角描绘江南春色，画面感极强。'
  },
  
  // 孟浩然作品
  {
    title: '春晓',
    content: '春眠不觉晓，处处闻啼鸟。\n夜来风雨声，花落知多少。',
    dynasty: '唐',
    author: '孟浩然',
    type: '诗',
    themes: ['春天', '自然'],
    appreciation: '语言简洁明快，生动描绘了春日早晨的清新景象。'
  },
  {
    title: '过故人庄',
    content: '故人具鸡黍，邀我至田家。\n绿树村边合，青山郭外斜。\n开轩面场圃，把酒话桑麻。\n待到重阳日，还来就菊花。',
    dynasty: '唐',
    author: '孟浩然',
    type: '诗',
    themes: ['田园', '友情'],
    appreciation: '描绘田园生活的美好，表达了诗人对自然和友情的珍视。'
  },
  
  // 王之涣作品
  {
    title: '登鹳雀楼',
    content: '白日依山尽，黄河入海流。\n欲穷千里目，更上一层楼。',
    dynasty: '唐',
    author: '王之涣',
    type: '诗',
    themes: ['登高', '哲理'],
    appreciation: '通过登高望远表达不断进取的人生哲理，成为千古名句。'
  },
  
  // 柳宗元作品
  {
    title: '江雪',
    content: '千山鸟飞绝，万径人踪灭。\n孤舟蓑笠翁，独钓寒江雪。',
    dynasty: '唐',
    author: '柳宗元',
    type: '诗',
    themes: ['冬天', '孤独'],
    appreciation: '营造了寂静寒冷的意境，表现了诗人孤高自许的情怀。'
  },
  
  // 韩愈作品
  {
    title: '早春呈水部张十八员外',
    content: '天街小雨润如酥，草色遥看近却无。\n最是一年春好处，绝胜烟柳满皇都。',
    dynasty: '唐',
    author: '韩愈',
    type: '诗',
    themes: ['春天', '细腻'],
    appreciation: '细腻描绘早春景象，观察入微，语言清新。'
  },
  
  // 王安石作品
  {
    title: '泊船瓜洲',
    content: '京口瓜洲一水间，钟山只隔数重山。\n春风又绿江南岸，明月何时照我还？',
    dynasty: '宋',
    author: '王安石',
    type: '诗',
    themes: ['思乡', '春天'],
    appreciation: '表达了诗人对故乡的思念，"绿"字用得尤为精妙。'
  },
  {
    title: '梅花',
    content: '墙角数枝梅，凌寒独自开。\n遥知不是雪，为有暗香来。',
    dynasty: '宋',
    author: '王安石',
    type: '诗',
    themes: ['梅花', '高洁'],
    appreciation: '赞美梅花的高洁品格，语言简洁而意境深远。'
  },
  
  // 陆游作品
  {
    title: '示儿',
    content: '死去元知万事空，但悲不见九州同。\n王师北定中原日，家祭无忘告乃翁。',
    dynasty: '宋',
    author: '陆游',
    type: '诗',
    themes: ['爱国', '遗嘱'],
    appreciation: '表达了诗人至死不渝的爱国情怀，感人至深。'
  },
  {
    title: '钗头凤·红酥手',
    content: '红酥手，黄縢酒，满城春色宫墙柳。\n东风恶，欢情薄。一怀愁绪，几年离索。错、错、错。',
    dynasty: '宋',
    author: '陆游',
    type: '词',
    themes: ['爱情', '遗憾'],
    appreciation: '表达了诗人对逝去爱情的深深遗憾和思念。'
  },
  
  // 晏殊作品
  {
    title: '浣溪沙·一曲新词酒一杯',
    content: '一曲新词酒一杯，去年天气旧亭台。\n夕阳西下几时回？\n无可奈何花落去，似曾相识燕归来。\n小园香径独徘徊。',
    dynasty: '宋',
    author: '晏殊',
    type: '词',
    themes: ['时光', '感慨'],
    appreciation: '表达了对时光流逝的感慨，语言优美，意境深远。'
  },
  
  // 更多李白作品
  {
    title: '将进酒',
    content: '君不见黄河之水天上来，奔流到海不复回。\n君不见高堂明镜悲白发，朝如青丝暮成雪。\n人生得意须尽欢，莫使金樽空对月。',
    dynasty: '唐',
    author: '李白',
    type: '诗',
    themes: ['豪放', '人生'],
    appreciation: '李白豪放风格的代表作，表达了及时行乐的人生态度。'
  },
  {
    title: '月下独酌',
    content: '花间一壶酒，独酌无相亲。\n举杯邀明月，对影成三人。',
    dynasty: '唐',
    author: '李白',
    type: '诗',
    themes: ['孤独', '月亮'],
    appreciation: '通过奇特的想象化解孤独，展现了诗人的浪漫情怀。'
  },
  
  // 更多杜甫作品
  {
    title: '茅屋为秋风所破歌',
    content: '八月秋高风怒号，卷我屋上三重茅。\n茅飞渡江洒江郊，高者挂罥长林梢，下者飘转沉塘坳。',
    dynasty: '唐',
    author: '杜甫',
    type: '诗',
    themes: ['民生', '现实'],
    appreciation: '反映了战乱时期百姓的苦难生活，体现了诗人的忧国忧民。'
  },
  
  // 更多苏轼作品
  {
    title: '念奴娇·赤壁怀古',
    content: '大江东去，浪淘尽，千古风流人物。\n故垒西边，人道是，三国周郎赤壁。\n乱石穿空，惊涛拍岸，卷起千堆雪。',
    dynasty: '宋',
    author: '苏轼',
    type: '词',
    themes: ['怀古', '豪放'],
    appreciation: '苏轼豪放词的代表作，气势磅礴，意境开阔。'
  },
  
  // 更多李清照作品
  {
    title: '如梦令·常记溪亭日暮',
    content: '常记溪亭日暮，沉醉不知归路。\n兴尽晚回舟，误入藕花深处。\n争渡，争渡，惊起一滩鸥鹭。',
    dynasty: '宋',
    author: '李清照',
    type: '词',
    themes: ['回忆', '闲适'],
    appreciation: '描绘了少女时代的快乐生活，语言清新活泼。'
  },
  
  // 更多辛弃疾作品
  {
    title: '永遇乐·京口北固亭怀古',
    content: '千古江山，英雄无觅，孙仲谋处。\n舞榭歌台，风流总被，雨打风吹去。\n斜阳草树，寻常巷陌，人道寄奴曾住。',
    dynasty: '宋',
    author: '辛弃疾',
    type: '词',
    themes: ['怀古', '爱国'],
    appreciation: '表达了诗人对英雄人物的追忆和对国家命运的关切。'
  },
  
  // 王维更多作品
  {
    title: '山居秋暝',
    content: '空山新雨后，天气晚来秋。\n明月松间照，清泉石上流。\n竹喧归浣女，莲动下渔舟。\n随意春芳歇，王孙自可留。',
    dynasty: '唐',
    author: '王维',
    type: '诗',
    themes: ['山水', '隐居'],
    appreciation: '描绘了山居生活的宁静美好，体现了王维诗中有画的特色。'
  },
  {
    title: '使至塞上',
    content: '单车欲问边，属国过居延。\n征蓬出汉塞，归雁入胡天。\n大漠孤烟直，长河落日圆。\n萧关逢候骑，都护在燕然。',
    dynasty: '唐',
    author: '王维',
    type: '诗',
    themes: ['边塞', '壮丽'],
    appreciation: '描绘了边塞的壮丽景色，"大漠孤烟直，长河落日圆"成为千古名句。'
  }
]

async function addMorePoems() {
  console.log('开始添加更多诗词数据...')

  try {
    // 1. 获取现有作者映射
    console.log('获取现有作者数据...')
    const { data: existingAuthors, error: authorsError } = await supabase
      .from('authors')
      .select('id, name')
    
    if (authorsError) throw authorsError

    const authorMap = new Map()
    existingAuthors?.forEach(author => {
      authorMap.set(author.name, author.id)
    })

    // 2. 插入新作者
    console.log('插入新作者数据...')
    for (const authorData of additionalAuthors) {
      if (!authorMap.has(authorData.name)) {
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
      } else {
        console.log(`作者 ${authorData.name} 已存在，跳过插入`)
      }
    }

    // 3. 插入新诗词
    console.log('插入新诗词数据...')
    let successCount = 0
    
    for (const poemData of additionalPoems) {
      const authorId = authorMap.get(poemData.author)
      
      if (!authorId) {
        console.warn(`未找到作者 ${poemData.author}，跳过诗词 ${poemData.title}`)
        continue
      }

      // 检查诗词是否已存在
      const { data: existingPoem } = await supabase
        .from('poems')
        .select('id')
        .eq('title', poemData.title)
        .eq('author_id', authorId)
        .single()

      if (existingPoem) {
        console.log(`诗词 ${poemData.title} 已存在，跳过插入`)
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

      // 4. 插入赏析数据
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

    console.log('扩展诗词数据添加完成！')
    console.log(`共添加 ${successCount} 首新诗词`)

  } catch (error) {
    console.error('添加诗词数据时发生错误:', error)
  }
}

// 运行脚本
console.log('开始执行扩展诗词数据导入...')
addMorePoems().then(() => {
  console.log('扩展诗词数据导入完成！')
}).catch(error => {
  console.error('导入数据时出错:', error)
})

export { addMorePoems }