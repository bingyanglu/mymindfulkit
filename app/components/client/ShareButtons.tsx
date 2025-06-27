"use client";
import React from "react";

interface ShareButtonsProps {
  slug: string;
  title: string;
}

export function ShareButtons({ slug, title }: ShareButtonsProps) {
  const url = `https://mymindfulkit.com/blog/${slug}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    if (typeof window !== 'undefined') {
      window.alert('链接已复制！');
    }
  };

  return (
    <div className="flex gap-4 mt-10 mb-8">
      {/* 推特分享按钮 */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#1DA1F2] text-white font-semibold shadow hover:bg-[#0d8ddb] transition-colors"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 5.924c-.793.352-1.645.59-2.54.698a4.48 4.48 0 001.963-2.475 8.94 8.94 0 01-2.828 1.082A4.48 4.48 0 0016.11 4c-2.48 0-4.49 2.01-4.49 4.49 0 .352.04.695.116 1.022C7.728 9.36 4.1 7.5 1.67 4.882a4.48 4.48 0 00-.61 2.26c0 1.56.795 2.94 2.005 3.75a4.48 4.48 0 01-2.034-.563v.057c0 2.18 1.55 4 3.6 4.42-.377.103-.775.158-1.185.158-.29 0-.57-.028-.845-.08.57 1.78 2.23 3.08 4.2 3.12A8.98 8.98 0 012 19.54a12.7 12.7 0 006.88 2.02c8.26 0 12.78-6.84 12.78-12.78 0-.195-.004-.39-.013-.583A9.14 9.14 0 0024 4.59a8.98 8.98 0 01-2.54.698z"/></svg>
        分享到推特
      </a>
      {/* 复制链接按钮 */}
      <button
        type="button"
        className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#1ABC9C] text-white font-semibold shadow hover:bg-[#169c82] transition-colors"
        onClick={handleCopy}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
        复制链接
      </button>
    </div>
  );
} 