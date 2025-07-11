import { Comment_Author_Subscription } from "@/types/components";

interface Params {
    comments: Comment_Author_Subscription[];
}

const CommentHandler = ( { comments }: Params ) => {
    return (
        <div className="flex flex-col gap-2">
            {comments.map((comment, index) =>
                // Check if comment is written by logged user or not,
                // if logged: "Username" has to be "You" and have another border/shadown color
                <div className="border-2 rounded-2xl p-4 w-1/2"  key={index}>
                    <h3>{comment.author.user_id} - {comment.author?.subscription?.name ?? "Starter User"}</h3>
                    <p>{comment.datetime}</p>
                    <p>{comment.content}</p>
                </div>
            )}
        </div>
    )
}

export default CommentHandler;