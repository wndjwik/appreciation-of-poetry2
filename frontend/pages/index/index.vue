<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->

<template>
  <div class="min-h-screen flex flex-col">
    <!-- 导航栏 -->
    <header class="bg-gray-900 text-white py-4 px-8 fixed w-full z-50 shadow-md">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center space-x-12">
          <h1 class="text-2xl font-logo">logo</h1>
          <nav class="flex space-x-8">
            <a href="#" class="nav-link transition duration-200">首页</a>
            <a href="#" class="nav-link transition duration-200">诗词分类</a>
            <a href="#" class="nav-link transition duration-200">诗人介绍</a>
            <a href="#" class="nav-link transition duration-200">诗词鉴赏</a>
            <a href="#" class="nav-link transition duration-200">个人中心</a>
          </nav>
        </div>
        <div class="flex items-center space-x-4">
          <div class="relative w-64">
            <input 
              type="text" 
              v-model="searchQuery"
              placeholder="搜索诗词、诗人..." 
              class="w-full py-2 px-4 pl-10 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary border-none"
            >
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
          <select 
            v-model="selectedDynasty"
            @change="onDynastyChange"
            class="px-3 py-2 rounded bg-gray-800 text-white border-none focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">选择朝代</option>
            <option v-for="dynasty in dynasties" :key="dynasty" :value="dynasty">{{ dynasty }}</option>
          </select>
          <select 
            v-model="selectedSubject"
            @change="onSubjectChange"
            :disabled="!selectedDynasty"
            class="px-3 py-2 rounded bg-gray-800 text-white border-none focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">选择题材</option>
            <option v-for="subject in subjects" :key="subject" :value="subject">{{ subject }}</option>
          </select>
          <button 
            @click="searchPoems"
            :disabled="!selectedDynasty || !selectedSubject || isLoading"
            class="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition disabled:opacity-50"
          >
            {{ isLoading ? '搜索中...' : '搜索' }}
          </button>
        </div>
      </div>
    </header>

    <!-- 主体内容 -->
    <main class="pt-20 flex-grow">
      <div class="max-w-7xl mx-auto px-8 py-10">
        <div class="flex gap-8">
          <!-- 左侧主要内容 -->
          <div class="flex-grow">
            <!-- 轮播图区域 -->
            <section class="mb-16 relative overflow-hidden rounded-2xl h-96 bg-gradient-to-r from-blue-500 to-purple-600">
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center text-white px-16">
                  <h2 class="text-4xl font-bold mb-4">《静夜思》赏析</h2>
                  <p class="text-xl max-w-2xl mx-auto">床前明月光，疑是地上霜。举头望明月，低头思故乡。</p>
                </div>
              </div>
              <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <div class="carousel-indicator w-3 h-3 bg-white rounded-full"></div>
                <div class="carousel-indicator w-6 h-3 bg-white rounded-full active"></div>
                <div class="carousel-indicator w-3 h-3 bg-white rounded-full"></div>
              </div>
            </section>

            <!-- 热门诗词推荐 -->
            <section class="mb-16">
              <div class="flex items-center justify-between mb-8">
                <h2 class="text-2xl font-bold">热门诗词推荐</h2>
                <a href="#" class="text-primary hover:underline">查看全部</a>
              </div>
              <div class="grid grid-cols-3 gap-6">
                <!-- 诗词卡片 1 -->
                <div class="bg-white rounded-xl shadow-sm p-6 card-hover transition duration-300 cursor-pointer">
                  <h3 class="text-xl font-semibold mb-2">春晓</h3>
                  <p class="text-gray-600 mb-4">孟浩然 · 唐代</p>
                  <p class="text-gray-700 line-clamp-2">春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。</p>
                </div>
                <!-- 诗词卡片 2 -->
                <div class="bg-white rounded-xl shadow-sm p-6 card-hover transition duration-300 cursor-pointer">
                  <h3 class="text-xl font-semibold mb-2">水调歌头</h3>
                  <p class="text-gray-600 mb-4">苏轼 · 宋代</p>
                  <p class="text-gray-700 line-clamp-2">明月几时有？把酒问青天。不知天上宫阙，今夕是何年。</p>
                </div>
                <!-- 诗词卡片 3 -->
                <div class="bg-white rounded-xl shadow-sm p-6 card-hover transition duration-300 cursor-pointer">
                  <h3 class="text-xl font-semibold mb-2">登鹳雀楼</h3>
                  <p class="text-gray-600 mb-4">王之涣 · 唐代</p>
                  <p class="text-gray-700 line-clamp-2">白日依山尽，黄河入海流。欲穷千里目，更上一层楼。</p>
                </div>
                <!-- 诗词卡片 4 -->
                <div class="bg-white rounded-xl shadow-sm p-6 card-hover transition duration-300 cursor-pointer">
                  <h3 class="text-xl font-semibold mb-2">念奴娇·赤壁怀古</h3>
                  <p class="text-gray-600 mb-4">苏轼 · 宋代</p>
                  <p class="text-gray-700 line-clamp-2">大江东去，浪淘尽，千古风流人物。故垒西边，人道是，三国周郎赤壁。</p>
                </div>
                <!-- 诗词卡片 5 -->
                <div class="bg-white rounded-xl shadow-sm p-6 card-hover transition duration-300 cursor-pointer">
                  <h3 class="text-xl font-semibold mb-2">将进酒</h3>
                  <p class="text-gray-600 mb-4">李白 · 唐代</p>
                  <p class="text-gray-700 line-clamp-2">君不见黄河之水天上来，奔流到海不复回。君不见高堂明镜悲白发，朝如青丝暮成雪。</p>
                </div>
                <!-- 诗词卡片 6 -->
                <div class="bg-white rounded-xl shadow-sm p-6 card-hover transition duration-300 cursor-pointer">
                  <h3 class="text-xl font-semibold mb-2">虞美人</h3>
                  <p class="text-gray-600 mb-4">李煜 · 五代十国</p>
                  <p class="text-gray-700 line-clamp-2">春花秋月何时了？往事知多少。小楼昨夜又东风，故国不堪回首月明中。</p>
                </div>
              </div>
            </section>

            <!-- 诗词分类导航 -->
            <section class="mb-16">
              <h2 class="text-2xl font-bold mb-8">诗词分类</h2>
              <div class="grid grid-cols-6 gap-6">
                <!-- 分类项 1 -->
                <a href="#" class="flex flex-col items-center text-center group">
                  <div class="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:bg-primary transition duration-300 overflow-hidden">
                    <img 
                      src="https://ai-public.mastergo.com/ai/img_res/7a71393e0379ad9260be3b1122ab5564.jpg" 
                      alt="唐诗" 
                      class="w-full h-full object-cover rounded-full object-top"
                    >
                  </div>
                  <span class="font-medium">唐诗</span>
                </a>
                <!-- 分类项 2 -->
                <a href="#" class="flex flex-col items-center text-center group">
                  <div class="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:bg-primary transition duration-300 overflow-hidden">
                    <img 
                      src="https://ai-public.mastergo.com/ai/img_res/34798a3548c0346dfadf17c32ad537e5.jpg" 
                      alt="宋词" 
                      class="w-full h-full object-cover rounded-full object-top"
                    >
                  </div>
                  <span class="font-medium">宋词</span>
                </a>
                <!-- 分类项 3 -->
                <a href="#" class="flex flex-col items-center text-center group">
                  <div class="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:bg-primary transition duration-300 overflow-hidden">
                    <img 
                      src="https://ai-public.mastergo.com/ai/img_res/59d23ca03d5e851e35f55baa2336f420.jpg" 
                      alt="元曲" 
                      class="w-full h-full object-cover rounded-full object-top"
                    >
                  </div>
                  <span class="font-medium">元曲</span>
                </a>
                <!-- 分类项 4 -->
                <a href="#" class="flex flex-col items-center text-center group">
                  <div class="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:bg-primary transition duration-300 overflow-hidden">
                    <img 
                      src="https://ai-public.mastergo.com/ai/img_res/ffaa186e3c149bc63ba63626f831290e.jpg" 
                      alt="汉赋" 
                      class="w-full h-full object-cover rounded-full object-top"
                    >
                  </div>
                  <span class="font-medium">汉赋</span>
                </a>
                <!-- 分类项 5 -->
                <a href="#" class="flex flex-col items-center text-center group">
                  <div class="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:bg-primary transition duration-300 overflow-hidden">
                    <img 
                      src="https://ai-public.mastergo.com/ai/img_res/33e146fc4a2b16d08a8bf32c56987cdf.jpg" 
                      alt="清诗" 
                      class="w-full h-full object-cover rounded-full object-top"
                    >
                  </div>
                  <span class="font-medium">清诗</span>
                </a>
                <!-- 分类项 6 -->
                <a href="#" class="flex flex-col items-center text-center group">
                  <div class="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:bg-primary transition duration-300 overflow-hidden">
                    <img 
                      src="https://ai-public.mastergo.com/ai/img_res/1fb17be18545dd2c6773667e38b53231.jpg" 
                      alt="现代诗" 
                      class="w-full h-full object-cover rounded-full object-top"
                    >
                  </div>
                  <span class="font-medium">现代诗</span>
                </a>
              </div>
            </section>

            <!-- 搜索结果区域 -->
            <section v-if="poems.length > 0" class="mb-16">
              <h2 class="text-2xl font-bold mb-8">搜索结果 ({{ poems.length }} 首)</h2>
              <div class="grid grid-cols-3 gap-6">
                <div 
                  v-for="(poem, index) in poems" 
                  :key="index"
                  @click="viewPoemDetail(poem)"
                  class="bg-white rounded-xl shadow-sm p-6 card-hover transition duration-300 cursor-pointer"
                >
                  <h3 class="text-xl font-semibold mb-2">{{ poem.title }}</h3>
                  <p class="text-gray-600 mb-4">{{ poem.author }} · {{ poem.dynasty }}</p>
                  <p class="text-gray-700 line-clamp-2">{{ poem.content }}</p>
                </div>
              </div>
            </section>

            <!-- 最新鉴赏文章 -->
            <section>
              <h2 class="text-2xl font-bold mb-8">最新鉴赏文章</h2>
              <div class="space-y-6">
                <!-- 文章 1 -->
                <a href="#" class="block article-card">
                  <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition duration-300">
                    <div class="flex justify-between items-start">
                      <h3 class="text-xl font-semibold mb-2">《静夜思》中的乡愁意象分析</h3>
                      <span class="text-sm text-gray-500 whitespace-nowrap">2023-11-15</span>
                    </div>
                    <p class="text-gray-600 mb-3">李白 · 唐代</p>
                    <p class="text-gray-700">本文通过对《静夜思》中"明月"与"思故乡"意象的深入解析，探讨诗人如何通过简洁的语言表达深切的思乡之情...</p>
                    <div class="flex items-center mt-4 text-sm text-gray-500">
                      <span class="mr-4"><i class="far fa-user mr-1"></i> 张文华</span>
                      <span><i class="far fa-eye mr-1"></i> 阅读量 1.2w</span>
                    </div>
                  </div>
                </a>
                <!-- 文章 2 -->
                <a href="#" class="block article-card">
                  <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition duration-300">
                    <div class="flex justify-between items-start">
                      <h3 class="text-xl font-semibold mb-2">苏轼词作中的豁达人生观</h3>
                      <span class="text-sm text-gray-500 whitespace-nowrap">2023-11-10</span>
                    </div>
                    <p class="text-gray-600 mb-3">苏轼 · 宋代</p>
                    <p class="text-gray-700">从《水调歌头》到《定风波》，苏轼以其独特的人生哲学诠释了宋代文人的精神风貌，展现出超脱世俗的豁达胸怀...</p>
                    <div class="flex items-center mt-4 text-sm text-gray-500">
                      <span class="mr-4"><i class="far fa-user mr-1"></i> 李雅婷</span>
                      <span><i class="far fa-eye mr-1"></i> 阅读量 9.8k</span>
                    </div>
                  </div>
                </a>
                <!-- 文章 3 -->
                <a href="#" class="block article-card">
                  <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition duration-300">
                    <div class="flex justify-between items-start">
                      <h3 class="text-xl font-semibold mb-2">杜甫"沉郁顿挫"诗风的艺术特色</h3>
                      <span class="text-sm text-gray-500 whitespace-nowrap">2023-11-05</span>
                    </div>
                    <p class="text-gray-600 mb-3">杜甫 · 唐代</p>
                    <p class="text-gray-700">通过对《春望》《茅屋为秋风所破歌》等代表作品的分析，揭示杜甫诗歌中深沉忧患意识与艺术表现力的完美结合...</p>
                    <div class="flex items-center mt-4 text-sm text-gray-500">
                      <span class="mr-4"><i class="far fa-user mr-1"></i> 王建国</span>
                      <span><i class="far fa-eye mr-1"></i> 阅读量 7.5k</span>
                    </div>
                  </div>
                </a>
              </div>
            </section>
          </div>

          <!-- 右侧排行榜 -->
          <aside class="w-80">
            <div class="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 class="text-xl font-bold mb-6 pb-3 border-b">本周热门诗词 Top10</h2>
              <div class="space-y-5">
                <!-- 排名 1 -->
                <div class="ranking-item flex items-center">
                  <span class="rank-number text-2xl font-bold w-8">1</span>
                  <div class="ml-3">
                    <h3 class="font-semibold">静夜思</h3>
                    <p class="text-sm text-gray-600">李白 · 唐代</p>
                  </div>
                </div>
                <!-- 排名 2 -->
                <div class="ranking-item flex items-center">
                  <span class="rank-number text-2xl font-bold w-8">2</span>
                  <div class="ml-3">
                    <h3 class="font-semibold">春晓</h3>
                    <p class="text-sm text-gray-600">孟浩然 · 唐代</p>
                  </div>
                </div>
                <!-- 排名 3 -->
                <div class="ranking-item flex items-center">
                  <span class="rank-number text-2xl font-bold w-8">3</span>
                  <div class="ml-3">
                    <h3 class="font-semibold">水调歌头</h3>
                    <p class="text-sm text-gray-600">苏轼 · 宋代</p>
                  </div>
                </div>
                <!-- 排名 4 -->
                <div class="ranking-item flex items-center">
                  <span class="rank-number text-lg font-bold w-8">4</span>
                  <div class="ml-3">
                    <h3 class="font-semibold">登鹳雀楼</h3>
                    <p class="text-sm text-gray-600">王之涣 · 唐代</p>
                  </div>
                </div>
                <!-- 排名 5 -->
                <div class="ranking-item flex items-center">
                  <span class="rank-number text-lg font-bold w-8">5</span>
                  <div class="ml-3">
                    <h3 class="font-semibold">望庐山瀑布</h3>
                    <p class="text-sm text-gray-600">李白 · 唐代</p>
                  </div>
                </div>
                <!-- 排名 6 -->
                <div class="ranking-item flex items-center">
                  <span class="rank-number text-lg font-bold w-8">6</span>
                  <div class="ml-3">
                    <h3 class="font-semibold">江雪</h3>
                    <p class="text-sm text-gray-600">柳宗元 · 唐代</p>
                  </div>
                </div>
                <!-- 排名 7 -->
                <div class="ranking-item flex items-center">
                  <span class="rank-number text-lg font-bold w-8">7</span>
                  <div class="ml-3">
                    <h3 class="font-semibold">黄鹤楼送孟浩然之广陵</h3>
                    <p class="text-sm text-gray-600">李白 · 唐代</p>
                  </div>
                </div>
                <!-- 排名 8 -->
                <div class="ranking-item flex items-center">
                  <span class="rank-number text-lg font-bold w-8">8</span>
                  <div class="ml-3">
                    <h3 class="font-semibold">早发白帝城</h3>
                    <p class="text-sm text-gray-600">李白 · 唐代</p>
                  </div>
                </div>
                <!-- 排名 9 -->
                <div class="ranking-item flex items-center">
                  <span class="rank-number text-lg font-bold w-8">9</span>
                  <div class="ml-3">
                    <h3 class="font-semibold">枫桥夜泊</h3>
                    <p class="text-sm text-gray-600">张继 · 唐代</p>
                  </div>
                </div>
                <!-- 排名 10 -->
                <div class="ranking-item flex items-center">
                  <span class="rank-number text-lg font-bold w-8">10</span>
                  <div class="ml-3">
                    <h3 class="font-semibold">赋得古原草送别</h3>
                    <p class="text-sm text-gray-600">白居易 · 唐代</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>

    <!-- 底部信息区 -->
    <footer class="bg-gray-800 text-white pt-12 pb-8">
      <div class="max-w-7xl mx-auto px-8">
        <div class="grid grid-cols-4 gap-8 mb-8">
          <div>
            <h3 class="text-lg font-semibold mb-4">关于我们</h3>
            <ul class="space-y-2 text-gray-300">
              <li><a href="#" class="hover:text-white transition">网站简介</a></li>
              <li><a href="#" class="hover:text-white transition">团队介绍</a></li>
              <li><a href="#" class="hover:text-white transition">加入我们</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">服务支持</h3>
            <ul class="space-y-2 text-gray-300">
              <li><a href="#" class="hover:text-white transition">帮助中心</a></li>
              <li><a href="#" class="hover:text-white transition">意见反馈</a></li>
              <li><a href="#" class="hover:text-white transition">广告服务</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">联系我们</h3>
            <ul class="space-y-2 text-gray-300">
              <li class="flex items-start">
                <i class="fas fa-envelope mt-1 mr-2 text-sm"></i>
                <span>contact@poetry.com</span>
              </li>
              <li class="flex items-start">
                <i class="fas fa-phone-alt mt-1 mr-2 text-sm"></i>
                <span>400-123-4567</span>
              </li>
              <li class="flex items-start">
                <i class="fas fa-map-marker-alt mt-1 mr-2 text-sm"></i>
                <span>北京市朝阳区文学路 123 号</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">关注我们</h3>
            <div class="flex space-x-4 mb-4">
              <a href="#" class="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-primary transition">
                <i class="fab fa-weibo"></i>
              </a>
              <a href="#" class="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-primary transition">
                <i class="fab fa-weixin"></i>
              </a>
              <a href="#" class="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-primary transition">
                <i class="fab fa-twitter"></i>
              </a>
            </div>
            <p class="text-gray-400 text-sm">扫码关注公众号</p>
          </div>
        </div>
        <div class="pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>© 2023 诗词鉴赏网. All rights reserved. | 京ICP备12345678号</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

