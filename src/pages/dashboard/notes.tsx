import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/api/axios";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import UpgradePlanModal from "@/components/upgrade-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/providers/AuthProvider";
import { Loader } from "lucide-react";

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

type Tenant = {
  slug: string;
  plan: "FREE" | "PRO";
};

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteForm, setNoteForm] = useState({ title: "", content: "" });
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const { user } = useAuth();

  const fetchTenant = async () => {
    try {
      const res = await axiosInstance.get("/auth/tenants/me");
      console.log(res.data.tenant);
      setTenant(res.data.tenant);
    } catch {
      toast.error("Failed to load tenant info");
    }
  };

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/notes");
      setNotes(res.data.data || []);
    } catch {
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenant();
    fetchNotes();
  }, []);

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingNote) {
        const res = await axiosInstance.put(
          `/notes/${editingNote.id}`,
          noteForm
        );
        toast.success(res.data.message || "Note updated successfully");
      } else {
        await axiosInstance.post("/notes", noteForm);
        toast.success("Note created successfully");
      }

      setModalOpen(false);
      setEditingNote(null);
      setNoteForm({ title: "", content: "" });
      fetchNotes();
    } catch (err: any) {
      if (err.response?.data?.code === "MAX_NOTES_REACHED") {
        if (user.role === "MEMBER") {
          toast.error(
            err.response.data.message ||
              "You have reached the maximum number of notes"
          );
        } else {
          setModalOpen(false);
          try {
            const tenantRes = await axiosInstance.get("/auth/tenants/me");
            setTenant(tenantRes.data.tenant);
            setUpgradeOpen(true);
          } catch {
            toast.error("Failed to fetch tenant info for upgrade");
          }
        }
        return;
      }
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteForm({ title: note.title, content: note.content });
    setModalOpen(true);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    try {
      const res = await axiosInstance.delete(`/notes/${noteId}`);
      toast.success(res.data.message || "Note deleted successfully");
      fetchNotes();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to delete note";
      toast.error(message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Notes</h2>
        <Button onClick={() => setModalOpen(true)}>+ Add Note</Button>
      </div>

      {/* Notes Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md w-full max-w-full overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {editingNote ? "Edit Note" : "Add New Note"}
            </DialogTitle>
          </DialogHeader>
          <form
            className="flex flex-col gap-3 mt-4 w-full"
            onSubmit={handleSaveNote}
          >
            <Input
              placeholder="Title"
              value={noteForm.title}
              required
              className="w-full"
              onChange={(e) =>
                setNoteForm((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            <Textarea
              placeholder="Content"
              value={noteForm.content}
              required
              rows={5}
              className="resize-y overflow-auto break-words w-full"
              onChange={(e) =>
                setNoteForm((prev) => ({ ...prev, content: e.target.value }))
              }
            />
            <div className="flex justify-end gap-2 mt-2 flex-wrap">
              <Button
                type="button"
                onClick={() => {
                  setModalOpen(false);
                  setEditingNote(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">{editingNote ? "Update" : "Create"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Upgrade Plan Modal */}
      <UpgradePlanModal
        isOpen={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        tenant={tenant}
        onUpgradeSuccess={fetchTenant}
      />

      {loading ? (
        <div className="mt-4 w-full flex justify-center text-gray-500">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto mt-4 w-full">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-4 py-2">Title</th>
                <th className="border border-gray-200 px-4 py-2">Content</th>
                <th className="border border-gray-200 px-4 py-2">Created At</th>
                <th className="border border-gray-200 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {notes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    No notes found.
                  </td>
                </tr>
              ) : (
                notes.map((note) => (
                  <tr key={note.id} className="break-words">
                    <td className="border border-gray-200 px-4 py-2 max-w-xs truncate">
                      {note.title}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 max-w-xs break-words">
                      {note.content}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {new Date(note.createdAt).toLocaleString()}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-center flex gap-2 justify-center flex-wrap">
                      <Button size="sm" onClick={() => handleEditNote(note)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        Delete
                      </Button>
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
