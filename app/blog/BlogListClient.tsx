"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";

interface Post {
  slug: string;
  title: string;
  excerpt?: string;
  category: string;
  date: string;
  readTime?: string;
  imageUrl?: string;
}

interface BlogListClientProps {
  initialPosts: Post[];
}

const itemsPerPage = 6;

export function BlogListClient({ initialPosts }: BlogListClientProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // 搜索逻辑
  const filteredPosts = useMemo(() => {
    if (!search.trim()) return initialPosts;
    const searchTerm = search.trim().toLowerCase();
    return initialPosts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm))
    );
  }, [initialPosts, search]);

  // 分页逻辑
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const pagedPosts = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredPosts.slice(startIndex, endIndex);
  }, [filteredPosts, page]);

  // 重置分页当搜索改变时
  React.useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <>
      {/* 搜索栏 */}
      <div className="max-w-[700px] mx-auto mb-12 relative">
        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#706C69] dark:text-[#aaa]">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </span>
        <input
          type="search"
          className="w-full pl-14 pr-6 py-4 text-lg rounded-2xl border border-[#EAE8E3] dark:border-[#333] bg-white dark:bg-[#181818] shadow-lg focus:outline-none focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/20"
          placeholder="Search articles..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* 文章网格 */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[500px]" id="article-grid">
        {pagedPosts.length === 0 ? (
          <p className="col-span-full text-center text-[#706C69] dark:text-[#aaa] py-24">
            {search ? "No articles found. Try a different search." : "No articles available."}
          </p>
        ) : (
          pagedPosts.map((post) => (
            <div key={post.slug} className="bg-white dark:bg-[#232323] border border-[#EAE8E3] dark:border-[#333] rounded-2xl shadow-lg overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="h-[200px] w-full overflow-hidden bg-gray-100 dark:bg-[#181818] flex items-center justify-center">
                  <img 
                    src={post.imageUrl || "/placeholder-logo.png"} 
                    alt={post.title} 
                    className="w-full h-full object-cover" 
                    onError={e => { e.currentTarget.src = '/placeholder-logo.png'; }}
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-2xl font-bold mb-3 flex-1">{post.title}</h3>
                  
                  {/* 重新设计的元信息区域 */}
                  <div className="flex items-center flex-wrap mt-1">
                    {/* 标签 badge */}
                    <span className="inline-block px-3 py-1 rounded-full bg-[#1ABC9C] text-white text-xs font-semibold">
                      {post.category}
                    </span>
                    
                    {/* 中间的分隔点 */}
                    <span className="mx-2 text-gray-400">•</span>
                    
                    {/* 发布时间和阅读时间放在同一行 */}
                    <div className="flex items-center">
                      {/* 日历图标 */}
                      <svg className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      
                      {/* 发布日期 */}
                      <span className="text-xs text-gray-500 dark:text-gray-400">{post.date}</span>
                      
                      {/* 阅读时间 */}
                      {post.readTime && (
                        <>
                          <span className="mx-2 text-gray-400">•</span>
                          <svg className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10"/>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2"/>
                          </svg>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{post.readTime}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </section>

      {/* 分页 */}
      {totalPages > 1 && (
        <nav className="flex justify-center items-center gap-4 mt-16">
          <button
            className={`page-item flex items-center justify-center w-11 h-11 rounded-full border border-[#EAE8E3] dark:border-[#333] bg-white dark:bg-[#232323] font-bold transition-all duration-200 ${
              page === 1 ? "opacity-50 cursor-not-allowed" : "hover:border-[#1ABC9C] hover:bg-[#1ABC9C]/10 hover:text-[#1ABC9C]"
            }`}
            onClick={() => page > 1 && setPage(page - 1)}
            disabled={page === 1}
            aria-label="Previous page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`page-item flex items-center justify-center w-11 h-11 rounded-full border border-[#EAE8E3] dark:border-[#333] bg-white dark:bg-[#232323] font-bold transition-all duration-200 ${
                page === i + 1 
                  ? "bg-[#1ABC9C] text-white dark:text-white border-[#1ABC9C] cursor-default" 
                  : "hover:border-[#1ABC9C] hover:bg-[#1ABC9C]/10 hover:text-[#1ABC9C] dark:hover:text-[#1ABC9C]"
              }`}
              onClick={() => setPage(i + 1)}
              disabled={page === i + 1}
              aria-current={page === i + 1 ? "page" : undefined}
            >
              {i + 1}
            </button>
          ))}
          
          <button
            className={`page-item flex items-center justify-center w-11 h-11 rounded-full border border-[#EAE8E3] dark:border-[#333] bg-white dark:bg-[#232323] font-bold transition-all duration-200 ${
              page === totalPages ? "opacity-50 cursor-not-allowed" : "hover:border-[#1ABC9C] hover:bg-[#1ABC9C]/10 hover:text-[#1ABC9C]"
            }`}
            onClick={() => page < totalPages && setPage(page + 1)}
            disabled={page === totalPages}
            aria-label="Next page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </nav>
      )}
    </>
  );
}