// 响应式数据
const poems = ref([])
const isLoading = ref(false)
const searchQuery = ref('')

// 朝代和题材数据
const dynasties = ref(['唐', '宋', '元', '明', '清'])
const subjects = ref([])
const selectedDynasty = ref('')
const selectedSubject = ref('')

// 热门诗词数据
const hotPoems = ref([
  {
    title: '春晓',
    author: '孟浩然',
    dynasty: '唐代',
    content: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。'
  },
  {
    title: '水调歌头',
    author: '苏轼',
    dynasty: '宋代',
    content: '明月几时有？把酒问青天。不知天上宫阙，今夕是何年。'
  },
  {
    title: '登鹳雀楼',
    author: '王之涣',
    dynasty: '唐代',
    content: '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。'
  },
  {
    title: '念奴娇·赤壁怀古',
    author: '苏轼',
    dynasty: '宋代',
    content: '大江东去，浪淘尽，千古风流人物。故垒西边，人道是，三国周郎赤壁。'
  },
  {
    title: '将进酒',
    author: '李白',
    dynasty: '唐代',
    content: '君不见黄河之水天上来，奔流到海不复回。君不见高堂明镜悲白发，朝如青丝暮成雪。'
  },
  {
    title: '虞美人',
    author: '李煜',
    dynasty: '五代十国',
    content: '春花秋月何时了？往事知多少。小楼昨夜又东风，故国不堪回首月明中。'
  }
])

