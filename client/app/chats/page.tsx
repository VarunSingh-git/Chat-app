// app/chats/page.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/context/AuthProvider";

interface Participant {
    _id: string;
    username: string;
}

interface ChatItem {
    _id: string;
    participants: Participant[];
    lastMessage?: { message: string };
}

export default function ChatsPage() {
    const { accessToken, isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const [chats, setChats] = useState<ChatItem[]>([]);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
        console.log(isAuthenticated, accessToken)

        axiosInstance
            .get<ChatItem[]>("/chat", {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
            .then((res) => setChats(res.data));
    }, [isAuthenticated, accessToken]);
    return (
        <div className="max-w-md mx-auto mt-8 px-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-semibold">Chats</h1>
                <button onClick={logout} className="text-sm text-red-500">
                    Logout
                </button>
            </div>

            <ul className="divide-y border rounded">
                {chats.map((chat) => (
                    <li key={chat._id}>
                        <Link href={`/chats/${chat._id}`} className="block p-3 hover:bg-gray-50">
                            <p className="font-medium text-sm">
                                {chat.participants.map((p) => p.username).join(", ")}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {chat.lastMessage?.message ?? "No messages yet"}
                            </p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}