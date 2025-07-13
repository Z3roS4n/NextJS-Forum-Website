export interface PostCommentRequest {
    content: string;
    datetime: string;
    idart: number;
    reply_to: number | null;
}

export interface PostCommentResponse {
    idcomment: number;
    upvotes: number;
    user_id: string;
    content: string;
    datetime: Date;
    idart: number;
    reply_to: number | null;
}