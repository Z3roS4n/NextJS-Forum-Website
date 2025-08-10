"use client"

import { Comment_Author_Subscription, Comment_Upvotes } from "@/types/components";
//import { currentUser } from "@clerk/nextjs/server";
import { useUser } from "@clerk/nextjs"
import Link from "next/link";
import { useError } from "@/app/context/ErrorContext";
import CommentWriter from "./commentWriter";
import { useState } from "react";

import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UpvoteComment } from "@/generated/prisma";

import { faCircleUp, faCircleDown, faReply, faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingComponent from "../ui/loading";

const CommentHandler = () => {
    const { article }  = useParams()
    const router = useRouter();
    const { user } = useUser();
    const { showError } = useError();
    const queryClient = useQueryClient();
    const [replyWriter, setReplyWriter] = useState<{ [idcomment: number]: boolean }>({})
    const [showReplies, setShowReplies] = useState<{ [idcomment: number]: boolean }>({})

    const toggleReplyWriter = (idcomment: number) => {
        setReplyWriter(prev => ({
            ...prev,
            [idcomment]: !prev[idcomment]
        }));
    };

    const toggleShowReplies = (idcomment: number) => {
        setShowReplies(prev => ({
            ...prev,
            [idcomment]: !prev[idcomment]
        }));
    };

    const toggleUpvote = useMutation({
        mutationFn: async (idcomment: number, action = 'toggle_upvote') => {
            const res = await fetch(`/api/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: action,
                    data: {
                        idcomment: idcomment
                    }
                })
            })
            if(!res.ok) throw new Error('Fetch Error!');
            return res.json();
        },
        onMutate: async (notifId: number) => {
            await queryClient.cancelQueries({ queryKey: ['article_comments', 'upvotes'] });
            const prevData = queryClient.getQueryData<Comment_Upvotes[]>(['article_comments', 'upvotes']);
            
            // Optimistic update
            if (prevData) {
                const updatedData = prevData.map(upvote =>
                    upvote.idcomment === notifId
                        ? { 
                            ...upvote, 
                            upvotes: (upvote.upvotes ?? 0) + (upvote.upvoted ? -1 : 1), 
                            upvoted: !upvote.upvoted 
                        }
                        : upvote
                );
                queryClient.setQueryData(['article_comments', 'upvotes'], updatedData);
            }
            return { prevData };
        },
        onError: (_err, _notifId, context) => {
            // Rollback on error
            if (context?.prevData)
                queryClient.setQueryData([], context.prevData);
        },
        onSettled: async () => {
            queryClient.invalidateQueries({
                queryKey: ['article_comments', 'upvotes']
            });
        }
    })

    const addReply = useMutation({
        mutationFn: async (idcomment: number, action = 'reply') => {
            const res = await fetch(`/api/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: action,
                    data: {
                        idcomment: idcomment
                    }
                })
            })
            if(!res.ok) throw new Error('Fetch Error!');
            return res.json();
        },
        onMutate: async (notifId: number) => {
            await queryClient.cancelQueries({ queryKey: ['article_comments', 'upvotes'] });
            const prevData = queryClient.getQueryData<Comment_Upvotes[]>(['article_comments', 'upvotes']);
            
            // Optimistic update
            if (prevData) {
                const updatedData = prevData.map(upvote =>
                    upvote.idcomment === notifId
                        ? { 
                            ...upvote, 
                            upvotes: (upvote.upvotes ?? 0) + (upvote.upvoted ? -1 : 1), 
                            upvoted: !upvote.upvoted 
                        }
                        : upvote
                );
                queryClient.setQueryData(['article_comments', 'upvotes'], updatedData);
            }
            return { prevData };
        },
        onError: (_err, _notifId, context) => {
            // Rollback on error
            if (context?.prevData)
                queryClient.setQueryData([], context.prevData);
        },
        onSettled: async () => {
            queryClient.invalidateQueries({
                queryKey: ['article_comments', 'upvotes']
            });
        }
    })

    const { data: comments } = useQuery<Comment_Author_Subscription[]>({
        queryKey: ['article_comments'], 
        queryFn: async () => {
            const res = await fetch(`/api/comments?idart=${article}`);
            if(!res.ok) throw new Error('Fetch Error!');
            return res.json();
        },
        staleTime: 1000 * 3,
        gcTime: 1000 * 3,
    })

    const { data: upvotes } = useQuery<Comment_Upvotes[]>({
        queryKey: ['article_comments', 'upvotes'], 
        queryFn: async () => {
            const res = await fetch(`/api/comments?idart=${article}&upvotes=true`);
            if(!res.ok) throw new Error('Fetch Error!');
            return res.json();
        },
        staleTime: 1000 * 3,
        gcTime: 1000 * 3,
    })

    const checkLogged = (author_id: string) => {
        if(author_id == user?.id) 
            return true;
        return false;
    }

    // da rifare, devo aggiungere un altra tabella al database per mantenere lo stato 'upvoted' 'true or false' per ogni user

    return (
        <div className="flex flex-col gap-2">
            <h1 className="title">Comments ({comments?.length ?? '0'})</h1>
            {
                user?.id ? //load this component only if user is logged in.
                    <div className="lg:w-1/2 w-1/1">
                        <CommentWriter onSubmit={() => router.refresh()}/> 
                    </div>
                    : ""
            }

            {
                !comments ? <LoadingComponent/> : 
                    comments.map((comment, index) => { 
                        const replies = showReplies[comment.idcomment];
                        const writer = replyWriter[comment.idcomment];

                        const upvote = upvotes?.find(u => u.idcomment === comment.idcomment)
                        const replyComments = comments.filter(c => c.reply_to === comment.idcomment);
                        
                        if(!comment.reply_to)
                            return (
                                <div className={"article-container flex-col gap-1 lg:w-1/2"} key={index}>
                                    <Link href={!checkLogged(comment.author.user_id) ? `/profile/${comment.user_id}` : "/profile"} className="font-bold text-lg text-ellipsis">{!checkLogged(comment.author.user_id) ? comment.author?.username ?? comment.author.user_id : "You"} - {comment.author?.subscription?.name ?? "Starter User"}</Link>
                                    <p>{new Date(comment.datetime).toISOString().split("T")[1] || 'N/A'}</p>
                                    <p>{comment.content}</p>
                                    <div className="flex flex-row gap-2">
                                        <p onClick={() => user ? toggleUpvote.mutate(comment.idcomment) : router.replace('/sign-in')}
                                            className={'font-bold hover:bg-green-200 rounded-xl p-1 transition-colors duration-300 ' + (upvote?.upvoted ? 'text-green-700' : 'text-black  hover:text-green-700')}>
                                            <FontAwesomeIcon icon={faCircleUp}></FontAwesomeIcon> Upvote ({upvote?.upvotes})
                                        </p>
                                        <p onClick={() => toggleReplyWriter(comment.idcomment)}
                                            className={"font-bold hover:bg-blue-200 hover:text-blue-700 rounded-xl p-1 transition-colors duration-300 " + (writer ? 'bg-blue-200 text-blue-700' : '')}>
                                            <FontAwesomeIcon icon={faReply}></FontAwesomeIcon> Reply
                                        </p>
                                        { (replyComments.length > 0) ? <p onClick={() => toggleShowReplies(comment.idcomment)}
                                            className={"font-bold hover:bg-purple-200 hover:text-purple-700 rounded-xl p-1 transition-colors duration-300 " + (replies ? 'bg-purple-200 text-purple-700' : '')}>
                                            <FontAwesomeIcon icon={faCommentDots}></FontAwesomeIcon> Replies ({replyComments.length})
                                        </p> : '' }
                                    </div>
                                    { writer ? <CommentWriter action="reply" reply_to={comment.idcomment} onSubmit={() => router.refresh()}></CommentWriter> : ''}
                                    { replies ?
                                        <div className="flex-col gap-2 w-1/1">
                                            {replyComments.map((reply, index) => {
                                                const upvote_reply = upvotes?.find(u => u.idcomment === reply.idcomment)

                                                return (                         
                                                    <div className={"article-container flex-col gap-1 lg:w-1/1"} key={index}>
                                                        <Link href={!checkLogged(reply.author.user_id) ? `/profile/${reply.user_id}` : "/profile"} className="font-bold text-lg text-ellipsis">{!checkLogged(reply.author.user_id) ? reply.author?.username ?? reply.author.user_id : "You"} - {reply.author?.subscription?.name ?? "Starter User"}</Link>
                                                        <p>{new Date(reply.datetime).toISOString().split("T")[1] || 'N/A'}</p>
                                                        <p>{reply.content}</p>
                                                        <div className="flex flex-row gap-2">
                                                            <p onClick={() => toggleUpvote.mutate(reply.idcomment)}
                                                                className={'font-bold hover:bg-green-200 rounded-xl p-1 transition-colors duration-300 ' + (upvote_reply?.upvoted ? 'text-green-700' : 'text-black  hover:text-green-700')}>
                                                                <FontAwesomeIcon icon={faCircleUp}></FontAwesomeIcon> Upvote ({upvote_reply?.upvotes})
                                                            </p>
                                                        </div>
                                                    </div>
                                                )})
                                            }
                                        </div> : ''
                                    }
                                </div>
                            )})
            }
        </div>
    )
}

export default CommentHandler;