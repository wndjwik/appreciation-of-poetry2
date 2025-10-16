import { supabase } from '../lib/supabase'
import { ClassicalPoemFilters, ClassicalPoemsResponse, CategoryStats, AuthorFilters, AuthorsResponse, AuthorStats } from '../types/database'

// 简化类型定义，避免导入问题
export type Poem = {
  id: string
  title: string
  content: string
  dynasty: string
  type: string
  themes: string[]
  created_at: string
  updated_at: string
  author_id: string
  authors: Author
  appreciations: Appreciation[]
}

export type Author = {
  id: string
  name: string
  dynasty: string
  introduction: string
  birth_year: number
  death_year: number
  created_at: string
  poems?: Poem[]
}

export type Appreciation = {
  id: string
  poem_id: string
  content: string
  source: string
  created_at: string
}

export type SearchResult = {
  id: string
  title: string
  content: string
  dynasty: string
  author_name: string
  type: string
  match_score: number
}

export interface SearchParams {
  query: string
  dynasty?: string
  type?: string
  page?: number
  limit?: number
}

export interface SearchResponse {
  poems: SearchResult[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export class PoemService {
  // 搜索诗词
  static async searchPoems(params: SearchParams): Promise<SearchResponse> {
    const { query, dynasty, type, page = 1, limit = 10 } = params
    const offset = (page - 1) * limit

    try {
      console.log('开始搜索:', { query, dynasty, type, page, limit })

      // 第一步：如果查询词不为空，先搜索作者表
      let authorIds: string[] = []
      if (query) {
        try {
          const { data: authors, error: authorError } = await supabase
            .from('authors')
            .select('id')
            .ilike('name', `%${query}%`)
          
          if (!authorError && authors) {
            authorIds = authors.map(author => author.id)
            console.log('找到匹配的作者ID:', authorIds)
          }
        } catch (err) {
          console.warn('搜索作者表失败:', err)
        }
      }

      // 第二步：构建诗词搜索查询
      let queryBuilder = supabase
        .from('poems')
        .select(`
          id,
          title,
          content,
          dynasty,
          type,
          author_id,
          authors(name)
        `)

      // 添加搜索条件
      if (query) {
        // 使用 DISTINCT ON 或添加去重逻辑来避免重复
        if (authorIds.length > 0) {
          // 使用 OR 条件搜索，但添加去重处理
          queryBuilder = queryBuilder.or(`title.ilike.%${query}%,content.ilike.%${query}%,author_id.in.(${authorIds.join(',')})`)
        } else {
          // 如果没有匹配的作者，只搜索诗词内容
          queryBuilder = queryBuilder.or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        }
      }

      if (dynasty) {
        queryBuilder = queryBuilder.eq('dynasty', dynasty)
      }

      if (type) {
        queryBuilder = queryBuilder.eq('type', type)
      }

      // 获取总数（现在使用去重后的数量，所以不需要count）
      const { error: countError } = await queryBuilder
      if (countError) {
        console.error('获取总数失败:', countError)
        throw new Error(`数据库查询错误: ${countError.message}`)
      }

      // 获取分页数据
      const { data, error } = await queryBuilder
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('获取数据失败:', error)
        throw new Error(`数据库查询错误: ${error.message}`)
      }

      console.log('搜索成功，找到结果数量:', data?.length || 0)

      // 处理搜索结果
      const poems = await Promise.all((data || []).map(async (item) => {
        let authorName = '未知作者'
        
        // 如果有关联的作者信息，使用它
        if ((item as any).authors?.name) {
          authorName = (item as any).authors.name
        } else if (item.author_id) {
          // 如果没有关联信息，单独查询作者
          try {
            const author = await this.getAuthorById(item.author_id)
            authorName = author?.name || '未知作者'
          } catch (err) {
            console.warn('获取作者信息失败:', err)
          }
        }

        return {
          id: item.id,
          title: item.title,
          content: item.content,
          dynasty: item.dynasty,
          author_name: authorName,
          type: item.type,
          match_score: this.calculateMatchScore(item, query)
        }
      }))

      // 去重处理：根据诗词ID去除重复项
      const uniquePoems = poems.filter((poem, index, self) => 
        index === self.findIndex(p => p.id === poem.id)
      )
      
      console.log('去重后结果数量:', uniquePoems.length, '去重前数量:', poems.length)

      return {
        poems: uniquePoems,
        total: uniquePoems.length,
        page,
        limit,
        totalPages: Math.ceil(uniquePoems.length / limit)
      }

    } catch (error) {
      console.error('搜索诗词失败:', error)
      // 提供更友好的错误信息
      if (error instanceof Error) {
        throw new Error(`搜索失败: ${error.message}`)
      }
      throw new Error('搜索失败，请检查网络连接或稍后重试')
    }
  }

  // 获取诗词详情
  static async getPoemById(id: string): Promise<Poem | null> {
    try {
      const { data, error } = await supabase
        .from('poems')
        .select(`
          *,
          authors (*),
          appreciations (*)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data

    } catch (error) {
      console.error('获取诗词详情失败:', error)
      return null
    }
  }

  // 获取作者详情
  static async getAuthorById(id: string): Promise<Author | null> {
    try {
      const { data, error } = await supabase
        .from('authors')
        .select(`
          *,
          poems (*)
        `)
        .eq('id', id)
        .single()

      if (error) {
        console.error('获取作者详情失败:', error)
        return null
      }
      return data

    } catch (error) {
      console.error('获取作者详情失败:', error)
      return null
    }
  }

  // 获取热门诗词
  static async getPopularPoems(limit: number = 10): Promise<Poem[]> {
    try {
      const { data, error } = await supabase
        .from('poems')
        .select(`
          *,
          authors (*),
          appreciations (*)
        `)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []

    } catch (error) {
      console.error('获取热门诗词失败:', error)
      return []
    }
  }

  // 获取朝代列表
  static async getDynasties(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('poems')
        .select('dynasty')
        .order('dynasty')

      if (error) throw error

      const dynasties = [...new Set((data || []).map(item => item.dynasty))]
      return dynasties

    } catch (error) {
      console.error('获取朝代列表失败:', error)
      return []
    }
  }

  // 获取诗词类型列表
  static async getPoemTypes(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('poems')
        .select('type')
        .order('type')

      if (error) throw error

      const types = [...new Set((data || []).map(item => item.type))]
      return types

    } catch (error) {
      console.error('获取诗词类型失败:', error)
      return []
    }
  }

  // 使用全文搜索函数
  static async fullTextSearch(query: string, limit: number = 20): Promise<SearchResult[]> {
    try {
      const { data, error } = await supabase
        .rpc('search_poems', { search_term: query })
        .limit(limit)

      if (error) throw error
      return data || []

    } catch (error) {
      console.error('全文搜索失败:', error)
      return []
    }
  }

  // 获取相关诗词推荐
  static async getRelatedPoems(poemId: string, limit: number = 5): Promise<Poem[]> {
    try {
      const { data, error } = await supabase
        .rpc('get_related_poems', { 
          poem_id: poemId, 
          limit_count: limit 
        })

      if (error) throw error

      // 获取完整的诗词信息
      const poemIds = (data || []).map((item: any) => item.id)
      if (poemIds.length === 0) return []

      const { data: poems, error: poemsError } = await supabase
        .from('poems')
        .select(`
          *,
          authors (*),
          appreciations (*)
        `)
        .in('id', poemIds)

      if (poemsError) throw poemsError
      return poems || []

    } catch (error) {
      console.error('获取相关诗词失败:', error)
      return []
    }
  }

  // 获取经典诗词列表
  static async getClassicalPoems(filters: ClassicalPoemFilters = {}): Promise<ClassicalPoemsResponse> {
    const { 
      dynasty, 
      genre, 
      sortBy = 'popular', 
      page = 1, 
      pageSize = 12,
      search 
    } = filters

    const offset = (page - 1) * pageSize

    try {
      let queryBuilder = supabase
        .from('poems')
        .select(`
          *,
          authors (*),
          appreciations (*)
        `, { count: 'exact' })

      // 应用筛选条件
      if (dynasty) {
        queryBuilder = queryBuilder.eq('dynasty', dynasty)
      }

      if (genre) {
        queryBuilder = queryBuilder.contains('themes', [genre])
      }

      if (search) {
        queryBuilder = queryBuilder.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
      }

      // 应用排序
      switch (sortBy) {
        case 'time':
          queryBuilder = queryBuilder.order('created_at', { ascending: false })
          break
        case 'length':
          queryBuilder = queryBuilder.order('content', { ascending: true })
          break
        case 'popular':
        default:
          queryBuilder = queryBuilder.order('created_at', { ascending: false })
          break
      }

      // 获取总数和数据
      const { data, count, error } = await queryBuilder
        .range(offset, offset + pageSize - 1)

      if (error) {
        console.error('获取经典诗词失败:', error)
        throw new Error(`数据库查询错误: ${error.message}`)
      }

      return {
        poems: data || [],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
        filters
      }

    } catch (error) {
      console.error('获取经典诗词失败:', error)
      throw new Error('获取经典诗词失败，请稍后重试')
    }
  }

  // 获取分类统计信息
  static async getCategoryStats(): Promise<CategoryStats> {
    try {
      // 获取朝代统计
      const { data: dynastyData, error: dynastyError } = await supabase
        .from('poems')
        .select('dynasty')

      if (dynastyError) throw dynastyError

      const dynastyStats: { [key: string]: number } = {}
      dynastyData?.forEach(item => {
        dynastyStats[item.dynasty] = (dynastyStats[item.dynasty] || 0) + 1
      })

      // 获取流派统计（简化版，使用第一个主题作为流派）
      const { data: themeData, error: themeError } = await supabase
        .from('poems')
        .select('themes')

      if (themeError) throw themeError

      const genreStats: { [key: string]: number } = {}
      themeData?.forEach(item => {
        if (item.themes && item.themes.length > 0) {
          const mainTheme = item.themes[0]
          genreStats[mainTheme] = (genreStats[mainTheme] || 0) + 1
        }
      })

      return {
        dynasty: dynastyStats,
        genre: genreStats,
        total: dynastyData?.length || 0
      }

    } catch (error) {
      console.error('获取分类统计失败:', error)
      return {
        dynasty: {},
        genre: {},
        total: 0
      }
    }
  }

  // 获取诗人的所有诗词作品
  static async getPoemsByAuthor(authorId: string | number, limit: number = 20): Promise<Poem[]> {
    try {
      console.log('获取诗人作品，作者ID:', authorId, '类型:', typeof authorId)
      
      // 确保 authorId 是字符串类型，因为数据库中的 author_id 可能是字符串
      const authorIdStr = authorId.toString()
      
      const { data, error } = await supabase
        .from('poems')
        .select(`
          *,
          authors (*),
          appreciations (*)
        `)
        .eq('author_id', authorIdStr)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('获取诗人作品失败:', error)
        throw error
      }
      
      console.log('找到诗人作品数量:', data?.length || 0)
      return data || []

    } catch (error) {
      console.error('获取诗人作品失败:', error)
      return []
    }
  }

  // 计算匹配分数（简化版）
  private static calculateMatchScore(poem: any, query: string): number {
    if (!query) return 0

    const titleMatch = poem.title.toLowerCase().includes(query.toLowerCase()) ? 0.5 : 0
    const contentMatch = poem.content.toLowerCase().includes(query.toLowerCase()) ? 0.3 : 0
    const authorMatch = (poem.authors?.name || '').toLowerCase().includes(query.toLowerCase()) ? 0.2 : 0

    return titleMatch + contentMatch + authorMatch
  }

  // 获取诗人列表
  static async getAuthors(filters: AuthorFilters = {}): Promise<AuthorsResponse> {
    const { 
      dynasty, 
      search, 
      sortBy = 'name', 
      page = 1, 
      pageSize = 12 
    } = filters

    const offset = (page - 1) * pageSize

    try {
      let queryBuilder = supabase
        .from('authors')
        .select('*', { count: 'exact' })

      // 应用筛选条件
      if (dynasty) {
        queryBuilder = queryBuilder.eq('dynasty', dynasty)
      }

      if (search) {
        queryBuilder = queryBuilder.ilike('name', `%${search}%`)
      }

      // 应用排序
      switch (sortBy) {
        case 'dynasty':
          queryBuilder = queryBuilder.order('dynasty').order('name')
          break
        case 'popular':
          queryBuilder = queryBuilder.order('created_at', { ascending: false })
          break
        case 'name':
        default:
          queryBuilder = queryBuilder.order('name')
          break
      }

      // 获取总数和数据
      const { data, count, error } = await queryBuilder
        .range(offset, offset + pageSize - 1)

      if (error) {
        console.error('获取诗人列表失败:', error)
        throw new Error(`数据库查询错误: ${error.message}`)
      }

      // 获取每个诗人的作品数量
      const authorsWithPoemCount = await Promise.all(
        (data || []).map(async (author) => {
          const poems = await this.getPoemsByAuthor(author.id, 1000) // 获取所有作品
          return {
            ...author,
            poemCount: poems.length
          }
        })
      )

      return {
        authors: authorsWithPoemCount,
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
        filters
      }

    } catch (error) {
      console.error('获取诗人列表失败:', error)
      throw new Error('获取诗人列表失败，请稍后重试')
    }
  }

  // 获取诗人统计信息
  static async getAuthorStats(): Promise<AuthorStats> {
    try {
      const { data, error } = await supabase
        .from('authors')
        .select('dynasty')

      if (error) throw error

      const dynastyStats: { [key: string]: number } = {}
      data?.forEach(author => {
        dynastyStats[author.dynasty] = (dynastyStats[author.dynasty] || 0) + 1
      })

      return {
        dynasty: dynastyStats,
        total: data?.length || 0
      }

    } catch (error) {
      console.error('获取诗人统计失败:', error)
      return {
        dynasty: {},
        total: 0
      }
    }
  }

  // 获取热门诗人（按作品数量排序）
  static async getPopularAuthors(limit: number = 10): Promise<Author[]> {
    try {
      const allAuthors = await this.getAuthors({ pageSize: 1000 })
      
      // 按作品数量排序
      const sortedAuthors = allAuthors.authors.sort((a, b) => {
        const aCount = (a as any).poemCount || 0
        const bCount = (b as any).poemCount || 0
        return bCount - aCount
      })

      return sortedAuthors.slice(0, limit)

    } catch (error) {
      console.error('获取热门诗人失败:', error)
      return []
    }
  }
}

export default PoemService