"use client"

import { UserStatsFunctionResponse } from "@/types/api";
import { useUser, SignedIn } from "@clerk/nextjs";
import { useEffect, useState } from "react"

const YourProfile = () => {
    const { user } = useUser();
    const [ stats, setStats ] = useState<UserStatsFunctionResponse>();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`/api/userStats`, { next: { revalidate: 10 } });
                if (!res.ok) throw new Error('Errore nel fetch');
                const data: UserStatsFunctionResponse = await res.json();
                setStats(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchStats();
    }, []);

    return (
        <> 
            <div className="flex flex-col gap-6">
                <SignedIn>
                    <div className="flex flex-row justify-around items-end text-sm text-gray-700 leading-1 gap-3">
                        <div className="flex flex-col mt-6">
                            <span className="block text-gray-500">Username</span>
                            <span className="font-medium text-lg">{stats?.user.username || "Retrieving..."}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="block text-gray-500">Subscription</span>
                            <span className="font-medium text-lg">{stats?.user.subscription?.name ?? "Starter User"}</span>
                        </div>
                    </div>
                    <div className="flex flex-row gap-2">
                        <div className="rounded-xl border p-4 text-center bg-white shadow-sm w-1/3">
                            <div className="text-sm font-semibold text-gray-700">Articles</div>
                            <div className="text-xl font-bold text-black">{stats?.articlesPublished || 0}</div>
                        </div>
                        <div className="rounded-xl border p-4 text-center bg-white shadow-sm w-1/3">
                            <div className="text-sm font-semibold text-gray-700">Comments</div>
                            <div className="text-xl font-bold text-black">{stats?.commentsWritten || 0}</div>
                        </div>
                        <div className="rounded-xl border p-4 text-center bg-white shadow-sm w-1/3">
                            <div className="text-sm font-semibold text-gray-700">Upvotes</div>
                            <div className="text-xl font-bold text-black">{stats?.totalUpvotesReceived || 0}</div>
                        </div>
                    </div>
                </SignedIn>
            </div>
        </>
    )
}

export default YourProfile;