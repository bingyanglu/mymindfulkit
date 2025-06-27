import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | MyMindfulKit",
  description:
    "Read the Privacy Policy for MyMindfulKit. We are committed to protecting your privacy and being transparent about how we handle data.",
  alternates: { canonical: "https://mymindfulkit.com/privacy-policy" },
  robots: { index: false, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[800px] px-6">
        <header className="text-center py-16 border-b border-[#EAE8E3] dark:border-[#35322e] mb-16">
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight dark:text-white">Privacy Policy</h1>
        </header>
        <article className="content-section">
          <p className="text-base text-[#706C69] dark:text-[#b0aca9] mb-6">
            <strong>Last updated: June 26, 2025</strong>
          </p>
          <p className="text-base text-[#706C69] dark:text-[#b0aca9] mb-6">
            Welcome to MyMindfulKit.com. Your privacy is critically important to us. This Privacy Policy outlines how we handle information on our website.
          </p>
          <h2 className="text-2xl font-bold mt-12 mb-6 pb-4 border-b border-[#EAE8E3] dark:border-[#35322e] dark:text-white">
            Our Core Principle: Privacy by Design
          </h2>
          <p className="text-base text-[#706C69] dark:text-[#b0aca9] mb-6">
            MyMindfulKit is designed from the ground up to be a private, safe space. We do not require user accounts, registration, or the submission of personal identifiable information to use our core tools.
          </p>
          <h2 className="text-2xl font-bold mt-12 mb-6 pb-4 border-b border-[#EAE8E3] dark:border-[#35322e] dark:text-white">
            Information We Do NOT Collect
          </h2>
          <p className="text-base text-[#706C69] dark:text-[#b0aca9] mb-6">
            We do not collect any personal data such as your name, email address, or physical address. You can use our website anonymously.
          </p>
          <h2 className="text-2xl font-bold mt-12 mb-6 pb-4 border-b border-[#EAE8E3] dark:border-[#35322e] dark:text-white">
            Information You Store Locally
          </h2>
          <p className="text-base text-[#706C69] dark:text-[#b0aca9] mb-6">
            Some of our tools, like the <strong>Gratitude Journal</strong>, offer functionality to save your data. This data is stored <strong>exclusively in your browser&apos;s local storage</strong>. This means:
          </p>
          <ul className="list-inside text-base text-[#706C69] dark:text-[#b0aca9] mb-6">
            <li className="mb-6">Your journal entries, task lists, or other personal content <strong>never leave your computer</strong>.</li>
            <li className="mb-6">We do not have access to this information. It is not sent to our servers or any third party.</li>
            <li className="mb-6">If you clear your browser cache or use a different browser, this locally stored data will be lost.</li>
          </ul>
          <h2 className="text-2xl font-bold mt-12 mb-6 pb-4 border-b border-[#EAE8E3] dark:border-[#35322e] dark:text-white">
            Analytics Data (Anonymous)
          </h2>
          <p className="text-base text-[#706C69] dark:text-[#b0aca9] mb-6">
            To understand how our website is used and how we can improve it, we use <strong>Google Analytics</strong>. This service collects anonymous, aggregate data about website traffic, such as:
          </p>
          <ul className="list-inside text-base text-[#706C69] dark:text-[#b0aca9] mb-6">
            <li className="mb-6">The number of visitors to our site.</li>
            <li className="mb-6">Which pages are most popular.</li>
            <li className="mb-6">The general geographical location of users (e.g., country).</li>
            <li className="mb-6">How long users stay on our site.</li>
          </ul>
          <p className="text-base text-[#706C69] dark:text-[#b0aca9] mb-6">
            This information is completely anonymous and cannot be used to identify you personally. It helps us make better decisions about which tools and features to build next.
          </p>
          <h2 className="text-2xl font-bold mt-12 mb-6 pb-4 border-b border-[#EAE8E3] dark:border-[#35322e] dark:text-white">
            Cookies
          </h2>
          <p className="text-base text-[#706C69] dark:text-[#b0aca9] mb-6">
            We use a minimal number of cookies. A cookie is a small file stored on your computer. Google Analytics uses cookies to gather the anonymous data mentioned above. You can disable cookies in your browser settings, though it may affect the functionality of some websites.
          </p>
          <h2 className="text-2xl font-bold mt-12 mb-6 pb-4 border-b border-[#EAE8E3] dark:border-[#35322e] dark:text-white">
            Third-Party Links
          </h2>
          <p className="text-base text-[#706C69] dark:text-[#b0aca9] mb-6">
            Our site may contain links to other websites (for example, in our Resources section). Please be aware that we are not responsible for the content or privacy practices of such other sites. We encourage our users to be aware when they leave our site and to read the privacy statements of any other site that collects personally identifiable information.
          </p>
          <h2 className="text-2xl font-bold mt-12 mb-6 pb-4 border-b border-[#EAE8E3] dark:border-[#35322e] dark:text-white">
            Children&apos;s Privacy
          </h2>
          <p className="text-base text-[#706C69] dark:text-[#b0aca9] mb-6">
            Our service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13.
          </p>
          <h2 className="text-2xl font-bold mt-12 mb-6 pb-4 border-b border-[#EAE8E3] dark:border-[#35322e] dark:text-white">
            Changes to This Privacy Policy
          </h2>
          <p className="text-base text-[#706C69] dark:text-[#b0aca9] mb-6">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </p>
          <h2 className="text-2xl font-bold mt-12 mb-6 pb-4 border-b border-[#EAE8E3] dark:border-[#35322e] dark:text-white">
            Contact Us
          </h2>
          <p className="text-base text-[#706C69] dark:text-[#b0aca9] mb-6">
            If you have any questions about this Privacy Policy, you can{" "}
            <a href="/contact" className="text-[#1ABC9C] dark:text-[#4F46E5] font-medium hover:underline">
              contact us
            </a>
            .
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
} 