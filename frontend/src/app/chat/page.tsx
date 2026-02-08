'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';
import { Send, Bot, User } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatPage() {
    const router = useRouter();
    const { token } = useAuthStore();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim() || !token) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/rag/chat`,
                { query: input },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const assistantMessage: Message = {
                role: 'assistant',
                content: response.data.response,
            };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat failed:', error);
            const errorMessage: Message = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <div className="border-b border-zinc-800 p-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">AI Chat</h1>
                        <p className="text-sm text-gray-400">Ask me about your notes and wishlists</p>
                    </div>
                    <button
                        onClick={() => router.push('/notes')}
                        className="text-sm text-gray-400 hover:text-white"
                    >
                        View Notes
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-4xl mx-auto space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center text-gray-500 mt-20">
                            <Bot size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Start a conversation! Ask me anything about your notes or wishlists.</p>
                        </div>
                    )}
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'
                                }`}
                        >
                            {message.role === 'assistant' && (
                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                                    <Bot size={18} />
                                </div>
                            )}
                            <div
                                className={`max-w-[70%] rounded-xl p-4 ${message.role === 'user'
                                        ? 'bg-white text-black'
                                        : 'bg-zinc-900 border border-zinc-800'
                                    }`}
                            >
                                <p className="whitespace-pre-wrap">{message.content}</p>
                            </div>
                            {message.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                                    <User size={18} className="text-black" />
                                </div>
                            )}
                        </div>
                    ))}
                    {loading && (
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                                <Bot size={18} />
                            </div>
                            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="border-t border-zinc-800 p-4">
                <div className="max-w-4xl mx-auto flex gap-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Ask me anything..."
                        className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3"
                        disabled={loading}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={loading || !input.trim()}
                        className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 flex items-center gap-2"
                    >
                        <Send size={20} />
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
