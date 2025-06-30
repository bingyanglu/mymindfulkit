import Image from 'next/image'

export function Footer() {
  return (
    <footer className="main-footer mt-20 py-16
                      bg-[#ECEAE6] dark:bg-[#111827]
                      border-t dark:border-[#374151]
                      text-center">
      <div className="container max-w-7xl mx-auto px-6">
        <div className="footer-content">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <Image 
              src="/images/logo.svg" 
              alt="MyMindfulKit Logo" 
              width={40} 
              height={40}
              className="w-10 h-10"
            />
            <span className="text-2xl font-extrabold text-[#3A3532] dark:text-[#E5E7EB]">
              MyMindfulKit
            </span>
          </div>
          <div className="footer-nav mb-4 flex justify-center items-center space-x-6">
            <a href="/about" className="text-[#706C69] dark:text-[#9CA3AF] hover:text-[#1ABC9C] dark:hover:text-[#4F46E5] transition-colors">About Us</a>
            <a href="/contact" className="text-[#706C69] dark:text-[#9CA3AF] hover:text-[#1ABC9C] dark:hover:text-[#4F46E5] transition-colors">Contact</a>
            <a href="/privacy-policy" className="text-[#706C69] dark:text-[#9CA3AF] hover:text-[#1ABC9C] dark:hover:text-[#4F46E5] transition-colors">Privacy Policy</a>
          </div>
          <p className="text-[#706C69] dark:text-[#9CA3AF] mb-2">
            &copy; {new Date().getFullYear()} MyMindfulKit.com. All Rights Reserved.
          </p>
          <p className="text-[#706C69] dark:text-[#9CA3AF] text-sm">
            Built with ❤️ for the neurodivergent community.
          </p>
        </div>
      </div>
    </footer>
  )
} 