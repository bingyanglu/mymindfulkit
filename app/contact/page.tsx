import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | MyMindfulKit - We'd Love to Hear From You",
  description:
    "Have a question, feedback, or a suggestion for MyMindfulKit? Contact us directly. We value our community's input and will get back to you as soon as possible.",
  alternates: { canonical: "https://mymindfulkit.com/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[700px] px-6">
        <section className="text-center py-16 mb-12">
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight dark:text-white">Get in Touch</h1>
          <p className="text-lg text-[#706C69] dark:text-[#b0aca9] max-w-[600px] mx-auto mt-4">
            We&apos;d love to hear from you. Whether you have a question, feedback, or just want to say hello, we&apos;re here to listen.
          </p>
        </section>
        <section className="bg-white dark:bg-[#23211e] border border-[#EAE8E3] dark:border-[#35322e] rounded-3xl shadow-lg px-12 py-12 text-center">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">Our Inbox is Always Open</h2>
          <p className="text-base text-[#706C69] dark:text-[#b0aca9] max-w-[500px] mx-auto">
            We read every message that comes through. Your feedback is invaluable in helping us build better tools for our community. The best way to reach us is by email.
          </p>
          <a
            href="mailto:bingqilinpeishenme@gmail.com"
            className="inline-block mt-12 bg-[#1ABC9C] hover:bg-[#16A085] text-white px-9 py-4 rounded-xl font-bold text-xl transition-all duration-200 shadow-[0_4px_15px_rgba(26,188,156,0.2)] hover:shadow-[0_7px_20px_rgba(26,188,156,0.3)] hover:-translate-y-0.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block align-middle mr-4">
              <rect x="2" y="6" width="20" height="12" rx="2"/>
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Send Us an Email
          </a>
          <p className="mt-12 text-sm text-[#706C69] dark:text-[#b0aca9]">bingqilinpeishenme@gmail.com</p>
        </section>
      </main>
      <Footer />
    </>
  );
} 