// 根据朝代更新题材选项
const updateSubjects = (dynasty: string) => {
  const subjectsMap = {
    '唐': ['边塞', '田园', '送别', '咏物'],
    '宋': ['田园', '送别', '咏物', '抒情'],
    '元': ['抒情', '咏物', '山水'],
    '明': ['抒情', '咏物', '山水'],
    '清': ['抒情', '咏物', '山水']
  }
  subjects.value = subjectsMap[dynasty] || []
}

// 搜索诗词
const searchPoems = async () => {
  if (!selectedDynasty.value || !selectedSubject.value) {
    alert('请选择朝代和题材')
    return
  }
  
  isLoading.value = true
  
  try {
    const response = await fetch('http://localhost:8084/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dynasty: selectedDynasty.value,
        subject: selectedSubject.value
      })
    })
    
    const data = await response.json()
    
    if (data.code === 200) {
      poems.value = data.data.poems
    } else {
      alert('搜索失败：' + data.message)
    }
  } catch (error) {
    console.error('搜索错误:', error)
    alert('网络请求失败，请检查后端服务')
  } finally {
    isLoading.value = false
  }
}

// 查看诗词详情
const viewPoemDetail = (poem: any) => {
  const params = new URLSearchParams({
    title: poem.title,
    author: poem.author,
    dynasty: poem.dynasty,
    content: poem.content,
    annotation: poem.annotation || ''
  })
  window.open(`/pages/detail/detail?${params.toString()}`, '_blank')
}

// 朝代选择变化
const onDynastyChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  selectedDynasty.value = target.value
  updateSubjects(target.value)
  selectedSubject.value = ''
}

// 题材选择变化
const onSubjectChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  selectedSubject.value = target.value
}

// 测试后端连接
const testBackend = async () => {
  try {
    const response = await fetch('http://localhost:8084/')
    const data = await response.json()
    console.log('后端连接正常:', data)
  } catch (error) {
    console.error('后端连接失败:', error)
  }
}

// 页面加载时测试连接
onMounted(() => {
  testBackend()
})
</script>

<style scoped>
body {
  font-family: 'Arial', sans-serif;
  background-color: #f9fafb;
  color: #1f2937;
}
.font-logo {
  font-family: 'Pacifico', serif;
}
.nav-link:hover {
  color: #10B981;
}
.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}
.carousel-indicator.active {
  background-color: #10B981;
  width: 24px;
}
.article-card:hover h3 {
  color: #10B981;
}
.ranking-item:nth-child(1) .rank-number { color: #EF4444; }
.ranking-item:nth-child(2) .rank-number { color: #F59E0B; }
.ranking-item:nth-child(3) .rank-number { color: #10B981; }
</style>

