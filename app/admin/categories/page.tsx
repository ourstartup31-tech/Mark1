"use client";

import React, { useState } from "react";
import { Plus, Edit3, Trash2, ListTree } from "lucide-react";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/input";

import { useAdmin } from "@/context/AdminContext";
import { useToast } from "@/context/ToastContext";

export default function CategoriesPage() {
    const { categories, addCategory, updateCategory, deleteCategory, searchQuery } = useAdmin();
    const { showToast } = useToast();

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [catName, setCatName] = useState("");

    const handleAdd = () => {
        setEditingCategory(null);
        setCatName("");
        setIsModalOpen(true);
    };

    const handleEdit = (category: any) => {
        setEditingCategory(category);
        setCatName(category.name);
        setIsModalOpen(true);
    };

    const confirmDelete = (category: any) => {
        setSelectedCategory(category);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (selectedCategory) {
            deleteCategory(selectedCategory.id);
            showToast(`Category "${selectedCategory.name}" removed`, "success");
            setIsDeleteModalOpen(false);
        }
    };

    const columns = [
        {
            header: "Category Name",
            accessor: (item: any) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                        <ListTree size={14} />
                    </div>
                    <span className="font-bold text-black">{item.name}</span>
                </div>
            )
        },
        {
            header: "Number of Products",
            accessor: (item: any) => <span className="text-gray-400 font-bold">{item.count ?? 0} Items</span>
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
                    <h1 className="text-4xl font-bold text-black tracking-tight">Manage Categories</h1>
                    <p className="text-gray-400 font-medium mt-1 italic">Organize your products into logical groups.</p>
                </div>
                <Button
                    onClick={handleAdd}
                    className="bg-black hover:bg-[#D60000] text-white px-8 py-6 rounded-2xl flex items-center gap-3 transition-all"
                >
                    <Plus size={20} />
                    Add Category
                </Button>
            </div>

            <Table columns={columns} data={filteredCategories} />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingCategory ? "Edit Category" : "Add Category"}
            >
                <form
                    className="space-y-6"
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (editingCategory) {
                            updateCategory({ ...editingCategory, name: catName });
                            showToast(`Category "${catName}" updated`, "success");
                        } else {
                            addCategory({ name: catName, emoji: "📁" });
                            showToast(`Category "${catName}" added`, "success");
                        }
                        setCatName("");
                        setIsModalOpen(false);
                    }}
                >
                    <Input
                        label="Category Name"
                        placeholder="e.g. Frozen Food"
                        required
                        value={catName}
                        onChange={(e) => setCatName(e.target.value)}
                    />

                    <div className="flex gap-4 pt-4">
                        <Button type="button" variant="outline" className="flex-1 py-6 rounded-2xl border-2" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!catName.trim()} className="flex-1 py-6 rounded-2xl bg-[#D60000] hover:bg-black transition-all">
                            {editingCategory ? "Save Changes" : "Create Category"}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Category"
            >
                <div className="space-y-6">
                    <p className="text-gray-500 font-medium">Are you sure you want to delete <span className="text-black font-bold">"{selectedCategory?.name}"</span>? All products in this category will remain, but the category itself will be removed.</p>
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
                            Confirm Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
