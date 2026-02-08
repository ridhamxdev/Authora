'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';

interface Note {
    id: string;
    title: string;
    content: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

export default function NotesPage() {
    const router = useRouter();
    const { token } = useAuthStore();
    const [notes, setNotes] = useState<Note[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');

    useEffect(() => {
        if (!token) {
            router.push('/login');
            return;
        }
        fetchNotes();
    }, [token]);

    const fetchNotes = async () => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/notes`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNotes(response.data);
        } catch (error) {
            console.error('Failed to fetch notes:', error);
        }
    };

    const createNote = async () => {
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/notes`,
                {
                    title,
                    content,
                    tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setShowCreateModal(false);
            resetForm();
            fetchNotes();
        } catch (error) {
            console.error('Failed to create note:', error);
        }
    };

    const updateNote = async () => {
        if (!editingNote) return;
        try {
            await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/notes/${editingNote.id}`,
                {
                    title,
                    content,
                    tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEditingNote(null);
            resetForm();
            fetchNotes();
        } catch (error) {
            console.error('Failed to update note:', error);
        }
    };

    const deleteNote = async (id: string) => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/notes/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchNotes();
        } catch (error) {
            console.error('Failed to delete note:', error);
        }
    };

    const startEditing = (note: Note) => {
        setEditingNote(note);
        setTitle(note.title);
        setContent(note.content);
        setTags(note.tags.join(', '));
    };

    const resetForm = () => {
        setTitle('');
        setContent('');
        setTags('');
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">My Notes</h1>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition"
                    >
                        <Plus size={20} />
                        Create Note
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes.map((note) => (
                        <div
                            key={note.id}
                            className="bg-zinc-900 rounded-xl p-6 border border-zinc-800"
                        >
                            {editingNote?.id === note.id ? (
                                <div>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 mb-4"
                                    />
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 mb-4 h-32"
                                    />
                                    <input
                                        type="text"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        placeholder="Tags (comma separated)"
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 mb-4"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={updateNote}
                                            className="flex-1 bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                                        >
                                            <Save size={16} />
                                            Save
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingNote(null);
                                                resetForm();
                                            }}
                                            className="bg-zinc-800 px-4 py-2 rounded-lg hover:bg-zinc-700 transition"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">{note.title}</h3>
                                    <p className="text-gray-300 mb-4 line-clamp-3">{note.content}</p>
                                    {note.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {note.tags.map((tag, i) => (
                                                <span
                                                    key={i}
                                                    className="bg-zinc-800 px-3 py-1 rounded-full text-sm"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => startEditing(note)}
                                            className="flex-1 bg-zinc-800 px-4 py-2 rounded-lg hover:bg-zinc-700 transition flex items-center justify-center gap-2"
                                        >
                                            <Edit2 size={16} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteNote(note.id)}
                                            className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <div className="bg-zinc-900 rounded-xl p-8 max-w-2xl w-full">
                            <h2 className="text-2xl font-bold mb-4">Create Note</h2>
                            <input
                                type="text"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 mb-4"
                            />
                            <textarea
                                placeholder="Content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 mb-4 h-48"
                            />
                            <input
                                type="text"
                                placeholder="Tags (comma separated)"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 mb-4"
                            />
                            <div className="flex gap-4">
                                <button
                                    onClick={createNote}
                                    className="flex-1 bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition"
                                >
                                    Create
                                </button>
                                <button
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        resetForm();
                                    }}
                                    className="flex-1 bg-zinc-800 px-6 py-3 rounded-lg hover:bg-zinc-700 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
