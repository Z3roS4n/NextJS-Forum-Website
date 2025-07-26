"use client"

import { Article_Category_Author } from "@/types/components";
import { useEffect, useState } from "react"
import { usePathname } from 'next/navigation'
import ArticleComp from "../articles/articleComponent";
import { useQuery } from "@tanstack/react-query";

interface RecentArticlesParams {
    limit?: number | null,
    user_id?: string | null
}

const RecentArticles = ({ limit, user_id}: RecentArticlesParams) => {
    const path = usePathname();

    const queryLimit = limit || 5;
    const userId = user_id || null;

    const queryStringLimit = `${queryLimit ? 'limit=' + queryLimit : ''}`;
    const queryStringUserId = `${userId ? 'user_id=' + userId : ''}`;

    const query = `${queryLimit || userId ? '?' : ''}${queryStringLimit}${queryStringUserId}`

    const { data: articles, isLoading, error } = useQuery<Article_Category_Author[]>({
        queryKey: ['recent_articles'],
        queryFn: async () => {
            const res = await fetch(`/api/articles${query}`);
            if(!res.ok) throw new Error(`Fetch Error!`);
            return res.json();
        },
        staleTime: 1000 * 120,
        gcTime: 1000 * 120
    })

    return (
        <> 
            <ArticleComp articles={articles || []}></ArticleComp>
        </>
    )
}

export default RecentArticles;