"use client"

import { Article_Category_Author } from "@/types/components";
import { useEffect, useState } from "react"
import { usePathname } from 'next/navigation'
import ArticleComp from "../articles/articleComponent";

interface RecentArticlesParams {
    limit?: number | null,
    user_id?: string | null
}

const RecentArticles = ({ limit, user_id}: RecentArticlesParams) => {
    const [ articles, setArticles ] = useState<Article_Category_Author[]>();

    const path = usePathname();

    const queryLimit = limit || 5;
    const userId = user_id || null;

    const queryStringLimit = `${queryLimit ? 'limit=' + queryLimit : ''}`;
    const queryStringUserId = `${userId ? 'user_id=' + userId : ''}`;

    const query = `${queryLimit || userId ? '?' : ''}${queryStringLimit}${queryStringUserId}`

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const res = await fetch(`/api/articles${query}`, { next: { revalidate: path == '/' ? 120 : 5 } });
                if (!res.ok) throw new Error('Errore nel fetch');
                const data: Article_Category_Author[] = await res.json();
                setArticles(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchArticle();
    }, []);

    return (
        <> 
            <ArticleComp articles={articles || []}></ArticleComp>
        </>
    )
}

export default RecentArticles;