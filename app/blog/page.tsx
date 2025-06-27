import { getSortedPostsData } from '@/lib/posts';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { BlogListClient } from './BlogListClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | MyMindfulKit - Insights on Focus, Productivity & Neurodiversity',
  description: 'Explore articles and insights from MyMindfulKit. We share actionable tips, scientific background, and personal stories on focus, productivity, and life with a neurodivergent mind.',
  keywords: 'ADHD blog, focus tips, productivity, neurodiversity, executive function, working memory, mindfulness, time management',
  authors: [{ name: 'MyMindfulKit' }],
  creator: 'MyMindfulKit',
  publisher: 'MyMindfulKit',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://mymindfulkit.com/blog',
  },
  openGraph: {
    title: 'Blog | MyMindfulKit - Insights on Focus, Productivity & Neurodiversity',
    description: 'Explore articles and insights from MyMindfulKit. We share actionable tips, scientific background, and personal stories on focus, productivity, and life with a neurodivergent mind.',
    url: 'https://mymindfulkit.com/blog',
    siteName: 'MyMindfulKit',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | MyMindfulKit - Insights on Focus, Productivity & Neurodiversity',
    description: 'Explore articles and insights from MyMindfulKit. We share actionable tips, scientific background, and personal stories on focus, productivity, and life with a neurodivergent mind.',
    creator: '@mymindfulkit',
  },
};

export default async function BlogPage() {
  // 获取实际文章数据
  const posts = await getSortedPostsData();

  return (
    <>
      <Header />
      <main className="max-w-[1200px] mx-auto px-6">
        <section className="text-center py-16 border-b border-[#EAE8E3] dark:border-[#333]">
          <h1 className="text-[3.5rem] font-extrabold leading-[1.2] tracking-tight">Our Journal</h1>
          <p className="text-xl text-[#706C69] dark:text-[#aaa] max-w-[600px] mx-auto mt-4">
            Insights, tips, and stories on focus, productivity, and life with a neurodivergent mind.
          </p>
        </section>
        <div className="pt-16">
          <BlogListClient initialPosts={posts} />
        </div>
      </main>
      <Footer />
    </>
  );
} 