"use client";
import React, { useState, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import { useTheme } from "../hooks/use-theme";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

const articlesData = [
  {
    title: "7 ADHD-Friendly Tools & Games You Can Use Right Now (For Free)",
    excerpt:
      "We tried countless productivity tools, but many were abandoned due to complexity. Here are our top 7 free tools and games that actually help, not hinder...",
    category: "Tools & Tips",
    date: "June 28, 2025",
    readTime: "7 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1554415707-6e8cf6332b5e?q=80&w=800&auto=format&fit=crop",
    isFeatured: true,
  },
  {
    title: "Why We Built an N-Back Game for Distracted Minds",
    category: "Cognitive Science",
    date: "June 27, 2025",
    readTime: "5 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "The 2-Minute Habit to Counteract Anxiety: Gratitude Journaling",
    category: "Mindfulness",
    date: "June 25, 2025",
    readTime: "4 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "How AI Prompts Can Become Your 'Second Brain'",
    category: "AI & Productivity",
    date: "June 23, 2025",
    readTime: "6 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Understanding 'Time Blindness' and How to Manage It",
    category: "Productivity",
    date: "June 21, 2025",
    readTime: "5 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1484100356142-db6ab6244067?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "The Power of Body Doubling for Task Initiation",
    category: "Community",
    date: "June 19, 2025",
    readTime: "4 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Designing for Calm: The Principles Behind Our UI",
    category: "Design",
    date: "June 18, 2025",
    readTime: "5 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=800&auto=format&fit=crop",
  },
];

const itemsPerPage = 6;

function BlogPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const theme = useTheme();

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return articlesData;
    return articlesData.filter(
      (a) =>
        a.title.toLowerCase().includes(s) ||
        (a.excerpt && a.excerpt.toLowerCase().includes(s))
    );
  }, [search]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paged = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // SEO元信息
  const meta = {
    title: "Blog | MyMindfulKit - Insights on Focus, Productivity & Neurodiversity",
    description:
      "Explore articles and insights from MyMindfulKit. We share actionable tips, scientific background, and personal stories on focus, productivity, and life with a neurodivergent mind.",
    canonical: "https://mymindfulkit.com/blog",
  };

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={meta.canonical} />
        <meta name="robots" content="index,follow" />
      </Head>
      <Header />
      <main className="max-w-[1200px] mx-auto px-6">
        <section className="text-center py-16 border-b border-[#EAE8E3] dark:border-[#333]">
          <h1 className="text-[3.5rem] font-extrabold leading-[1.2] tracking-tight">Our Journal</h1>
          <p className="text-xl text-[#706C69] dark:text-[#aaa] max-w-[600px] mx-auto mt-4">
            Insights, tips, and stories on focus, productivity, and life with a neurodivergent mind.
          </p>
        </section>
        <div className="pt-16">
          <div className="max-w-[700px] mx-auto mb-12 relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#706C69] dark:text-[#aaa]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
            <input
              type="search"
              className="w-full pl-14 pr-6 py-4 text-lg rounded-2xl border border-[#EAE8E3] dark:border-[#333] bg-white dark:bg-[#181818] shadow-lg focus:outline-none focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/20"
              placeholder="Search articles..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[500px]" id="article-grid">
            {paged.length === 0 ? (
              <p className="col-span-full text-center text-[#706C69] dark:text-[#aaa] py-24">No articles found. Try a different search.</p>
            ) : (
              paged.map((a, i) => (
                <div key={a.title} className="bg-white dark:bg-[#232323] border border-[#EAE8E3] dark:border-[#333] rounded-2xl shadow-lg overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl">
                  <Link href="#" className="block">
                    <div className="h-[200px] w-full overflow-hidden">
                      <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-2xl font-bold mb-4 flex-1">{a.title}</h3>
                      <p className="text-sm text-[#1ABC9C] font-bold inline-block mr-2">{a.category}</p>
                      <span className="text-sm text-[#706C69] dark:text-[#aaa]">· {a.date}</span>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </section>
          {/* 分页 */}
          <nav className="flex justify-center items-center gap-4 mt-16">
            <button
              className={`page-item flex items-center justify-center w-11 h-11 rounded-full border border-[#EAE8E3] dark:border-[#333] bg-white dark:bg-[#232323] font-bold transition-all duration-200 ${page === 1 ? "opacity-50 cursor-not-allowed" : "hover:border-[#1ABC9C] hover:bg-[#1ABC9C]/10 hover:text-[#1ABC9C]"}`}
              onClick={() => page > 1 && setPage(page - 1)}
              disabled={page === 1}
              aria-label="Previous page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`page-item flex items-center justify-center w-11 h-11 rounded-full border border-[#EAE8E3] dark:border-[#333] bg-white dark:bg-[#232323] font-bold transition-all duration-200 ${page === i + 1 ? "bg-[#1ABC9C] text-white dark:text-white border-[#1ABC9C] cursor-default" : "hover:border-[#1ABC9C] hover:bg-[#1ABC9C]/10 hover:text-[#1ABC9C] dark:hover:text-[#1ABC9C]"}`}
                onClick={() => setPage(i + 1)}
                disabled={page === i + 1}
                aria-current={page === i + 1 ? "page" : undefined}
              >
                {i + 1}
              </button>
            ))}
            <button
              className={`page-item flex items-center justify-center w-11 h-11 rounded-full border border-[#EAE8E3] dark:border-[#333] bg-white dark:bg-[#232323] font-bold transition-all duration-200 ${page === totalPages || totalPages === 0 ? "opacity-50 cursor-not-allowed" : "hover:border-[#1ABC9C] hover:bg-[#1ABC9C]/10 hover:text-[#1ABC9C]"}`}
              onClick={() => page < totalPages && setPage(page + 1)}
              disabled={page === totalPages || totalPages === 0}
              aria-label="Next page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </nav>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default BlogPage; 