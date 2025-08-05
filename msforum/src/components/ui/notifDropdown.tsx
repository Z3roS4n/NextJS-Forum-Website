"use client"

import { Article } from "@/generated/prisma";
import { User_Mention_Article_Notification } from "@/types/components";
import { useUser } from "@clerk/nextjs";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingComponent from "./Loading";

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
            if (context?.prevData)
                queryClient.setQueryData([type, user?.id], context.prevData);
        },
        onSettled: async () => {
            queryClient.invalidateQueries({
                queryKey: [type, user?.id]
            });
        }
    })

    const [ toggle, setToggle ] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on external click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setToggle(false);
            }
        }
        if (toggle) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [toggle]);

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
        <span className="relative items-center rounded-md text-xl">
            <button
                aria-label="Open notifications"
                className="focus:outline-none"
                onClick={() => setToggle((t) => !t)}
            >
                <FontAwesomeIcon icon={faEnvelope} />
            </button>

            <AnimatePresence>
                {toggle && (
                    <motion.div
                        ref={dropdownRef}
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.18 }}
                        className="z-50 fixed right-0 left-0 lg:right-30 mx-auto mt-4 lg:w-1/5 lg:left-auto bg-white shadow-xl rounded-2xl flex flex-col gap-4 overflow-y-auto p-4 border border-gray-200 w-9/10"
                    >
                        {isLoading && <LoadingComponent/>}
                        {error && <p>There was an error fetching your notification, try reloading the page!</p>}

                        {notifications && notifications.map((notification: User_Mention_Article_Notification, index) => (
                            <div className="flex gap-2" key={index}>
                                <div className="hover:bg-gray-100 rounded-xl p-2 w-full">
                                    <div className="flex flex-row justify-between items-center">
                                        <p className="font-bold text-[#2E3192]">{NOTIFICATION[notification.type][0]}</p>
                                        <p className="text-sm">{notification.created_at.split('T')[0]}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-lg">{ notificationMessage(notification.type, notification.article?.title ?? "") }</p>
                                    </div>
                                    <div className="flex flex-row justify-between">
                                        <span className={"text-sm link-primary cursor-pointer transition-opacity " + (notification.seen ? "opacity-0" : "opacity-100")} onClick={() => markAsRead.mutate(notification.idnotification)}>Mark as read</span>
                                        <Link href={`/articles/${notification.idart}`} className="text-sm self-end link-primary">Go to Article</Link>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="flex flex-row justify-between items-center mt-2">
                            <button className="btn-primary text-lg mr-4 disabled:opacity-0" disabled={true}>Prev</button>
                            <p className="text-xl">1</p>
                            <button className="btn-primary text-lg ml-4">Next</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </span>
    );
}

export default NotifDropdownComponent;