"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Eye, X, FileText, User, Clock, Tag, AlignLeft } from "lucide-react";
import api from "@/lib/api";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    author_name: "",
    author_role: "Admin",
    status: "Draft",
    excerpt: "",
    content: "",
    category: "General",
    read_time: "5 min read"
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const res = await api.get('/blog/admin/list');
      setBlogs(res.data.posts);
    } catch (e) {
      console.error("Failed to fetch posts", e);
    } finally {
      setIsLoading(false);
    }
  }

  const handleOpenModal = (post: any = null) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        author_name: post.author_name || "",
        author_role: post.author_role || "Admin",
        status: post.status || "Draft",
        excerpt: post.excerpt || "",
        content: post.content || "",
        category: post.category || "General",
        read_time: post.read_time || "5 min read"
      });
    } else {
      setEditingPost(null);
      setFormData({
        title: "",
        author_name: "Admin",
        author_role: "Admin",
        status: "Draft",
        excerpt: "",
        content: "",
        category: "General",
        read_time: "5 min read"
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await api.delete(`/blog/${id}`);
        setBlogs(blogs.filter(blog => blog.id !== id));
      } catch (e) {
        console.error("Failed to delete post", e);
        alert("Failed to delete post");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPost) {
        await api.put(`/blog/${editingPost.id}`, formData);
        setBlogs(blogs.map(blog => 
          blog.id === editingPost.id 
            ? { ...blog, ...formData, published_at: blog.published_at } 
            : blog
        ));
      } else {
        const res = await api.post('/blog', {
            ...formData,
            published_at: new Date().toISOString()
        });
        const newPost = {
            id: res.data.id,
            ...formData,
            published_at: new Date().toISOString(),
            created_at: new Date().toISOString()
        };
        setBlogs([newPost, ...blogs]);
      }
      setIsModalOpen(false);
    } catch (e: any) {
      console.error("Failed to save post", e);
      alert("Failed to save post");
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading posts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blog Posts</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manage your content marketing and announcements.
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Create Post
        </button>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/50">
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Author</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {blogs.map((post) => (
                <tr key={post.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium">
                    <div className="flex flex-col">
                      <span>{post.title}</span>
                      <span className="text-xs text-zinc-500 truncate max-w-[200px]">{post.excerpt}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        post.status === "Published"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}
                    >
                      {post.status || "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                    {post.author_name}
                  </td>
                  <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                    {post.published_at ? new Date(post.published_at).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                    {post.category}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(post)}
                        className="rounded p-1 text-zinc-500 hover:bg-zinc-100 hover:text-indigo-600 dark:hover:bg-zinc-800"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(post.id)}
                        className="rounded p-1 text-zinc-500 hover:bg-zinc-100 hover:text-red-600 dark:hover:bg-zinc-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && (
                <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                        No posts found. Create one to get started.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Blog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">
                {editingPost ? "Edit Post" : "Create New Post"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <div className="relative">
                    <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-4 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-zinc-700 dark:bg-black"
                        placeholder="Post title"
                    />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <div className="relative">
                    <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-4 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-zinc-700 dark:bg-black"
                        placeholder="e.g. Tutorial"
                    />
                    </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Author Name</label>
                    <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                        type="text"
                        required
                        value={formData.author_name}
                        onChange={(e) => setFormData({...formData, author_name: e.target.value})}
                        className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-4 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-zinc-700 dark:bg-black"
                        placeholder="Author name"
                    />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Read Time</label>
                    <div className="relative">
                    <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                        type="text"
                        value={formData.read_time}
                        onChange={(e) => setFormData({...formData, read_time: e.target.value})}
                        className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-4 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-zinc-700 dark:bg-black"
                        placeholder="e.g. 5 min read"
                    />
                    </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 px-3 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-zinc-700 dark:bg-black"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Excerpt</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 px-3 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-zinc-700 dark:bg-black min-h-[60px]"
                  placeholder="Short description..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Content (HTML)</label>
                <div className="relative">
                    <AlignLeft className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                    <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-4 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-zinc-700 dark:bg-black min-h-[200px] font-mono"
                    placeholder="<p>Write your post content here...</p>"
                    />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  {editingPost ? "Save Changes" : "Create Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
