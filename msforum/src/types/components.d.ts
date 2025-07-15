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
    subscription: Subscription | null;
}

export interface Author {
    user_id: string;
    email: string;
    username: string;
}

export interface Author_Subscription {
    user_id: string;
    email: string;
    username: string;
    subscription: Subscription | null;
}

export interface Subscription {
    idsub: number;
    name: string;
    description: string;
}