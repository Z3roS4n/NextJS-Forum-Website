"use client"

import { Article_Category_Author } from "@/types/components";
import { useEffect, useState } from "react"
import { usePathname } from 'next/navigation'
import ArticleComp from "../articles/articleComponent";
import { useQuery } from "@tanstack/react-query";
import ApiRequest from "@/lib/apiRequest";

interface RecentArticlesParams {
    limit?: number | null,
    user_id?: string | null
}

const RecentArticles = ({ limit, user_id}: RecentArticlesParams) => {
    const path = usePathname();

    const queryLimit = limit || 5;
    const userId = user_id || undefined;

    const { data: articles, isLoading, error } = useQuery<Article_Category_Author[]>({
        queryKey: ['recent_articles'],
        queryFn: async () => {
            return await ApiRequest.getData({ url: '/api/articles', params: { pageSize: queryLimit, user_id: userId } });
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