"use client"

import { UserStatsFunctionResponse } from "@/types/api";
import { useEffect, useState } from "react";

interface UserStatsParams {
    user_id: string
}

const UserStats = ({ user_id }: UserStatsParams) => {
    const [ stats, setStats ] = useState<UserStatsFunctionResponse>();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`/api/userStats?user_id=${user_id}`, { next: { revalidate: 10 } });
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
        </>
    );
}

export default UserStats;