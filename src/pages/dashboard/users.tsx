import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/api/axios";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/providers/AuthProvider";
import { password } from "bun";
import { Loader } from "lucide-react";

function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded p-6 w-full max-w-md">{children}</div>
    </div>
  );
}

type User = {
  id: string;
  name: string;
  email: string;
  role: "MANAGER" | "MEMBER";
};

export default function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "MEMBER" as "MEMBER" | "MANAGER",
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/auth/users");
      setUsers(res.data.data || []);
    } catch {
      toast.error("Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const changeRole = async (userId: string, role: "MANAGER" | "MEMBER") => {
    try {
      const res = await axiosInstance.put(`/auth/role/${userId}`, { role });
      toast.success(res.data.message || "Role updated");
      fetchUsers();
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to update role";
      toast.error(message);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (newUser.password.length < 6) {
        toast.error("Password must be at least 6 characters long");
        return;
      }
      const res = await axiosInstance.post("/auth/invite", newUser);
      toast.success("User added");
      setModalOpen(false);
      setNewUser({ name: "", email: "", password: "", role: "MEMBER" });
      toast.success(res.data.message || "User added");
      fetchUsers();
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to add user";
      toast.error(message);
    }
  };
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Users</h2>
        <Button onClick={() => setModalOpen(true)}>+ Add User</Button>
      </div>

      {/* Add User Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h3 className="text-lg font-semibold mb-4">Add New User</h3>
        <form className="flex flex-col gap-3" onSubmit={handleAddUser}>
          <input
            type="text"
            placeholder="Name"
            required
            value={newUser.name}
            onChange={(e) =>
              setNewUser((prev) => ({ ...prev, name: e.target.value }))
            }
            className="border p-2 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={newUser.email}
            onChange={(e) =>
              setNewUser((prev) => ({ ...prev, email: e.target.value }))
            }
            className="border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={newUser.password}
            onChange={(e) =>
              setNewUser((prev) => ({ ...prev, password: e.target.value }))
            }
            className="border p-2 rounded"
          />
          <Select
            value={newUser.role}
            onValueChange={(value) =>
              setNewUser((prev) => ({
                ...prev,
                role: value as "MEMBER" | "MANAGER",
              }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MEMBER">Member</SelectItem>
              <SelectItem value="MANAGER">Manager</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add User</Button>
          </div>
        </form>
      </Modal>

      {loading ? (
        <div className="mt-4 w-full flex justify-center text-gray-500">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-4 py-2">Name</th>
                <th className="border border-gray-200 px-4 py-2">Email</th>
                <th className="border border-gray-200 px-4 py-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-4">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="border border-gray-200 px-4 py-2">
                      {user.name}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {user.email}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {user.email === currentUser?.email ? (
                        <span>{user.role}</span>
                      ) : (
                        <Select
                          value={user.role}
                          onValueChange={(value) =>
                            changeRole(user.id, value as "MEMBER" | "MANAGER")
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MEMBER">Member</SelectItem>
                            <SelectItem value="MANAGER">Manager</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
