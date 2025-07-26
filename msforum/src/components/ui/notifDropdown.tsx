"use client"

import { User_Mention_Notification } from "@/types/components";
import { useUser } from "@clerk/nextjs";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

interface NotifDropdownParams {
    type?: 'notifications';
}

const NOTIFICATION: Record<string, string> = {
    'mention_article': "You've been mentioned in a article!",
    'mention_comment': "You've been mentioned in a comment!",

    'upvote_article': "Your article %article_title% has been upvoted! (%upvotes_article%)", 
    'upvote_comment': "Your comment %comment% has been upvoted! (%upvotes_comment%)" // %comment% solo primi 30 char del commento
}

const NotifDropdownComponent = ({ type = 'notifications' }: NotifDropdownParams) => {
    const { user } = useUser();

    const { data: notifications, isLoading, error } = useQuery<User_Mention_Notification[]>({
        queryKey: [type, user?.id],
        queryFn: async () => {
            const res = await fetch(`/api/notifications?user_id=${user?.id}`);
            if(!res.ok) throw new Error('Fetch Error!');
            return res.json();
        },
        enabled: !!user,
        staleTime: 1000 * 10,
        gcTime: 1000 * 10,
    })

    const [ toggle, setToggle ] = useState<boolean>(false)

    const notificationMessage = () => {

    }


    return (
        <>
            <span className="items-center rounded-md text-xl">
                <FontAwesomeIcon icon={faEnvelope} onMouseEnter={() => setToggle(true)} onMouseLeave={() => setTimeout(() => setToggle(false), 500)} /> 
                {/* 
                    TanStack Query to `/api/notifications?user_id=${userInfo.user_id}`,
                    poi apre con un dropdown le notifiche (con scroll controllato, solo ultime 30)
                */}
                <div className={"article-container flex-col fixed right-45 w-90 gap-4 opacity-100 transition-opacity duration-150 " + (!toggle ? 'not-hover:opacity-0 not-[opacity-100]:hidden' : '')}>
                    { /* isLoading ? <p>Notifications are loading...</p> : '' */}
                    { /* error ? <p>There was an error fetching your notification, try reloading the page!</p> : '' */}

                    { notifications && notifications.map((notification) => (
                        <div key={notification.idnotification}>
                            {/* Render notification content here */}
                            <div className="flex flex-row">
                                <p className="font-bold text-primary">Mention</p>
                            </div>
                        </div>
                    ))}
                    <div className="hover:bg-gray-100 rounded-xl p-2">
                        {/* Render notification content here */}
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
                        {/* Render notification content here */}
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