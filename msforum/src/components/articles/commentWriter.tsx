"use client"

import { useError } from "@/app/context/ErrorContext";
import { PostCommentRequest, PostCommentResponse } from "@/types/api";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useParams } from "next/navigation";
import { NextResponse } from "next/server";

interface CommentWriterParams {
    onSubmit: (comment: PostCommentResponse) => void;
}

const CommentWriter = ({ onSubmit }: CommentWriterParams) => {
    const [ comment, setComment ] = useState<string>("");
    const { showError } = useError();
    const params =  useParams();

    const { isSignedIn, user } = useUser()

    const submitComment = async (content: string): Promise<PostCommentResponse> => {

        const body: PostCommentRequest = {
            idart: Number(params.article),
            content: content,
            datetime: new Date().toISOString(),
            reply_to: null
        }

        const request = await fetch(`/api/comments`, {
            method: "POST",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const response: PostCommentResponse = (await request.json());

        return response;
    }

    const addComment = async (content: string) => {
        if(!isSignedIn)
            return showError("You're not signed in yet, please sign in and retry later.", "Not signed in!");

        if(content.length < 1)
            return showError("The minimum characters length in a comment is set to 1 character.", "Comment's too short!");
        
        setComment("");
        showError("Your comment has been submit!", "Success!")
        const response: PostCommentResponse = await submitComment(content);
        if(response)
            onSubmit(response)
    }

    return (
        <div className="border-2 rounded-2xl p-4 lg:w-1/2 w-1/1 flex flex-col gap-2">
            <label className="font-bold text-lg" htmlFor="leaveComment">Leave a Comment</label>
            <textarea className="border-1 rounded-xl p-2" id="leaveComment" value={comment} rows={4} onChange={(e) => setComment(e.target.value)}/>
            <button className="btn-primary lg:w-1/4" onClick={() => addComment(comment)}>Submit Comment</button>
        </div>
    )

}

export default CommentWriter;