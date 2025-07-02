"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from "react";

interface ProviderProps {
    userId: string;
    children: ReactNode;
}

interface Subscription {
    name: string
}

interface Articles {
    idart: number,
    content: string,
    iduser: number,
    idcat: number
}

export interface User {
    id: string;
    email: string;
    subscription: Subscription;
    articles: Articles[]
}

interface UserContextType {
    user: User;
    loading: boolean;
    error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ userId, children }: ProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('api/user', { 
                    cache: 'no-store', 
                    method: 'POST', 
                    body: JSON.stringify({ id: userId }), 
                    headers: { 'Content-Type': 'application/json' } 
                });

                if(!res.ok) throw new Error("User not found.");

                const data = await res.json();
                setUser(data);
                setError(null);

            } catch(e: any) {
                setError(e.message);
            } finally {
                setLoading(false)
            }
        };
        fetchUser()
    }, [userId])

    return (
        <UserContext.Provider value={{ user: user as User, loading, error }}>
            {children}
        </UserContext.Provider>
    );
}