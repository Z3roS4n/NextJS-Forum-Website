export interface Article_Category {
    idart: number | null;
    idcat: number | null;
    user_id: string;
    title: string;
    content: string;
    datetime: number | null;
    category: Category;
}

export interface Article_Category_Author {
    idart: number | null;
    idcat: number | null;
    user_id: string;
    title: string;
    content: string;
    datetime: string | null;
    category: Category;
    author: Author;
}

export interface Article {
    idart: number | null;
    idcat: number | null;
    user_id: string;
    title: string;
    content: string;
    datetime: number | null;
}

export interface Category {
    idcat: number;
    name: string;
    description: string;
}

export interface Comment_Author_Subscription {
    idcomment: number;
    content: string;
    idart: number;
    user_id: string;
    reply_to: number;
    upvotes: number;
    author: Author_Subscription;
    datetime: string;
}

export interface User_Subscription {
    user_id: string;
    email: string;
    bio: string;
    readme: string;
    profile_picture: string | null;
    subscription: Subscription | null;
}

export interface Author {
    user_id: string;
    email: string;
    username: string;
    bio: string;
    readme: string;
    profile_picture: string | null;
}

export interface Author_Subscription extends Author {
    subscription: Subscription | null;
}

export interface Subscription {
    idsub: number;
    name: string;
    description: string;
}

export interface Notification {
    idnotification: number;
    created_at: string;
    seen: boolean;
    type: 'upvote_comment' | 'upvote_article' | 'comment_to_article' | 'mention_comment' | 'mention_article';
    user_id: string;
    idart: number | null;
    mention_author_id: string | null
}

export interface User_Mention_Article_Notification extends Notification { 
    mentionAuthor?: Author | null;
    user: Author;
    article?: Article | null;
}