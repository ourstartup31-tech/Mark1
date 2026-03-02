"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/Select";
import { Toggle } from "@/components/ui/Toggle";
import { Upload, X, ImageIcon } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

interface ProductFormProps {
    initialData?: any;
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

export function ProductForm({ initialData, onSubmit, onCancel }: ProductFormProps) {
    const { categories } = useAdmin();
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        category: initialData?.category || (categories[0]?.name || ""),
        price: initialData?.price || "",
        stock: initialData?.stock || "",
        unit: initialData?.unit || "per kg",
        inStock: initialData?.inStock ?? true,
        image: initialData?.image || ""
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock)
        });
    };

    const categoryOptions = categories.map(cat => ({
        label: cat.name,
        value: cat.name
    }));

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
                <Input
                    label="Product Name"
                    placeholder="e.g. Fresh Bananas"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                />

                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Category"
                        options={categoryOptions}
                        value={formData.category}
                        onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                        required
                    />
                    <Input
                        label="Price (₹)"
                        type="number"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Stock Quantity"
                        type="number"
                        placeholder="0"
                        value={formData.stock}
                        onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                        required
                    />
                    <Input
                        label="Unit (e.g. per kg)"
                        placeholder="per kg"
                        value={formData.unit}
                        onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Product Image</label>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />

                    {formData.image ? (
                        <div className="relative group rounded-2xl overflow-hidden border-2 border-gray-100 aspect-video">
                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
                                    className="p-3 bg-white rounded-full text-red-500 hover:scale-110 transition-transform"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-gray-50/30 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer group"
                        >
                            <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                                <Upload size={20} className="text-gray-400" />
                            </div>
                            <p className="text-xs font-bold text-gray-400">Click to upload or drag and drop</p>
                        </div>
                    )}
                </div>

                <Toggle
                    label="Product is in stock"
                    enabled={formData.inStock}
                    onChange={(enabled) => setFormData(prev => ({ ...prev, inStock: enabled }))}
                />
            </div>

            <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" className="flex-1 py-6 rounded-2xl border-2" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" className="flex-1 py-6 rounded-2xl bg-[#D60000] hover:bg-black transition-all">
                    {initialData ? "Save Changes" : "Create Product"}
                </Button>
            </div>
        </form>
    );
}
