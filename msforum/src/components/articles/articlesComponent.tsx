"use client"

import { Article_Category, Article_Category_Author, Category } from "@/types/components";
import Link from "next/link";
import { useState } from "react";
import SelectComponent from "../ui/select";
import { useQuery } from "@tanstack/react-query";
import LoadingComponent from "../ui/Loading";

interface Params {
    user_id?: string;
    limitIndex?: number;
}

const ArticlesComponent = ({limitIndex = 20, user_id}: Params) => {
    const [ category, setCategory ] = useState<number>(0);
    const [ title, setTitle ] = useState<string>("");
    const [ pageIndex, setPageIndex ] = useState<number>(1);

    const { data: articles, isLoading: articlesLoading } = useQuery<Article_Category_Author[]>({
        queryKey: ['articles', user_id],
        queryFn: async () => {
            let queryParams = '';
            if(user_id)
                queryParams += `user_id=${user_id}`

            const res = await fetch(`/api/articles?${queryParams}`);
            if(!res.ok) throw new Error('Fetch Error!');
            return res.json();
        },
        enabled: true,
        gcTime: 1000 * 15,
        staleTime: 1000 * 15
    })

    const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await fetch(`/api/manageArticle?action=getExistingCategories`);
            if(!res.ok) throw new Error('Fetch Error!');
            return res.json();
        },
        enabled: true,
        gcTime: 1000 * 10,
    })

    const totalPagesNumber: number = Math.max(1, Math.ceil((articles?.length ?? 0) / limitIndex));

    const getVisibilityClass = (artCategory: number, artTitle: string, indexart: number) => {
        const hasCategoryFilter = category !== 0;
        const hasTitleFilter = title.trim() !== "";

        // Filtro categoria (se attivo)
        if (hasCategoryFilter && artCategory !== category) return "hidden";

        // Filtro titolo (se attivo)
        if (hasTitleFilter) {
            const searchLen = title.length;
            const articleTitle = artTitle.toLowerCase();
            const searchedTitle = title.toLowerCase();

            if (
                articleTitle.substring(0, searchLen) !== searchedTitle &&
                !articleTitle.includes(searchedTitle, searchLen - 1)
            ) return "hidden";
        }

        // Se è attivo uno dei due filtri: ignora la paginazione
        if (hasCategoryFilter || hasTitleFilter) return "";

        // Nessun filtro: applica paginazione
        const indexStart = (pageIndex - 1) * limitIndex;
        const indexEnd = pageIndex * limitIndex;
        if (indexart < indexStart || indexart >= indexEnd) return "hidden";

        return "";
    };

    return (
        <>
            <div className="flex flex-col lg:flex-row gap-6">
                <SelectComponent categories={categories ?? []} onCategorySelection={(categoryId) => setCategory(categoryId)}/>
                <div>
                    <label htmlFor="titleSearch">Search by Title</label>
                    <input className="input ml-2" type="text" name="search" id="titleSearch" onChange={(e) => setTitle(e.target.value)} />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                {articles ? articles.map((article: Article_Category_Author, index) => 
                    <div key={article.idart} className={"article-container flex-col " + getVisibilityClass(article.idcat ?? 0, article.title, index ?? 0) }>
                        <h2 className="font-bold text-xl overflow-hidden text-ellipsis">{article.title}</h2>
                        <p>Author: <Link className="link-primary" href={`/profile/${article.author.user_id}`}>{article.author.username}</Link></p>
                        <p>Category: {article.category?.name || "Nessuna categoria"}</p>
                        <p className="overflow-hidden text-ellipsis">{article.content}</p>
                        <div className="btn-primary mt-2 lg:self-start text-center">
                            <a href={`/articles/${article.idart}`}>Read Article</a>
                        </div>
                    </div>
                ) : <LoadingComponent/> }
            </div>

            <div className="flex flex-row justify-center items-center">
                <button className="btn-primary m-2" onClick={() => setPageIndex(pageIndex - 1)} disabled={pageIndex == 1 || pageIndex < 1 ? true : false}>Prev</button>
                <p className="text-xl">{pageIndex}</p>
                <button className="btn-primary m-2" onClick={() => setPageIndex(pageIndex + 1)} disabled={pageIndex >= totalPagesNumber}>Next</button>
            </div>
        </>
    );
}

export default ArticlesComponent;