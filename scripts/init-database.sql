-- 诗词鉴赏应用数据库初始化脚本

-- 创建作者表
CREATE TABLE IF NOT EXISTS authors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  dynasty TEXT NOT NULL,
  introduction TEXT,
  birth_year INTEGER,
  death_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建诗词表
CREATE TABLE IF NOT EXISTS poems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  dynasty TEXT NOT NULL,
  author_id UUID REFERENCES authors(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  themes TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建赏析表
CREATE TABLE IF NOT EXISTS appreciations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poem_id UUID REFERENCES poems(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引优化查询性能

-- 作者表索引
CREATE INDEX IF NOT EXISTS idx_authors_name ON authors(name);
CREATE INDEX IF NOT EXISTS idx_authors_dynasty ON authors(dynasty);

-- 诗词表索引
CREATE INDEX IF NOT EXISTS idx_poems_title ON poems(title);
CREATE INDEX IF NOT EXISTS idx_poems_dynasty ON poems(dynasty);
CREATE INDEX IF NOT EXISTS idx_poems_type ON poems(type);
CREATE INDEX IF NOT EXISTS idx_poems_author_id ON poems(author_id);
CREATE INDEX IF NOT EXISTS idx_poems_themes ON poems USING GIN(themes);

-- 赏析表索引
CREATE INDEX IF NOT EXISTS idx_appreciations_poem_id ON appreciations(poem_id);

-- 启用Row Level Security (RLS)
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE appreciations ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略 - 允许公开读取所有数据
CREATE POLICY "允许公开读取作者信息" ON authors
  FOR SELECT USING (true);

CREATE POLICY "允许公开读取诗词信息" ON poems
  FOR SELECT USING (true);

CREATE POLICY "允许公开读取赏析信息" ON appreciations
  FOR SELECT USING (true);

-- 创建全文搜索函数
CREATE OR REPLACE FUNCTION search_poems(search_term TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  dynasty TEXT,
  author_name TEXT,
  type TEXT,
  match_score REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.content,
    p.dynasty,
    a.name as author_name,
    p.type,
    GREATEST(
      similarity(p.title, search_term),
      similarity(p.content, search_term),
      similarity(a.name, search_term)
    ) as match_score
  FROM poems p
  JOIN authors a ON p.author_id = a.id
  WHERE 
    p.title ILIKE '%' || search_term || '%' OR
    p.content ILIKE '%' || search_term || '%' OR
    a.name ILIKE '%' || search_term || '%' OR
    p.dynasty ILIKE '%' || search_term || '%'
  ORDER BY match_score DESC;
END;
$$ LANGUAGE plpgsql;

-- 创建获取相关诗词的函数
CREATE OR REPLACE FUNCTION get_related_poems(poem_id UUID, limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
  id UUID,
  title TEXT,
  author_name TEXT,
  dynasty TEXT,
  similarity_score REAL
) AS $$
DECLARE
  target_themes TEXT[];
  target_author_id UUID;
  target_dynasty TEXT;
BEGIN
  -- 获取目标诗词的信息
  SELECT themes, author_id, dynasty 
  INTO target_themes, target_author_id, target_dynasty
  FROM poems WHERE id = poem_id;
  
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    a.name as author_name,
    p.dynasty,
    (
      -- 计算主题相似度
      CASE 
        WHEN array_length(target_themes, 1) > 0 THEN 
          (SELECT COUNT(*) FROM unnest(p.themes) AS theme 
           WHERE theme = ANY(target_themes))::REAL / 
          GREATEST(array_length(p.themes, 1), 1)
        ELSE 0 
      END * 0.4 +
      -- 同作者加分
      CASE WHEN p.author_id = target_author_id THEN 0.3 ELSE 0 END +
      -- 同朝代加分
      CASE WHEN p.dynasty = target_dynasty THEN 0.3 ELSE 0 END
    ) as similarity_score
  FROM poems p
  JOIN authors a ON p.author_id = a.id
  WHERE p.id != poem_id
  ORDER BY similarity_score DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- 注释表说明
COMMENT ON TABLE authors IS '存储诗人作者信息';
COMMENT ON TABLE poems IS '存储诗词内容信息';
COMMENT ON TABLE appreciations IS '存储诗词赏析内容';

COMMENT ON COLUMN authors.name IS '作者姓名';
COMMENT ON COLUMN authors.dynasty IS '所属朝代';
COMMENT ON COLUMN authors.introduction IS '作者简介';
COMMENT ON COLUMN authors.birth_year IS '出生年份';
COMMENT ON COLUMN authors.death_year IS '逝世年份';

COMMENT ON COLUMN poems.title IS '诗词标题';
COMMENT ON COLUMN poems.content IS '诗词内容';
COMMENT ON COLUMN poems.dynasty IS '诗词朝代';
COMMENT ON COLUMN poems.author_id IS '关联作者ID';
COMMENT ON COLUMN poems.type IS '诗词类型（诗、词、曲等）';
COMMENT ON COLUMN poems.themes IS '主题标签数组';

COMMENT ON COLUMN appreciations.poem_id IS '关联诗词ID';
COMMENT ON COLUMN appreciations.content IS '赏析内容';
COMMENT ON COLUMN appreciations.source IS '赏析来源';

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_poems_updated_at 
  BEFORE UPDATE ON poems
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();