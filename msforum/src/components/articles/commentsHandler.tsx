"use client"

import { Comment_Author_Subscription } from "@/types/components";
//import { currentUser } from "@clerk/nextjs/server";
import { useUser } from "@clerk/nextjs"
import Link from "next/link";
import ErrorPopup from "../ui/error_popup";
import { useError } from "@/app/context/ErrorContext";
import CommentWriter from "./commentWriter";
import { useState } from "react";
import { PostCommentResponse } from "@/types/api";

import { useRouter } from 'next/navigation';

interface Params {
    comments: Comment_Author_Subscription[];
}

const CommentHandler = ( { comments }: Params ) => {
    //const user = await currentUser();

    const router = useRouter();

    const { user } = useUser()

    const checkLogged = (author_id: string) => {
        if(author_id == user?.id) 
            return true;
        return false;
    }

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
                <div className={"border-2 rounded-2xl p-4 lg:w-1/2 w-1/1 overflow-hidden self-start"} key={index}>
                    <Link href={!checkLogged(comment.author.user_id) ? `/profile/${comment.user_id}` : "/profile"} className="font-bold text-lg text-ellipsis">{!checkLogged(comment.author.user_id) ? comment.author?.username ?? comment.author.user_id : "You"} - {comment.author?.subscription?.name ?? "Starter User"}</Link>
                    <p>{comment.datetime}</p>
                    <p>{comment.content}</p>
                    <div className="flex flex-row gap-2">
                        <p>Upvote (21)</p>
                        <p>Reply (2)</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CommentHandler;