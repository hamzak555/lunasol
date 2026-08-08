"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { NotificationDialog } from "@/components/ui/notification-dialog";

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  role?: string;
}

export default function UsersPage() {
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const supabase = createClient();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "standard">("standard");
  const [submitting, setSubmitting] = useState(false);

  // Modal state
  const [userToDelete, setUserToDelete] = useState<{ id: string; email: string } | null>(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    title: string;
    description: string;
    type: 'success' | 'error' | 'info';
  }>({ open: false, title: '', description: '', type: 'info' });

  const showNotification = (title: string, description: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ open: true, title, description, type });
  };

  useEffect(() => {
    getCurrentUser();
    fetchUsers();
  }, []);

  const getCurrentUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();

      if (response.ok && data.users) {
        // Map users to include role from user_metadata
        const mappedUsers = data.users.map((u: any) => ({
          id: u.id,
          email: u.email,
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at,
          role: u.user_metadata?.role || 'standard',
        }));
        setUsers(mappedUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!email) {
        showNotification('Missing Email', 'Please enter an email address', 'error');
        setSubmitting(false);
        return;
      }

      if (!editingUser && !password) {
        showNotification('Missing Password', 'Please enter a password', 'error');
        setSubmitting(false);
        return;
      }

      if (editingUser) {
        // Update existing user
        console.log("Updating user:", email);

        const response = await fetch(`/api/users/${editingUser.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password: password || undefined,
            role,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to update user');
        }

        console.log("User updated:", data);
        showNotification('User Updated', 'User updated successfully!', 'success');
      } else {
        // Create new user
        console.log("Creating user:", email);

        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            role,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create user');
        }

        console.log("User created:", data);
        showNotification('User Created', 'User created successfully!', 'success');
      }

      // Reset form and refresh users
      setEmail("");
      setPassword("");
      setRole("standard");
      setEditingUser(null);
      setShowAddModal(false);
      fetchUsers();
    } catch (error: any) {
      console.error("Error saving user:", error);
      const errorMessage =
        error?.message || "Failed to save user. Please try again.";
      showNotification('Error', `Error: ${errorMessage}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (userToEdit: User) => {
    setEditingUser(userToEdit);
    setEmail(userToEdit.email);
    setPassword("");
    setRole((userToEdit.role as "admin" | "standard") || "standard");
    setShowAddModal(true);
  };

  const handleDelete = (userId: string, userEmail: string) => {
    setUserToDelete({ id: userId, email: userEmail });
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(`/api/users/${userToDelete.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete user');
      }

      fetchUsers();
      showNotification('User Deleted', 'User deleted successfully!', 'success');
    } catch (error: any) {
      console.error("Error deleting user:", error);
      showNotification('Delete Error', `Error: ${error?.message || "Failed to delete user"}`, 'error');
    } finally {
      setUserToDelete(null);
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingUser(null);
    setEmail("");
    setPassword("");
    setRole("standard");
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-8 py-8">
        {/* Add User Button */}
        <div className="mb-8 flex justify-between items-center">
          <h2
            className="text-3xl font-bold"
            style={{
              color: "#806D4B",
              fontFamily: "var(--font-gascogne)",
            }}
          >
            Dashboard Users
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-8 py-3 text-lg font-bold tracking-wide transition-all hover:bg-[#DCD3B8] hover:text-[#2C2C2C] rounded-md"
            style={{
              backgroundColor: "#806D4B",
              color: "#DCD3B8",
              fontFamily: "var(--font-gascogne)",
              border: "2px solid #806D4B",
            }}
          >
            Add User
          </button>
        </div>

        {/* Users Table */}
        <div
          className="rounded-lg overflow-hidden"
          style={{
            backgroundColor: "#0F0F0F",
            border: "1px solid #806D4B",
          }}
        >
          <table className="w-full">
            <thead style={{ backgroundColor: "#2C2C2C" }}>
              <tr>
                <th
                  className="text-left px-6 py-4 font-bold"
                  style={{
                    color: "#806D4B",
                    fontFamily: "var(--font-gascogne)",
                  }}
                >
                  Email
                </th>
                <th
                  className="text-left px-6 py-4 font-bold"
                  style={{
                    color: "#806D4B",
                    fontFamily: "var(--font-gascogne)",
                  }}
                >
                  Created
                </th>
                <th
                  className="text-left px-6 py-4 font-bold"
                  style={{
                    color: "#806D4B",
                    fontFamily: "var(--font-gascogne)",
                  }}
                >
                  Last Sign In
                </th>
                <th
                  className="text-left px-6 py-4 font-bold"
                  style={{
                    color: "#806D4B",
                    fontFamily: "var(--font-gascogne)",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center px-6 py-8"
                    style={{
                      color: "#DCD3B8",
                      fontFamily: "var(--font-pangea)",
                    }}
                  >
                    No users yet. Click "Add User" to create one.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-t"
                    style={{ borderTopColor: "#806D4B" }}
                  >
                    <td
                      className="px-6 py-4"
                      style={{
                        color: "#DCD3B8",
                        fontFamily: "var(--font-pangea)",
                      }}
                    >
                      {u.email}
                      {u.id === user?.id && (
                        <span
                          className="ml-2 text-xs px-2 py-1 rounded"
                          style={{
                            backgroundColor: "#806D4B",
                            color: "#0F0F0F",
                          }}
                        >
                          You
                        </span>
                      )}
                    </td>
                    <td
                      className="px-6 py-4"
                      style={{
                        color: "#DCD3B8",
                        fontFamily: "var(--font-pangea)",
                      }}
                    >
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td
                      className="px-6 py-4"
                      style={{
                        color: "#DCD3B8",
                        fontFamily: "var(--font-pangea)",
                      }}
                    >
                      {u.last_sign_in_at
                        ? new Date(u.last_sign_in_at).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(u)}
                          className="px-4 py-2 text-sm transition-all hover:bg-[#806D4B] rounded-md"
                          style={{
                            color: "#DCD3B8",
                            fontFamily: "var(--font-pangea)",
                            border: "1px solid #806D4B",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(u.id, u.email)}
                          disabled={u.id === user?.id}
                          className="px-4 py-2 text-sm transition-all hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed rounded-md"
                          style={{
                            backgroundColor: "#dc2626",
                            color: "#DCD3B8",
                            fontFamily: "var(--font-pangea)",
                            border: "1px solid #dc2626",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
          onClick={closeModal}
        >
          <div
            className="w-full max-w-md mx-4 p-8 rounded-lg relative"
            style={{
              backgroundColor: "#0F0F0F",
              border: "2px solid #806D4B",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-full transition-all hover:bg-[#806D4B]"
              style={{
                color: "#DCD3B8",
              }}
            >
              <X className="h-5 w-5" />
            </button>

            <h2
              className="text-2xl font-bold mb-6"
              style={{
                color: "#806D4B",
                fontFamily: "var(--font-gascogne)",
              }}
            >
              {editingUser ? "Edit User" : "Add New User"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{
                    color: "#DCD3B8",
                    fontFamily: "var(--font-pangea)",
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="user@example.com"
                  className="w-full px-4 py-3 rounded focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: "#2C2C2C",
                    border: "1px solid #806D4B",
                    color: "#DCD3B8",
                    fontFamily: "var(--font-pangea)",
                  }}
                />
              </div>

              {/* Password */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{
                    color: "#DCD3B8",
                    fontFamily: "var(--font-pangea)",
                  }}
                >
                  Password {editingUser && <span style={{ opacity: 0.7 }}>(Leave blank to keep current)</span>}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!editingUser}
                  placeholder={editingUser ? "Leave blank to keep current password" : "Minimum 6 characters"}
                  minLength={password ? 6 : undefined}
                  className="w-full px-4 py-3 rounded focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: "#2C2C2C",
                    border: "1px solid #806D4B",
                    color: "#DCD3B8",
                    fontFamily: "var(--font-pangea)",
                  }}
                />
              </div>

              {/* Role */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{
                    color: "#DCD3B8",
                    fontFamily: "var(--font-pangea)",
                  }}
                >
                  User Role
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setRole("standard")}
                    className="flex-1 px-4 py-3 rounded-md transition-all"
                    style={{
                      backgroundColor: role === "standard" ? "#806D4B" : "#2C2C2C",
                      border: `2px solid ${role === "standard" ? "#DCD3B8" : "#806D4B"}`,
                      color: "#DCD3B8",
                      fontFamily: "var(--font-pangea)",
                    }}
                  >
                    Standard User
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("admin")}
                    className="flex-1 px-4 py-3 rounded-md transition-all"
                    style={{
                      backgroundColor: role === "admin" ? "#806D4B" : "#2C2C2C",
                      border: `2px solid ${role === "admin" ? "#DCD3B8" : "#806D4B"}`,
                      color: "#DCD3B8",
                      fontFamily: "var(--font-pangea)",
                    }}
                  >
                    Administrator
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-8 py-3 text-lg font-bold tracking-wide transition-all hover:bg-[#DCD3B8] hover:text-[#2C2C2C] disabled:opacity-50 rounded-md"
                  style={{
                    backgroundColor: "#806D4B",
                    color: "#DCD3B8",
                    fontFamily: "var(--font-gascogne)",
                    border: "2px solid #806D4B",
                  }}
                >
                  {submitting
                    ? (editingUser ? "Updating..." : "Creating...")
                    : (editingUser ? "Update User" : "Create User")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent
          style={{
            backgroundColor: "#0F0F0F",
            border: "2px solid #806D4B",
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle
              style={{
                color: "#dc2626",
                fontFamily: "var(--font-gascogne)",
              }}
            >
              Delete User
            </AlertDialogTitle>
            <AlertDialogDescription
              style={{
                color: "#DCD3B8",
                fontFamily: "var(--font-pangea)",
              }}
            >
              Are you sure you want to delete user {userToDelete?.email}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setUserToDelete(null)}
              className="px-6 py-2 text-sm font-medium tracking-wide transition-all hover:opacity-80"
              style={{
                backgroundColor: "transparent",
                color: "#DCD3B8",
                fontFamily: "var(--font-pangea)",
                border: "1px solid #806D4B",
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="px-6 py-2 text-sm font-medium tracking-wide transition-all hover:opacity-80"
              style={{
                backgroundColor: "#dc2626",
                color: "#DCD3B8",
                fontFamily: "var(--font-pangea)",
                border: "1px solid #dc2626",
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Notification Dialog */}
      <NotificationDialog
        open={notification.open}
        onOpenChange={(open) => setNotification({ ...notification, open })}
        title={notification.title}
        description={notification.description}
        type={notification.type}
      />
    </DashboardLayout>
  );
}
