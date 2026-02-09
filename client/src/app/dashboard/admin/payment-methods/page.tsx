"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Check, X, CreditCard, Wallet, Banknote } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

interface PaymentMethod {
  id: string;
  title: string;
  type: 'bank' | 'wallet' | 'other';
  details: string;
  instructions: string;
  is_active: number; // 0 or 1
}

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    type: "bank",
    details: "",
    instructions: "",
    is_active: true
  });

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    try {
      const res = await api.get('/payment-methods/admin');
      setMethods(res.data.paymentMethods);
    } catch (e) {
      console.error(e);
      toast.error("Failed to fetch payment methods");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMethod) {
        await api.put(`/payment-methods/admin/${editingMethod.id}`, formData);
        toast.success("Payment method updated");
      } else {
        await api.post('/payment-methods/admin', formData);
        toast.success("Payment method created");
      }
      setIsModalOpen(false);
      setEditingMethod(null);
      resetForm();
      fetchMethods();
    } catch (e) {
      console.error(e);
      toast.error("Failed to save payment method");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this payment method?")) return;
    try {
      await api.delete(`/payment-methods/admin/${id}`);
      toast.success("Payment method deleted");
      fetchMethods();
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete payment method");
    }
  };

  const openEdit = (method: PaymentMethod) => {
    setEditingMethod(method);
    setFormData({
      title: method.title,
      type: method.type,
      details: method.details,
      instructions: method.instructions || "",
      is_active: method.is_active === 1
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      type: "bank",
      details: "",
      instructions: "",
      is_active: true
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'bank': return <Banknote className="h-5 w-5" />;
      case 'wallet': return <Wallet className="h-5 w-5" />;
      default: return <CreditCard className="h-5 w-5" />;
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payment Instructions</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manage payment methods shown to users when upgrading.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingMethod(null);
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Method
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {methods.map((method) => (
          <div
            key={method.id}
            className="relative rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                  {getIcon(method.type)}
                </div>
                <div>
                  <h3 className="font-semibold">{method.title}</h3>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    method.is_active 
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}>
                    {method.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(method)}
                  className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(method.id)}
                  className="rounded-lg p-2 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                <p className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">Details</p>
                <p className="text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap font-mono text-xs">{method.details}</p>
              </div>
              {method.instructions && (
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">Instructions</p>
                  <p className="text-zinc-600 dark:text-zinc-400 line-clamp-2">{method.instructions}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">{editingMethod ? "Edit Method" : "Add Method"}</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-800"
                  placeholder="e.g. Bank Transfer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value as any})}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-800"
                >
                  <option value="bank">Bank Transfer</option>
                  <option value="wallet">Digital Wallet</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Account Details</label>
                <textarea
                  required
                  value={formData.details}
                  onChange={e => setFormData({...formData, details: e.target.value})}
                  rows={3}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 font-mono"
                  placeholder="Bank Name: xxx&#10;Account No: xxx"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Instructions (Optional)</label>
                <textarea
                  value={formData.instructions}
                  onChange={e => setFormData({...formData, instructions: e.target.value})}
                  rows={2}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-800"
                  placeholder="Additional notes for the user..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={e => setFormData({...formData, is_active: e.target.checked})}
                  className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="is_active" className="text-sm font-medium">Active</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-lg border border-zinc-200 py-2.5 text-sm font-semibold hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  {editingMethod ? "Save Changes" : "Create Method"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
