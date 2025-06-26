export function Footer() {
  return (
    <footer className="main-footer mt-20 py-16
                      bg-[#ECEAE6] dark:bg-[#111827]
                      border-t dark:border-[#374151]
                      text-center">
      <div className="container max-w-7xl mx-auto px-6">
        <div className="footer-content">
          <div className="logo text-2xl font-extrabold mb-4
                        text-[#3A3532] dark:text-[#E5E7EB]">
            MyMindfulKit
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