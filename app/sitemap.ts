import { MetadataRoute } from 'next'
import { getAllPostSlugs, getSortedPostsData } from '@/lib/posts'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mymindfulkit.com';

export default function sitemap(): MetadataRoute.Sitemap {
  // 主要页面路由
  const mainRoutes = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${siteUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/tools/dual-task-pomodoro`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/tools/gratitude-journal`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/games`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${siteUrl}/games/n-back-game`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${siteUrl}/ai-prompts`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    },
    {
      url: `${siteUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ];

  // 动态生成博客文章路由
  const blogPosts = getSortedPostsData().map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...mainRoutes, ...blogPosts];
} 