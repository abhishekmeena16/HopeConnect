import { useState, useEffect, useRef, useCallback } from 'react';
import { 
    Send, 
    MessageSquare, 
    Package, 
    ArrowLeft,
    Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getConversations, getMessages, sendMessage } from '../services/messageService';

export default function LogisticsChat({ currentUser, initialPartner, initialResource, onClose }) {
    const [threads, setThreads] = useState([]);
    const [activePartner, setActivePartner] = useState(initialPartner || null);
    const [activeResource, setActiveResource] = useState(initialResource || null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [loadingThreads, setLoadingThreads] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    // Fetch conversation threads list
    const fetchThreads = useCallback(async () => {
        try {
            setLoadingThreads(true);
            const data = await getConversations();
            setThreads(data);

            if (initialPartner && !data.some(t => t.partner.id === initialPartner.id)) {
                setActivePartner(initialPartner);
            } else if (!activePartner && data.length > 0) {
                setActivePartner(data[0].partner);
                setActiveResource(data[0].resource || null);
            }
        } catch (error) {
            console.error('Failed to load threads:', error);
        } finally {
            setLoadingThreads(false);
        }
    }, [initialPartner, activePartner]);

    // Fetch messages for active partner
    const fetchChatMessages = useCallback(async () => {
        if (!activePartner) return;
        try {
            setLoadingMessages(true);
            const data = await getMessages({ otherUserId: activePartner.id });
            setMessages(data);
        } catch (error) {
            console.error('Failed to load messages:', error);
        } finally {
            setLoadingMessages(false);
        }
    }, [activePartner]);

    useEffect(() => {
        fetchThreads();
    }, [fetchThreads]);

    useEffect(() => {
        if (activePartner) {
            fetchChatMessages();
        }
    }, [activePartner, fetchChatMessages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (textToSend) => {
        const text = textToSend || inputText;
        if (!text || !text.trim() || !activePartner) return;

        try {
            setSending(true);
            const res = await sendMessage({
                content: text.trim(),
                receiverId: activePartner.id,
                resourceId: activeResource?.id || undefined
            });

            setMessages(prev => [...prev, res]);
            setInputText('');
            // Refresh threads list silently
            getConversations().then(setThreads).catch(() => {});
        } catch (error) {
            console.error('Send error:', error);
            toast.error('Failed to send message.');
        } finally {
            setSending(false);
        }
    };

    const quickReplies = [
        "What time can the pickup vehicle arrive?",
        "Driver contact is assigned. En route now.",
        "Please confirm the entrance gate / drop-off bay.",
        "Supplies packaged and verified. Ready for handover!"
    ];

    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row h-[620px]">
            {/* Left Thread List */}
            <div className={`w-full md:w-80 border-r border-slate-100 flex flex-col bg-slate-50/50 ${activePartner ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
                    <div>
                        <h3 className="font-bold font-heading text-slate-900 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-blue-600" />
                            Logistics Coordination
                        </h3>
                        <p className="text-[11px] text-slate-500">Direct courier & delivery coordination</p>
                    </div>
                    {onClose && (
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm md:hidden">
                            ✕
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
                    {loadingThreads ? (
                        <div className="p-8 text-center text-xs text-slate-400">Loading threads...</div>
                    ) : threads.length === 0 && !activePartner ? (
                        <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                            <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <p>No active logistics conversations yet.</p>
                            <p className="text-[11px] text-slate-400">Click "Message" on any resource or aid need to begin.</p>
                        </div>
                    ) : (
                        threads.map(thread => {
                            const isSelected = activePartner?.id === thread.partner.id;
                            return (
                                <button
                                    key={thread.partner.id}
                                    onClick={() => {
                                        setActivePartner(thread.partner);
                                        setActiveResource(thread.resource || null);
                                    }}
                                    className={`w-full p-3 rounded-2xl text-left transition-all flex items-start gap-3 ${
                                        isSelected 
                                            ? 'bg-blue-50/80 border border-blue-200/80 shadow-xs' 
                                            : 'hover:bg-slate-100 border border-transparent'
                                    }`}
                                >
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                                        {thread.partner.name?.[0]?.toUpperCase() || 'U'}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-xs text-slate-900 truncate">
                                                {thread.partner.name}
                                            </span>
                                            {thread.unreadCount > 0 && (
                                                <span className="w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                                    {thread.unreadCount}
                                                </span>
                                            )}
                                        </div>

                                        <span className="text-[10px] font-semibold text-slate-400 uppercase">
                                            {thread.partner.role}
                                        </span>

                                        <p className="text-xs text-slate-500 truncate mt-0.5">
                                            {thread.lastMessage?.content || 'Started conversation'}
                                        </p>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Right Chat Thread Panel */}
            <div className={`flex-1 flex flex-col bg-white ${!activePartner ? 'hidden md:flex' : 'flex'}`}>
                {activePartner ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setActivePartner(null)}
                                    className="p-1 text-slate-500 hover:text-slate-800 md:hidden"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                </button>

                                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                                    {activePartner.name?.[0]?.toUpperCase() || 'U'}
                                </div>

                                <div>
                                    <h4 className="font-bold text-sm text-slate-900 leading-tight">
                                        {activePartner.name}
                                    </h4>
                                    <span className="text-[10px] font-semibold text-blue-600 uppercase">
                                        {activePartner.role} {activePartner.location ? `• ${activePartner.location}` : ''}
                                    </span>
                                </div>
                            </div>

                            {activeResource && (
                                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 max-w-xs truncate">
                                    <Package className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                    <span className="truncate">{activeResource.title}</span>
                                </div>
                            )}
                        </div>

                        {/* Messages Stream */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/40">
                            {loadingMessages ? (
                                <div className="text-center py-12 text-xs text-slate-400">Loading logistics channel...</div>
                            ) : messages.length === 0 ? (
                                <div className="text-center py-16 space-y-2 text-slate-400">
                                    <p className="text-xs">No previous messages with {activePartner.name}.</p>
                                    <p className="text-[11px] text-slate-400">Send an arrival time or coordinate pickup logistics below.</p>
                                </div>
                            ) : (
                                messages.map(msg => {
                                    const isMe = msg.senderId === currentUser?.id;
                                    const timeStr = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                                        >
                                            <div
                                                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-xs ${
                                                    isMe
                                                        ? 'bg-blue-600 text-white rounded-br-xs'
                                                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                                                }`}
                                            >
                                                <p className="leading-relaxed">{msg.content}</p>
                                            </div>

                                            <span className="text-[10px] text-slate-400 mt-1 px-1">
                                                {timeStr} {isMe && (msg.read ? '• Read' : '• Sent')}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Prompts Bar */}
                        <div className="px-4 py-2 border-t border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto text-[11px]">
                            <span className="text-slate-400 flex items-center gap-1 shrink-0 font-medium">
                                <Sparkles className="w-3 h-3 text-amber-500" /> Quick:
                            </span>
                            {quickReplies.map((reply, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSend(reply)}
                                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg whitespace-nowrap transition-colors"
                                >
                                    {reply}
                                </button>
                            ))}
                        </div>

                        {/* Input Box */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSend();
                            }}
                            className="p-3 border-t border-slate-200 bg-white flex items-center gap-2"
                        >
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Type logistics or pickup update..."
                                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                            <button
                                type="submit"
                                disabled={sending || !inputText.trim()}
                                className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-all disabled:opacity-40"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
                        <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-300">
                            <MessageSquare className="w-8 h-8" />
                        </div>
                        <h4 className="font-bold text-slate-700">Select a Logistics Thread</h4>
                        <p className="text-xs text-slate-400 max-w-sm">
                            Coordinate directly with donors, courier drivers, and receiving relief teams in real-time.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
