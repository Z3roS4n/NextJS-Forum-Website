"use client"

import { Article_Category_Author } from "@/types/components";
import { useEffect, useState } from "react"

interface RecentArticlesParams {
    limit: number
}

const RecentArticles = ({ limit }: RecentArticlesParams) => {
    const [ articles, setArticles ] = useState<Article_Category_Author[]>();
    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const res = await fetch(`/api/articles?limit=${limit}`, { next: { revalidate: 120 } });
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
            { articles?.map((article, index) =>
                <div key={index} className={"article-container"}>
                    <div>
                        <h2 className="font-bold text-xl overflow-hidden text-ellipsis">{article.title}</h2>
                        <p>Category: {article.category?.name || "Nessuna categoria"}</p>
                        <p className="overflow-hidden text-ellipsis text-nowrap">{article.content.substring(0, 64) + "..."}</p>
                    </div>
                    <div className="btn-primary self-end">
                        <a href={`/articles/${article.idart}`}>Read Article</a>
                    </div>
                </div>
            )}
        </>
    )
}

export default RecentArticles;