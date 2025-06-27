import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), '_posts');

/**
 * 获取排序后的所有文章数据
 * @returns {Array} 排序后的文章数据数组
 */
export function getSortedPostsData() {
  try {
    // 确保目录存在
    if (!fs.existsSync(postsDirectory)) {
      console.warn(`Posts directory not found: ${postsDirectory}`);
      return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    
    // 如果没有文件，返回空数组
    if (!fileNames || fileNames.length === 0) {
      console.info('No posts found in directory');
      return [];
    }

    const allPostsData = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        
        try {
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const matterResult = matter(fileContents);
          
          // 数据验证：确保必要的字段存在
          const requiredFields = ['title', 'date', 'category'];
          const missingFields = requiredFields.filter(field => !matterResult.data[field]);
          
          if (missingFields.length > 0) {
            console.warn(`Post ${fileName} is missing required fields: ${missingFields.join(', ')}`);
          }
          
          return {
            slug,
            ...matterResult.data,
          };
        } catch (error) {
          console.error(`Error processing file ${fileName}:`, error);
          return null;
        }
      })
      .filter(Boolean) // 过滤掉处理失败的文章
      .sort((a, b) => {
        // 按日期降序排序
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA < dateB ? 1 : -1;
      });

    return allPostsData;
  } catch (error) {
    console.error('Error reading posts directory:', error);
    return [];
  }
}

/**
 * 获取所有文章的 slug
 * @returns {Array} 所有文章的 slug 数组
 */
export function getAllPostSlugs() {
  try {
    if (!fs.existsSync(postsDirectory)) {
      return [];
    }
    
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map((fileName) => {
        return {
          slug: fileName.replace(/\.md$/, ''),
        };
      });
  } catch (error) {
    console.error('Error getting post slugs:', error);
    return [];
  }
}

/**
 * 获取单篇文章的数据
 * @param {string} slug - 文章的 slug
 * @returns {Object} 文章数据对象
 */
export async function getPostData(slug) {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Post not found: ${slug}`);
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
      slug,
      content: matterResult.content,
      ...matterResult.data,
    };
  } catch (error) {
    console.error(`Error getting post data for ${slug}:`, error);
    throw error;
  }
}

/**
 * 获取所有分类
 * @returns {Array} 所有分类的数组
 */
export function getAllCategories() {
  const posts = getSortedPostsData();
  const categories = [...new Set(posts.map(post => post.category))];
  return categories.sort();
}

/**
 * 获取所有标签
 * @returns {Array} 所有标签的数组
 */
export function getAllTags() {
  const posts = getSortedPostsData();
  const tags = posts.flatMap(post => post.tags || []);
  return [...new Set(tags)].sort();
}

/**
 * 按分类筛选文章
 * @param {string} category - 分类名称
 * @returns {Array} 筛选后的文章数组
 */
export function getPostsByCategory(category) {
  const posts = getSortedPostsData();
  return posts.filter(post => post.category === category);
} 