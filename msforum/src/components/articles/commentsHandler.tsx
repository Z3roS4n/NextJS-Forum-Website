"use client"

import { Comment_Author_Subscription } from "@/types/components";
//import { currentUser } from "@clerk/nextjs/server";
import { useUser } from "@clerk/nextjs"
import Link from "next/link";
import { useError } from "@/app/context/ErrorContext";
import CommentWriter from "./commentWriter";
import { useState } from "react";

import { useRouter } from 'next/navigation';

interface Params {
    comments: Comment_Author_Subscription[];
}

type Upvote = Record<number, {upvotes: number, upvoted: boolean}>

const CommentHandler = ( { comments }: Params ) => {
    //const user = await currentUser();
    const router = useRouter();
    const { user } = useUser();
    const { showError } = useError();

    const [upvotes, setUpvotes] = useState<Upvote>(() => {
        const initialUpvotes: Upvote = {};
        (comments ?? []).forEach((comment) => {
            initialUpvotes[comment.idcomment] = { upvotes: comment.upvotes, upvoted: false };
        });
        return initialUpvotes;
    });

    console.log("Initialized upvotes state:", upvotes);

    const checkLogged = (author_id: string) => {
        if(author_id == user?.id) 
            return true;
        return false;
    }

    const handleUpvote = (idcomment: number) => {
        setUpvotes(prev => ({
            ...prev,
            [idcomment]: {
                ...prev[idcomment],
                upvotes: prev[idcomment].upvoted 
                    ? prev[idcomment].upvotes - 1 
                    : prev[idcomment].upvotes + 1,
                upvoted: !prev[idcomment].upvoted
            }
        }));
        //postUpvotes(idcomment);
    }

    // da rifare, devo aggiungere un altra tabella al database per mantenere lo stato 'upvoted' 'true or false' per ogni user
    /*
        Comment -> Upvotes <- User
        
        Upvote {
            user_id string,
            idcomment number,
            upvoted: true/false,
        }

    const postUpvotes = async (idcomment: number) => {
        try {
            const upvote = upvotes[idcomment];
            console.log(upvote)
            if(upvote) {
                const request = {
                    action: 'upvote',
                    data: {
                        idcomment: idcomment,
                        upvotes: upvote.upvotes
                    }
                }
                await fetch("/api/comments", {
                    method: 'POST',
                    cache: 'no-store',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(request)
                })
            }   
        } catch (error) {
            showError("There was a problem sending your upvote, do not make too many requests at once and retry later!", "Down-vote ahah! :')");
        }
    }*/

    return (
        <div className="flex flex-col gap-2">
            {
                user?.id ? //load this component only if user is logged in.
                    <CommentWriter onSubmit={() => router.refresh()}/>
                    : ""
            }

            {comments.map((comment, index) =>
                // Check if comment is written by logged user or not,
                // if logged: "Username" has to be "You" and have another border/shadown color
                <div className={"article-container flex-col lg:w-1/2"} key={index}>
                    <Link href={!checkLogged(comment.author.user_id) ? `/profile/${comment.user_id}` : "/profile"} className="font-bold text-lg text-ellipsis">{!checkLogged(comment.author.user_id) ? comment.author?.username ?? comment.author.user_id : "You"} - {comment.author?.subscription?.name ?? "Starter User"}</Link>
                    <p>{new Date(comment.datetime).toISOString().split("T")[1] || 'N/A'}</p>
                    <p>{comment.content}</p>
                    <div className="flex flex-row gap-2">
                        <p onClick={() => handleUpvote(comment.idcomment)}>
                            Upvote ({upvotes[comment.idcomment]?.upvotes || 0})
                        </p>
                        <p>
                            Reply (nope)
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CommentHandler;