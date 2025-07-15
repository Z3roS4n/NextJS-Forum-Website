import { Author_Subscription, User_Subscription } from "./components";

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

export interface UserStatsFunctionResponse {
    user: Author_Subscription;
    articlesPublished: number;
    commentsWritten: number;
    totalUpvotesReceived: number;
}

export interface TopUsersResponse {
    byUpvotes: TopUserByUpvotes[];
    byArticles: TopUserByArticles[];
    byComments: TopUserByComments[];
}

export interface TopUserBaseResponse {
    user_id: string;
    username: string;
    email: string;
}

export interface TopUserByUpvotes extends TopUserBaseResponse {
    totalUpvotes: number;
}

export interface TopUserByArticles extends TopUserBaseResponse {
    articlesCount: number;
}

export interface TopUserByComments extends TopUserBaseResponse {
    commentsCount: number;
}
