export interface Article_Category {
    idart: number | null;
    idcat: number | null;
    user_id: string;
    title: string;
    content: string;
    datetime: number | null;
    category: Category;
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

export interface User_Subscription {
    user_id: string;
    email: string;
    subscription: Subscription;
}

export interface Subscription {
    idsub: number;
    name: string;
    description: string;
}