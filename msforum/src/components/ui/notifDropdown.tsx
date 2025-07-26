"use client"

import { Article } from "@/generated/prisma";
import { User_Mention_Article_Notification } from "@/types/components";
import { useUser } from "@clerk/nextjs";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

interface NotifDropdownParams {
    type?: 'notifications';
}

const NOTIFICATION: Record<string, string[]> = {
    'mention_article': ["You got mentioned!", "You've been mentioned in a article!"],
    'mention_comment': ["You got mentioned!", "You've been mentioned in a comment!"],

    'comment_to_article': ["New comment!", "Someone wrote a comment under your article!"],

    'upvote_article': ["Uh oh, an upvote!", "Your article %article_title% has been upvoted!"], 
    'upvote_comment': ["Someone likes you... me!", "Your comment to %article_title% has been upvoted!"] // %comment% solo primi 30 char del commento
}

const NotifDropdownComponent = ({ type = 'notifications' }: NotifDropdownParams) => {
    const { user } = useUser();
    
    const queryClient = useQueryClient();

    const [ filter, setFilter ] = useState<string>('latest');

    const { data: notifications, isLoading, error } = useQuery<User_Mention_Article_Notification[]>({
        queryKey: [type, user?.id],
        queryFn: async () => {
            const res = await fetch(`/api/notifications?filter=${filter}`);
            if(!res.ok) throw new Error('Fetch Error!');
            return res.json();
        },
        enabled: !!user,
        staleTime: 1000 * 10,
        gcTime: 1000 * 10,
    })

    const markAsRead = useMutation({
        mutationFn: async (notifId: number, action = 'set_read') => {
            const res = await fetch(`/api/notifications`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: action,
                    notifications_ids: [notifId]
                })
            })
            if(!res.ok) throw new Error('Fetch Error!');
            return res.json();
        },
        onMutate: async (notifId: number) => {
            await queryClient.cancelQueries({ queryKey: [type, user?.id] });
            const prevData = queryClient.getQueryData<User_Mention_Article_Notification[]>([type, user?.id]);
            
            // Optimistic update
            if (prevData) {
                const updatedData = prevData.map(notif =>
                    notif.idnotification === notifId
                        ? { ...notif, seen: true }
                        : notif
                );
                queryClient.setQueryData([type, user?.id], updatedData);
            }
            return { prevData };
        },
        onError: (_err, _notifId, context) => {
            // Rollback on error
            if (context?.prevData)
                queryClient.setQueryData([type, user?.id], context.prevData);
        },
        onSettled: async () => {
            queryClient.invalidateQueries({
                queryKey: [type, user?.id]
            });
        }
    })

    const [ toggle, setToggle ] = useState<boolean>(false)

    const notificationMessage = (type: string, article: string ) => {
        const original = NOTIFICATION[type][1];
        const variables = {
            upvote_article: ['%article_title%'],
            upvote_comment: ['%article_title%']
        }

        // Example: replace %article_title% with article?.title if available
        let transformed = original;
        if (type === 'upvote_article' && article)
            transformed = original.replace('%article_title%', article || '');
        else if (type === 'upvote_comment' && article)
            transformed = original.replace('%article_title%', article || '');
        

        return transformed;
    }


    return (
        <>
            <span className="items-center rounded-md text-xl">
                <FontAwesomeIcon icon={faEnvelope} onMouseEnter={() => setToggle(true)} onMouseLeave={() => setTimeout(() => setToggle(false), 500)} /> 
                {/* 
                    TanStack Query to `/api/notifications?user_id=${userInfo.user_id}`,
                    poi apre con un dropdown le notifiche (con scroll controllato, solo ultime 30)
                */}
                <div className={"article-container flex-col fixed lg:right-45 w-90 gap-4 opacity-100 transition-opacity duration-150 " + (!toggle ? 'not-hover:hidden' : '')}>
                    { /* isLoading ? <p>Notifications are loading...</p> : '' */}
                    { /* error ? <p>There was an error fetching your notification, try reloading the page!</p> : '' */}

                    { notifications && notifications.map((notification: User_Mention_Article_Notification, index) => (
                        <>
                            <div className="hover:bg-gray-100 rounded-xl p-2" key={index}>
                                <div className="flex flex-row justify-between items-center">
                                    <p className="font-bold text-[#2E3192]">{NOTIFICATION[notification.type][0]}</p>
                                    <p className="text-sm">{notification.created_at.split('T')[0]}</p>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-lg">{ notificationMessage(notification.type, notification.article?.title ?? "") }</p>
                                </div>
                                <div className="flex flex-row justify-between">
                                    <span className={"text-sm link-primary " + (notification.seen ? "opacity-0" : "opacity-100")} onClick={() => markAsRead.mutate(notification.idnotification)}>Mark as read</span>
                                    <Link href={`/articles/${notification.idart}`} className="text-sm self-end link-primary">Go to Article</Link>
                                </div>
                            </div>
                            <hr />
                        </>
                    ))}

                    {/* <div className="hover:bg-gray-100 rounded-xl p-2">
                        {/* Render notification content here
                        <div className="flex flex-row justify-between items-center">
                            <p className="font-bold text-[#2E3192]">Mention</p>
                            <p className="text-sm">12:03PM</p>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-lg">{ NOTIFICATION['mention_article']}</p>
                        </div>
                        <div className="flex flex-col">
                            <Link href='/article/32' className="text-sm self-end link-primary">Go to Article</Link>
                        </div>
                    </div>
                    <hr />
                    <div className="hover:bg-gray-100 rounded-xl p-2">
                        {/* Render notification content here
                        <div className="flex flex-row justify-between items-center">
                            <p className="font-bold text-[#2E3192]">Upvote</p>
                            <p className="text-sm">12:03PM</p>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-lg">{ NOTIFICATION['upvote_comment']}</p>
                        </div>
                        <div className="flex flex-col">
                            <Link href='/article/32' className="text-sm self-end link-primary">Go to Article</Link>
                        </div>
                    </div>
                    */}
                    
                    <div className="flex flex-row justify-between items-center">
                        <button className="btn-primary text-lg mr-4 disabled:opacity-0" disabled={true}>Prev</button>
                        <p className="text-xl">1</p>
                        <button className="btn-primary text-lg ml-4">Next</button>
                    </div>
                </div>
            </span>
        </>
    )
}

export default NotifDropdownComponent;