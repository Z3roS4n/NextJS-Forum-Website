"use client"

import { UserStatsFunctionResponse } from "@/types/api";
import { useUser, SignedIn } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react"
import UserStats from "../profile/other-user/userstats";

const YourProfile = () => {
    const { user } = useUser();

    const { data: stats, isLoading, error } = useQuery<UserStatsFunctionResponse>({
        queryKey: ['user_stats'],
        queryFn: async () => {
            const res = await fetch(`/api/userStats`);
            if(!res.ok) throw new Error('Fetch Error!');
            return res.json();
        },
        staleTime: 1000 * 10,
        gcTime: 1000 * 10,
    });

    return (
        <> 
            <div className="flex flex-col gap-4">
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
                    {user?.id && <UserStats user_id={user.id} />}
                </SignedIn>
            </div>
        </>
    )
}

export default YourProfile;