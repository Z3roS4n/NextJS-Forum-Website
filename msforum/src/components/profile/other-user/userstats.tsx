"use client"

import { UserStatsFunctionResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface UserStatsParams {
    user_id: string
}

const UserStats = ({ user_id }: UserStatsParams) => {
    const { data: stats, error } = useQuery<UserStatsFunctionResponse>({
        queryKey: ['userStats', user_id],
        queryFn: async () => {
            const res = await fetch(`/api/userStats?user_id=${user_id}`);
            if (!res.ok) throw new Error('Errore nel fetch');
            return res.json();
        },
        enabled: !!user_id, // evita fetch se user_id non c'è
        staleTime: 1000 * 10,
        gcTime: 1000 * 10, // 10 seconds alive
    });
    
    return (
        <>
            <div className="rounded-xl border p-4 text-center bg-white shadow-sm w-1/3">
                <div className="text-sm font-semibold text-gray-700">Articles</div>
                <div className="text-xl font-bold text-black">{!error ? stats?.articlesPublished || 0 : 'Error'}</div>
            </div>
            <div className="rounded-xl border p-4 text-center bg-white shadow-sm w-1/3">
                <div className="text-sm font-semibold text-gray-700">Comments</div>
                <div className="text-xl font-bold text-black">{!error ? stats?.commentsWritten || 0 : 'Error'}</div>
            </div>
            <div className="rounded-xl border p-4 text-center bg-white shadow-sm w-1/3">
                <div className="text-sm font-semibold text-gray-700">Upvotes</div>
                <div className="text-xl font-bold text-black">{!error ? stats?.totalUpvotesReceived || 0 : 'Error'}</div>
            </div>
        </>
    );
}

export default UserStats;