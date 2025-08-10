"use client"

import { useUser } from "@clerk/nextjs"
import { Follow } from "@/types/components";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react"
import { PostFollow } from "@/types/api";

interface FollowParams {
    user_id: string;
    btnClassName?: string;
    onUpdate?: () => void;
}

const FollowComponent = ({ user_id, btnClassName, onUpdate }: FollowParams) => {
    const queryClient = useQueryClient();
    const { user } = useUser()

    const { data: follows, isLoading: followLoading } = useQuery<Follow>({
        queryKey: ['follows', user_id],
        queryFn: async () => {
            const res = await fetch(`/api/follow?user_id=${user_id}`);
            if(!res.ok) throw new Error("Fetch Error!");
            return res.json();
        },
        staleTime: 1000 * 10,
        gcTime: 1000 * 3
    })

    const followUser = useMutation({
        mutationFn: async ({ action, data }: PostFollow) => {
            const res = await fetch(`/api/follow`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action,
                    data
                })
            });
            if (!res.ok) throw new Error('Fetch Error!');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['follows', user_id] });
            if (onUpdate) onUpdate();
        }
    });

    const isFollowing = () => {
        if (!follows || !Array.isArray(follows.followers) || !user?.id) {
            return false;
        }

        return follows.followers.some((follower) => follower.user_id != user.id);
    }

    const availableAction = (): [string, boolean] => {
        if(user?.id == user_id) return ["Really? *Laughs*", true];

        if(isFollowing())
            return ["Unfollow", false];
        else return ["Follow", false];
    }

    return (
        <>
            { !user?.id ? 
                <button
                    className={`${isFollowing() ? "btn-secondary" : "btn-primary"} ${btnClassName}`}
                    disabled={availableAction()[1]}
                    onClick={() => {
                        followUser.mutate({
                            action: isFollowing() ? "unfollow" : "follow",
                            data: {
                                followed: user_id
                            }
                        });
                    }}
                >
                    {availableAction()[0]}
                </button> : ''
            }
        </>
    )
}

export default FollowComponent;