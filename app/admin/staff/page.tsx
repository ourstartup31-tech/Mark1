"use client";

import React, { useState } from "react";
import { Plus, Edit3, Trash2, User } from "lucide-react";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { StaffForm } from "@/components/admin/StaffForm";
import { useAdmin } from "@/context/AdminContext";
import { useToast } from "@/context/ToastContext";

export default function StaffPage() {
    const { staff, addStaff, updateStaff, deleteStaff, searchQuery, isLoading } = useAdmin();
    const { showToast } = useToast();

    const filteredStaff = staff.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<any>(null);
    const [editingStaff, setEditingStaff] = useState<any>(null);

    const handleEdit = (staff: any) => {
        setEditingStaff(staff);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingStaff(null);
        setIsModalOpen(true);
    };

    const confirmDelete = (staff: any) => {
        setSelectedStaff(staff);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (selectedStaff) {
            try {
                await deleteStaff(selectedStaff.id);
                showToast("Staff member removed", "success");
                setIsDeleteModalOpen(false);
            } catch (err) {
                showToast("Failed to remove staff", "error");
            }
        }
    };

    const columns = [
        {
            header: "Staff Member",
            accessor: (item: any) => (
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-bold text-xs uppercase">
                        {item.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                        <p className="font-bold text-black">{item.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{item.email}</p>
                    </div>
                </div>
            )
        },
        { header: "Phone", accessor: "phone" as const },
        {
            header: "Status",
            accessor: (item: any) => (
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${item.status === "Active" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"
                    }`}>
                    {item.status}
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

    if (isLoading && staff.length === 0) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full animate-spin" />
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Loading Staff...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
            {isLoading && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-50 flex items-center justify-center rounded-[3rem]">
                    <div className="w-8 h-8 border-3 border-gray-100 border-t-black rounded-full animate-spin" />
                </div>
            )}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-black tracking-tight">Manage Staff</h1>
                    <p className="text-gray-400 font-medium mt-1 italic">Control who has access to the store management system.</p>
                </div>
                <Button
                    onClick={handleAdd}
                    className="bg-[#D60000] hover:bg-black text-white px-8 py-6 rounded-2xl flex items-center gap-3 transition-all shadow-xl shadow-red-600/10"
                >
                    <Plus size={20} />
                    Add Staff Member
                </Button>
            </div>

            <Table columns={columns} data={filteredStaff} />


            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingStaff ? "Edit Staff Member" : "Add New Staff"}
            >
                <StaffForm
                    initialData={editingStaff}
                    onCancel={() => setIsModalOpen(false)}
                    onSubmit={(data) => {
                        if (editingStaff) {
                            updateStaff({ ...editingStaff, ...data });
                            showToast("Staff updated", "success");
                        } else {
                            addStaff(data);
                            showToast("Staff member added", "success");
                        }
                        setIsModalOpen(false);
                    }}
                />
            </Modal>

            {/* Delete Confirmation */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Remove Staff"
            >
                <div className="space-y-6">
                    <p className="text-gray-500 font-medium">Are you sure you want to remove <span className="text-black font-bold">"{selectedStaff?.name}"</span> from your team? They will lose all dashboard access.</p>
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
                            Confirm Removal
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
