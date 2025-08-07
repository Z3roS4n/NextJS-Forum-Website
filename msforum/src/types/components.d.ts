// BETTER AUTH & USER

export interface Session {
  id: string;
  user_id: string;
  token: string;
  expiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  id: string;
  user_id: string;
  accountId: string;
  providerId: string;
  accessToken?: string | null;
  refreshToken?: string | null;
  accessTokenExpiresAt?: Date | null;
  refreshTokenExpiresAt?: Date | null;
  scope?: string | null;
  idToken?: string | null;
  password?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Verification {
  id: string;
  identifier: string;
  value: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Follow {
    followers: User[];
    followed: User[];
}

export interface User {
    user_id: string;
    email: string;
    bio: string;
    readme: string;
    profile_picture?: string | null;
    subscription?: Subscription | null;
    emailVerified: boolean | null;
}

export interface Subscription {
    idsub: number;
    name: string;
    description?: string | null;
}


// ARTICLES, CATEGORIES, COMMENTS

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
    author: Author_Subscription;
    datetime: string;
    _count: {
        upvoteComments: number
    }
}

export interface Comment_Upvotes {
    idcomment: number;
    upvotes: number;
    upvoted?: boolean;
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

// NOTIFICATIONS

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