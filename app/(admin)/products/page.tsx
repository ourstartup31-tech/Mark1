"use client";

import React, { useState } from "react";
import { Plus, Search, Edit3, Trash2, ImageIcon } from "lucide-react";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { ProductForm } from "@/components/admin/ProductForm";
import { useAdmin } from "@/context/AdminContext";
import { useToast } from "@/context/ToastContext";

export default function ProductsPage() {
    const { products, categories, addProduct, updateProduct, deleteProduct, searchQuery } = useAdmin();
    const { showToast } = useToast();
    const [activeCategory, setActiveCategory] = useState("All");

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === "All" || p.category === activeCategory;
        return matchesSearch && matchesCategory;
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [editingProduct, setEditingProduct] = useState<any>(null);

    const handleEdit = (product: any) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const confirmDelete = (product: any) => {
        setSelectedProduct(product);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (selectedProduct) {
            deleteProduct(selectedProduct.id);
            showToast("Product deleted successfully", "success");
            setIsDeleteModalOpen(false);
        }
    };

    const columns = [
        {
            header: "Product",
            accessor: (item: any) => (
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 overflow-hidden">
                        {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                            <ImageIcon size={16} className="text-gray-300" />
                        )}
                    </div>
                    <span className="font-bold text-black">{item.name}</span>
                </div>
            )
        },
        { header: "Category", accessor: "category" as const },
        {
            header: "Price",
            accessor: (item: any) => <span className="font-bold">₹{item.price}</span>
        },
        {
            header: "Stock",
            accessor: (item: any) => (
                <span className={`font-bold ${item.inStock ? "text-green-500" : "text-gray-400"}`}>
                    {item.inStock ? "In Stock" : "Out of Stock"}
                </span>
            )
        },
        {
            header: "Actions",
            className: "text-right",
            accessor: (item: any) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => handleEdit(item)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-black transition-colors"
                    >
                        <Edit3 size={16} />
                    </button>
                    <button
                        onClick={() => confirmDelete(item)}
                        className="p-2 hover:bg-red-50 rounded-lg text-gray-300 hover:text-[#D60000] transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-black tracking-tight">Manage Products</h1>
                    <p className="text-gray-400 font-medium mt-1 italic">Add, edit and manage your store inventory.</p>
                </div>
                <Button
                    onClick={handleAdd}
                    className="bg-[#D60000] hover:bg-black text-white px-8 py-6 rounded-2xl flex items-center gap-3 transition-all shadow-xl shadow-red-600/10"
                >
                    <Plus size={20} />
                    Add Product
                </Button>
            </div>

            {/* Only category filter if needed, search is in Header */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center gap-4">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-4">Filter By Category</p>
                <select
                    value={activeCategory}
                    onChange={(e) => setActiveCategory(e.target.value)}
                    className="bg-gray-50 border border-gray-100 rounded-xl px-6 py-3 text-sm font-bold outline-none focus:border-black transition-all"
                >
                    <option value="All">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                </select>
            </div>

            <Table columns={columns} data={filteredProducts} />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingProduct ? "Edit Product" : "Add New Product"}
            >
                <ProductForm
                    initialData={editingProduct}
                    onCancel={() => setIsModalOpen(false)}
                    onSubmit={(data) => {
                        if (editingProduct) {
                            updateProduct({ ...editingProduct, ...data });
                            showToast("Product updated", "success");
                        } else {
                            addProduct(data);
                            showToast("New product added", "success");
                        }
                        setIsModalOpen(false);
                    }}
                />
            </Modal>

            {/* Delete Confirmation */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Product"
            >
                <div className="space-y-6">
                    <p className="text-gray-500 font-medium">Are you sure you want to delete <span className="text-black font-bold">"{selectedProduct?.name}"</span>? This action cannot be undone.</p>
                    <div className="flex gap-4">
                        <Button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="flex-1 bg-gray-50 text-gray-400 font-bold py-4 rounded-xl border border-gray-100 hover:bg-white hover:text-black transition-all"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDelete}
                            className="flex-1 bg-[#D60000] text-white font-bold py-4 rounded-xl hover:bg-black transition-all"
                        >
                            Yes, Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
