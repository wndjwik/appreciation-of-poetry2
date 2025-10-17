-- 诗人表安全去重SQL脚本
-- 在Supabase SQL编辑器中执行
-- 执行前请备份数据！

-- 第一步：查看重复情况（安全，只读）
SELECT 
    name,
    COUNT(*) as duplicate_count,
    ARRAY_AGG(id ORDER BY created_at DESC) as author_ids,
    ARRAY_AGG(dynasty ORDER BY created_at DESC) as dynasties
FROM authors 
GROUP BY name 
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC, name;

-- 第二步：查看重复诗人的诗词关联情况
WITH duplicate_authors AS (
    SELECT name, 
           ARRAY_AGG(id ORDER BY created_at DESC) as author_ids
    FROM authors 
    GROUP BY name 
    HAVING COUNT(*) > 1
)
SELECT 
    da.name,
    a.id as author_id,
    a.dynasty,
    COUNT(p.id) as poem_count,
    STRING_AGG(p.title, ', ') as sample_titles
FROM duplicate_authors da
JOIN authors a ON a.name = da.name
LEFT JOIN poems p ON p.author_id = a.id
GROUP BY da.name, a.id, a.dynasty
ORDER BY da.name, a.created_at DESC;

-- 第三步：安全去重操作（分步执行）

-- 3.1 创建临时表存储要保留的诗人映射
CREATE TEMPORARY TABLE author_merge_mapping AS
SELECT 
    name,
    (ARRAY_AGG(id ORDER BY created_at DESC))[1] as keep_author_id,
    ARRAY_AGG(id ORDER BY created_at DESC) as all_author_ids
FROM authors 
GROUP BY name 
HAVING COUNT(*) > 1;

-- 3.2 查看映射关系（确认是否正确）
SELECT * FROM author_merge_mapping;

-- 3.3 更新诗词表的author_id引用（将重复诗人的诗词关联到保留的诗人）
UPDATE poems 
SET author_id = amm.keep_author_id
FROM author_merge_mapping amm
WHERE poems.author_id = ANY(amm.all_author_ids)
  AND poems.author_id != amm.keep_author_id;

-- 3.4 验证更新是否正确
SELECT 
    amm.name,
    amm.keep_author_id,
    COUNT(p.id) as poem_count_after_update
FROM author_merge_mapping amm
LEFT JOIN poems p ON p.author_id = amm.keep_author_id
GROUP BY amm.name, amm.keep_author_id;

-- 3.5 删除重复的诗人记录（保留最新的记录）
DELETE FROM authors 
WHERE id IN (
    SELECT unnest(amm.all_author_ids[2:]) -- 除了第一个之外的所有ID
    FROM author_merge_mapping amm
);

-- 3.6 清理临时表
DROP TABLE author_merge_mapping;

-- 3.7 验证去重结果
SELECT name, COUNT(*) as count 
FROM authors 
GROUP BY name 
HAVING COUNT(*) > 1;

-- 如果第三步执行成功，这个查询应该返回空结果