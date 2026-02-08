"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User, ArrowLeft, Share2, Loader2 } from "lucide-react";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import api from "@/lib/api";

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await api.get(`/blog/${id}`);
        setPost({
          id: res.data.post.id,
          title: res.data.post.title,
          content: res.data.post.content,
          date: new Date(res.data.post.published_at).toLocaleDateString(),
          readTime: res.data.post.read_time,
          author: res.data.post.author_name,
          role: res.data.post.author_role,
          category: res.data.post.category
        });
      } catch (e) {
        console.error("Failed to fetch post", e);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    if (id) fetchPost();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black text-zinc-900 dark:text-zinc-50">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <Link href="/blog" className="text-indigo-600 hover:underline flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-50">
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
            <Link href="/blog" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 inline-flex items-center gap-2 text-sm font-medium mb-8 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back to Blog
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center gap-3 mb-6">
                    <span className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-sm font-medium">
                        {post.category}
                    </span>
                    <span className="text-zinc-400 text-sm">•</span>
                    <div className="flex items-center gap-2 text-zinc-500 text-sm">
                        <Calendar className="h-4 w-4" />
                        {post.date}
                    </div>
                    <span className="text-zinc-400 text-sm">•</span>
                    <div className="flex items-center gap-2 text-zinc-500 text-sm">
                        <Clock className="h-4 w-4" />
                        {post.readTime}
                    </div>
                </div>

                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-8 leading-tight">
                    {post.title}
                </h1>

                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-8 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                            <User className="h-5 w-5 text-zinc-500" />
                        </div>
                        <div>
                            <div className="font-semibold text-zinc-900 dark:text-zinc-200">{post.author}</div>
                            <div className="text-xs text-zinc-500">{post.role}</div>
                        </div>
                    </div>
                    <button className="text-zinc-500 hover:text-indigo-600 transition p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        <Share2 className="h-5 w-5" />
                    </button>
                </div>
            </motion.div>
        </div>

        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <div className="h-[300px] md:h-[400px] w-full bg-zinc-100 dark:bg-zinc-900 rounded-2xl mb-12 flex items-center justify-center text-zinc-400 dark:text-zinc-600">
                <span className="text-4xl font-bold opacity-20">Hero Image Placeholder</span>
            </div>

            <article className="prose prose-zinc dark:prose-invert lg:prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>

            <div className="mt-16 pt-8 border-t border-zinc-100 dark:border-zinc-800 text-center">
                <h3 className="text-xl font-bold mb-4">Enjoyed this post?</h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                    Subscribe to our newsletter to get the latest updates delivered straight to your inbox.
                </p>
                <div className="flex max-w-md mx-auto gap-2">
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="flex-1 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-black px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button className="bg-zinc-900 dark:bg-white text-white dark:text-black px-6 py-2 rounded-lg font-medium hover:opacity-90 transition">
                        Subscribe
                    </button>
                </div>
            </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
