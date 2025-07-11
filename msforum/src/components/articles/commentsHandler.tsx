import { Comment_Author_Subscription } from "@/types/components";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

interface Params {
    comments: Comment_Author_Subscription[];
}

const CommentHandler = async ( { comments }: Params ) => {
    const user = await currentUser();

    const checkLogged = (author_id: string) => {
        if(author_id == user?.id) 
            return true;
        return false;
    }

    return (
        <div className="flex flex-col gap-2">

            {
                user?.id ? //load this component only if user is logged in.
                    <div className="border-2 rounded-2xl p-4 w-1/1 flex flex-col gap-2">
                        <label className="font-bold text-lg" htmlFor="leaveComment">Leave a Comment</label>
                        <textarea className="border-1 rounded-xl p-2" id="leaveComment" rows={4}/>
                        <button className="btn-primary lg:w-1/4">Submit Comment</button>
                    </div>
                    : ""
            }

            {comments.map((comment, index) =>
                // Check if comment is written by logged user or not,
                // if logged: "Username" has to be "You" and have another border/shadown color
                <div className={"border-2 rounded-2xl p-4 lg:w-1/2 overflow-hidden" + (!checkLogged(comment.author.user_id) ? "self-start" : "self-end") } key={index}>
                    <Link href={`/profile/${comment.user_id}`} className="font-bold text-lg text-ellipsis">{!checkLogged(comment.author.user_id) ? comment.author.user_id : "You"} - {comment.author?.subscription?.name ?? "Starter User"}</Link>
                    <p>{comment.datetime}</p>
                    <p>{comment.content}</p>
                </div>
            )}
        </div>
    )
}

export default CommentHandler;