"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  UserPlus,
  Search,
  Shield,
  Pencil,
  Trash2,
  X,
  Check,
  AlertCircle,
} from "lucide-react";

type UserRole = "SUPER_ADMIN" | "ADMIN" | "STAFF" | "BUYER";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
}

interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

const roleLabels: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  STAFF: "Staff",
  BUYER: "Buyer",
};

const roleColors: Record<UserRole, string> = {
  SUPER_ADMIN:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  ADMIN: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  STAFF: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  BUYER: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
};

export function UsersManagement({
  currentUserRole,
}: {
  currentUserRole: UserRole;
}) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    password: "",
    role: "BUYER",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
        setFilteredUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function openModal(user?: User) {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name || "",
        email: user.email,
        password: "",
        role: user.role,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "BUYER",
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({ name: "", email: "", password: "", role: "BUYER" });
    setFormErrors({});
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});

    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : "/api/users";
      const method = editingUser ? "PATCH" : "POST";

      const body: any = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };

      // Only include password if it's provided (required for new users, optional for updates)
      if (formData.password || !editingUser) {
        body.password = formData.password;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        await fetchUsers();
        closeModal();
        router.refresh();
      } else {
        const error = await res.json();
        if (error.details) {
          const errors: Record<string, string> = {};
          error.details.forEach((detail: any) => {
            errors[detail.path[0]] = detail.message;
          });
          setFormErrors(errors);
        } else {
          setFormErrors({ general: error.error || "Failed to save user" });
        }
      }
    } catch (error) {
      setFormErrors({ general: "An error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(userId: string) {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchUsers();
        router.refresh();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to delete user");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  }

  const canEditUser = (user: User) => {
    if (currentUserRole === "SUPER_ADMIN") return true;
    if (currentUserRole === "ADMIN") {
      return user.role !== "SUPER_ADMIN" && user.role !== "ADMIN";
    }
    return false;
  };

  const canDeleteUser = currentUserRole === "SUPER_ADMIN";

  const availableRoles: UserRole[] =
    currentUserRole === "SUPER_ADMIN"
      ? ["SUPER_ADMIN", "ADMIN", "STAFF", "BUYER"]
      : ["STAFF", "BUYER"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            User Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        {currentUserRole === "SUPER_ADMIN" && (
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 rounded-lg bg-[#A5F3FC] px-4 py-2 text-sm font-semibold text-[#0B1220] transition hover:bg-[#67E8F9]"
          >
            <UserPlus className="h-4 w-4" />
            Add User
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search users by name, email, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-border bg-card px-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#A5F3FC] focus:outline-none focus:ring-2 focus:ring-[#A5F3FC]/20"
        />
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">
            Loading users...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {searchTerm
              ? "No users found matching your search."
              : "No users yet."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="transition hover:bg-muted/30">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#A5F3FC] to-[#22D3EE] text-sm font-semibold text-[#0B1220]">
                          {user.name?.charAt(0).toUpperCase() ||
                            user.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="font-medium text-foreground">
                          {user.name || "No name"}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                          roleColors[user.role]
                        }`}
                      >
                        <Shield className="h-3 w-3" />
                        {roleLabels[user.role]}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        {canEditUser(user) && (
                          <button
                            onClick={() => openModal(user)}
                            className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30"
                            title="Edit user"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        )}
                        {canDeleteUser && (
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="rounded-lg p-2 text-red-600 transition hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30"
                            title="Delete user"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg border border-border bg-card shadow-lg">
            <div className="flex items-center justify-between border-b border-border p-6">
              <h2 className="text-xl font-semibold text-foreground">
                {editingUser ? "Edit User" : "Add New User"}
              </h2>
              <button
                onClick={closeModal}
                className="rounded-lg p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formErrors.general && (
                <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{formErrors.general}</span>
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#A5F3FC] focus:outline-none focus:ring-2 focus:ring-[#A5F3FC]/20"
                  placeholder="John Doe"
                  required
                />
                {formErrors.name && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#A5F3FC] focus:outline-none focus:ring-2 focus:ring-[#A5F3FC]/20"
                  placeholder="john@example.com"
                  required
                />
                {formErrors.email && (
                  <p className="mt-1 text-xs text-red-600">
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Password{" "}
                  {editingUser && (
                    <span className="text-muted-foreground">
                      (leave blank to keep current)
                    </span>
                  )}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#A5F3FC] focus:outline-none focus:ring-2 focus:ring-[#A5F3FC]/20"
                  placeholder="••••••••"
                  required={!editingUser}
                />
                {formErrors.password && (
                  <p className="mt-1 text-xs text-red-600">
                    {formErrors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as UserRole,
                    })
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-[#A5F3FC] focus:outline-none focus:ring-2 focus:ring-[#A5F3FC]/20"
                  required
                >
                  {availableRoles.map((role) => (
                    <option key={role} value={role}>
                      {roleLabels[role]}
                    </option>
                  ))}
                </select>
                {formErrors.role && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.role}</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#A5F3FC] px-4 py-2 text-sm font-semibold text-[#0B1220] transition hover:bg-[#67E8F9] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    "Saving..."
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      {editingUser ? "Update" : "Create"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
