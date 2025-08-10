"use client"

import BoxLabeledText from "@/components/ui/boxLabeledText";
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
        <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
                <BoxLabeledText head='Followers'>{!error ? stats?.followers || 0 : 'Error' }</BoxLabeledText>
                <BoxLabeledText head='Following'>{!error ? stats?.followers || 0 : 'Error' }</BoxLabeledText>
            </div>
            <div className="flex flex-row gap-2">
                <BoxLabeledText head='Articles'>{!error ? stats?.articlesPublished || 0 : 'Error'}</BoxLabeledText>
                <BoxLabeledText head='Comments'>{!error ? stats?.commentsWritten || 0 : 'Error'}</BoxLabeledText>
                <BoxLabeledText head='Upvotes'>{!error ? stats?.totalUpvotesReceived || 0 : 'Error'}</BoxLabeledText>  
            </div>

        </div>
    );
}

export default UserStats;