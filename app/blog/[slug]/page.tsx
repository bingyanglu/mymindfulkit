import { getPostData, getAllPostSlugs } from '@/lib/posts';
import ReactMarkdown from 'react-markdown';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import styles from './post.module.css';
import { ShareButtons } from '../../components/client/ShareButtons';

interface PostData {
  slug: string;
  title: string;
  excerpt?: string;
  author?: string;
  category: string;
  date: string;
  readTime?: string;
  imageUrl?: string;
  content: string;
}

// 这个函数告诉Next.js需要为哪些文章预先生成页面
export async function generateStaticParams() {
  const paths = getAllPostSlugs();
  return paths;
}

// 这个函数会为每个页面生成独立的SEO元数据
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const postData = await getPostData(slug) as PostData;
  
  return {
    title: `${postData.title} | MyMindfulKit`,
    description: postData.excerpt || `Read about ${postData.title} on MyMindfulKit - your mindful productivity companion.`,
    canonical: `https://mymindfulkit.com/blog/${slug}`,
    robots: 'index,follow',
    openGraph: {
      title: postData.title,
      description: postData.excerpt,
      type: 'article',
      publishedTime: postData.date,
      authors: postData.author ? [postData.author] : undefined,
      images: postData.imageUrl ? [postData.imageUrl] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: postData.title,
      description: postData.excerpt,
      images: postData.imageUrl ? [postData.imageUrl] : undefined,
    },
  };
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const postData = await getPostData(slug) as PostData;

  return (
    <>
      <Header />
      <main className="max-w-[1200px] mx-auto px-6">
        <article className={styles.article}>
          <header className={styles.header}>
            <h1>{postData.title}</h1>
            <div className={styles.meta}>
              <span className="text-[#1ABC9C] font-bold mr-2">{postData.category}</span>
              <span className="text-[#706C69] dark:text-[#aaa]">· {postData.date}</span>
              {postData.readTime && (
                <span className="text-[#706C69] dark:text-[#aaa]">· {postData.readTime}</span>
              )}
              {postData.author && (
                <span className="text-[#706C69] dark:text-[#aaa]">· By {postData.author}</span>
              )}
            </div>
            {postData.imageUrl && (
              <div className="mt-8 mb-8">
                <img 
                  src={postData.imageUrl} 
                  alt={postData.title}
                  className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
                />
              </div>
            )}
          </header>
          <div className={styles.content}>
            <ReactMarkdown
              components={{
                // 将Markdown中的第一个h1转换为h2，避免重复的主标题
                h1: ({ children, ...props }) => {
                  // 检查是否是第一个h1（通常是文章标题）
                  const isFirstH1 = props.node?.position?.start?.line === 1;
                  if (isFirstH1) {
                    return <h2 {...props}>{children}</h2>;
                  }
                  return <h1 {...props}>{children}</h1>;
                },
                // 优化其他标题的样式
                h2: ({ children, ...props }) => (
                  <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100" {...props}>
                    {children}
                  </h2>
                ),
                h3: ({ children, ...props }) => (
                  <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-gray-100" {...props}>
                    {children}
                  </h3>
                ),
                // 优化段落样式
                p: ({ children, ...props }) => (
                  <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed" {...props}>
                    {children}
                  </p>
                ),
                // 优化列表样式
                ul: ({ children, ...props }) => (
                  <ul className="mb-4 pl-6 space-y-2" {...props}>
                    {children}
                  </ul>
                ),
                ol: ({ children, ...props }) => (
                  <ol className="mb-4 pl-6 space-y-2" {...props}>
                    {children}
                  </ol>
                ),
                li: ({ children, ...props }) => (
                  <li className="text-gray-700 dark:text-gray-300" {...props}>
                    {children}
                  </li>
                ),
                // 优化强调文本
                strong: ({ children, ...props }) => (
                  <strong className="font-semibold text-gray-900 dark:text-gray-100" {...props}>
                    {children}
                  </strong>
                ),
                // 优化链接样式
                a: ({ children, href, ...props }) => (
                  <a 
                    href={href} 
                    className="text-[#1ABC9C] hover:text-[#16A085] underline transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  >
                    {children}
                  </a>
                ),
                // 优化代码块
                code: ({ children, ...props }) => (
                  <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono" {...props}>
                    {children}
                  </code>
                ),
                // 优化引用块
                blockquote: ({ children, ...props }) => (
                  <blockquote className="border-l-4 border-[#1ABC9C] pl-4 italic text-gray-600 dark:text-gray-400 my-4" {...props}>
                    {children}
                  </blockquote>
                ),
              }}
            >
              {postData.content}
            </ReactMarkdown>
          </div>
          <ShareButtons slug={postData.slug} title={postData.title} />
        </article>
      </main>
      <Footer />
    </>
  );
} 