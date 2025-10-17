# 诗人表去重操作指南

## 问题描述
诗人表（authors）中存在名字相同的重复记录，但由于诗词表（poems）通过外键引用诗人表，直接删除会导致外键约束错误。

## 安全操作步骤

### 第一步：备份数据
在Supabase控制台中执行备份：
```sql
-- 备份诗人表
CREATE TABLE authors_backup AS SELECT * FROM authors;

-- 备份诗词表  
CREATE TABLE poems_backup AS SELECT * FROM poems;
```

### 第二步：分析重复情况
在Supabase SQL编辑器中执行 `scripts/safe-duplicate-removal.sql` 中的第一步和第二步查询，查看重复情况。

### 第三步：分步执行去重
按照 `safe-duplicate-removal.sql` 中的第三步，**逐条执行**SQL语句：

1. 执行 3.1 创建临时映射表
2. 执行 3.2 确认映射关系
3. 执行 3.3 更新诗词表引用
4. 执行 3.4 验证更新结果
5. 执行 3.5 删除重复诗人
6. 执行 3.6 清理临时表
7. 执行 3.7 验证最终结果

### 第四步：验证结果
检查去重后的数据完整性：
```sql
-- 检查诗人表
SELECT COUNT(*) as total_authors FROM authors;

-- 检查诗词表的外键完整性
SELECT COUNT(*) as poems_with_invalid_author
FROM poems p
LEFT JOIN authors a ON p.author_id = a.id
WHERE a.id IS NULL;

-- 这个查询应该返回0
```

## 重要注意事项

### ⚠️ 安全警告
- **务必先备份数据**
- **在测试环境先验证**
- **逐条执行SQL，不要一次性执行所有语句**
- **执行前确认映射关系正确**

### 🔄 回滚方案
如果操作出现问题，可以恢复备份：
```sql
-- 恢复诗人表
TRUNCATE authors;
INSERT INTO authors SELECT * FROM authors_backup;

-- 恢复诗词表
TRUNCATE poems;
INSERT INTO poems SELECT * FROM poems_backup;
```

### 📊 预期结果
- 诗人表中每个名字只保留一条记录（最新的）
- 诗词表的所有记录都正确关联到保留的诗人
- 数据完整性得到保持

## 替代方案

如果不想修改数据库，可以考虑：

### 方案A：创建去重视图
```sql
CREATE VIEW distinct_authors AS
SELECT DISTINCT ON (name) *
FROM authors 
ORDER BY name, created_at DESC;
```

### 方案B：应用层处理
在前端代码中过滤重复显示，不修改数据库。

## 技术支持
如果遇到问题，可以：
1. 查看Supabase的错误日志
2. 检查外键约束详情
3. 联系数据库管理员