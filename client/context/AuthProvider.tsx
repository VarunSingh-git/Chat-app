"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface User {
    _id: string,
    username: string,
    email: string
}

interface AuthContextType {
    user: User | null;
    accessToken: string | null,
    isAuthenticated: boolean;
    login: (userData: User, token: string) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [accessToken, setAccessToken] = useState<string | null>(null)

    const login = (userData: User, token: string) => {
        setUser(userData)
        setAccessToken(token)
    }

    const logout = () => {
        setUser(null)
        setAccessToken(null)
    }

    const value: AuthContextType = {
        user,
        accessToken,
        isAuthenticated: Boolean(accessToken),
        login,
        logout
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


export const useAuth = (): AuthContextType => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used inside an AuthProvider")
    return ctx
}