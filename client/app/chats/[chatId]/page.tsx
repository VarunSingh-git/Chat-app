// app/chats/[chatId]/page.tsx
"use client";
import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { useParams } from "next/navigation";
import { useSocket } from "@/context/SocketProvider";
import { useAuth } from "@/context/AuthProvider";
import axiosInstance from "@/lib/axios";

interface Sender {
    _id: string;
    username: string;
}

interface Message {
    _id: string;
    chatId: string;
    senderId: Sender;
    message: string;
    createdAt?: string;
}

export default function ChatRoom() {
    const { chatId } = useParams<{ chatId: string }>();
    const socket = useSocket()
    const { accessToken } = useAuth()
    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState<string>("");

    // Step A: load old messages once, via REST
    useEffect(() => {
        if (!chatId || !accessToken) return;
        console.log(chatId, accessToken);

        axiosInstance
            .get<Message[]>(`chat/chats/${chatId}/messages`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
            .then((res) => setMessages(res.data));
    }, [chatId, accessToken]);

    // Step B: join the room + listen for new live messages, via socket
    useEffect(() => {
        if (!socket || !chatId) return; // socket not ready yet (still connecting)

        socket.emit("join_chat", chatId);

        const onReceive = (msg: Message) => setMessages((prev) => [...prev, msg]);
        socket.on("receive_message", onReceive);

        return () => {
            socket.emit("leave_chat", chatId);
            socket.off("receive_message", onReceive);
        };
    }, [socket, chatId]);

    // Step C: send a message
    const sendMessage = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!text.trim() || !socket || !chatId) return;
        socket.emit("send_message", { chatId, message: text });
        setText("");
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    };

    return (
        <div className="max-w-md mx-auto mt-8 flex flex-col h-[80vh] border rounded">
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {messages.map((m) => (
                    <p key={m._id} className="text-sm">
                        <b>{m.senderId?.username}:</b> {m.message}
                    </p>
                ))}
            </div>
            <form onSubmit={sendMessage} className="flex border-t p-2 gap-2">
                <input
                    value={text}
                    onChange={handleChange}
                    className="flex-1 border rounded p-2 text-sm"
                    placeholder="Type a message..."
                />
                <button type="submit" className="bg-blue-600 text-white px-4 rounded text-sm">
                    Send
                </button>
            </form>
        </div>
    );
}