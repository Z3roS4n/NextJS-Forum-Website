import { Author_Subscription, User_Subscription } from "./components";

export interface PostUserInformations {
    action: 'set_bio' | 'set_readme' | 'set_picture';
    data: {
        bio: string | null;
        readme: string | null;
        picture: string | null;
    }
}

export interface PostFollow {
    action: 'follow' | 'unfollow'
    data: {
        follower: string;
        followed: string;
    }
}

export interface UpvoteCommentRequest {
    action: 'set_upvote' | 'rem_upvote' | 'toggle_upvote';
    data: {
        idcomment: number;
    }
}

export interface PostCommentRequest {
    action: 'comment' | 'reply';
    data: {
        content: string;
        datetime: string;
        idart: number;
        reply_to: number | null;
    }
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

export interface PostNotificationRequest {
    action: 'set_read' | 'set_unread' | 'post_notification';
    notifications_ids: Array<number>;
}
