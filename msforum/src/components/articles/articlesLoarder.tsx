"use client"

import { settings } from "@/lib/defaultSiteSettings";
import { Article_Category_Author, Category } from "@/types/components";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import LoadingComponent from "../ui/loading";
import Link from "next/link";
import SelectComponent from "../ui/select";
import WindowActions from "@/lib/windowActions";
import { useDebounce } from "@/hooks/useDebounce";
import ApiRequest from "@/lib/apiRequest";

interface ArticlesLoaderParams {
    user_id?: number;
    limit?: number;
}

const ArticlesLoader = ({ user_id, limit }: ArticlesLoaderParams) => {
    const [category, setCategory] = useState<number>(settings.noCategory);
    const [page, setPage] = useState<number>(1);
    const [title, setTitle] = useState<string>();
    const [search, setSearch] = useState<string>();
    const debouncedSearch = useDebounce(search, 1000);

    const queryClient = useQueryClient();

    const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: async () => {
            return await ApiRequest.getData({ url: '/api/manageArticle', params: { action: 'getExistingCategories' } });
        },
        enabled: true,
        gcTime: 1000 * 10,
    });

    const { data: articles, isLoading: articlesLoading } = useQuery<Article_Category_Author[]>({
        queryKey: ['articles', category],
        queryFn: async () => {
            return await ApiRequest.getData({ url: '/api/articles', params: { categoryId: category, pageNumber: page, searchedTitle: debouncedSearch } });
        },
        enabled: true,
        gcTime: 1000 * 10,
    })

    const articlesPageLoader = useMutation({
        mutationFn: async ({ pageNumber, categoryId, searchedTitle }: { pageNumber: number, categoryId: number, searchedTitle?: string }) => {
            return await ApiRequest.getData({ url: '/api/articles', params: { categoryId: categoryId, pageNumber: pageNumber, searchedTitle: searchedTitle } });
        },
        onSuccess: async () => {
            WindowActions.scrollToTop()
            queryClient.invalidateQueries({
                queryKey: ['articles']
            });
        }
    })
    const reloadPage = () => articlesPageLoader.mutate({ pageNumber: page, categoryId: category, searchedTitle: search });

    const setPageNumber = (action?: 'next' | 'prev', pageNumber?: number) => {
        let operation = () => action == 'next' ? page + 1 : page - 1;

        let newPage = page;
        if(pageNumber)
            newPage = pageNumber;
        else
            newPage = operation();

        setPage(newPage);
        
    }

    useEffect(reloadPage, [debouncedSearch, page, category])

    return (
        <>
            <div className="flex flex-col lg:flex-row gap-6">
                <SelectComponent categories={categories ?? []} onCategorySelection={(categoryId) => setCategory(categoryId)}/>
                <div>
                    <label htmlFor="titleSearch">Search by Title</label>
                    <input className="input ml-2" type="text" name="search" id="titleSearch" onChange={(e) => setSearch(e.target.value)} />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                {articles ? articles.map((article: Article_Category_Author, index) => 
                    <div key={article.idart} className={"article-container flex-col"}>
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
                <button className="btn-primary m-2" onClick={() => setPageNumber('prev')}>Prev</button>
                <p className="text-xl">{page}</p>
                <button className="btn-primary m-2" onClick={() => setPageNumber('next')}>Next</button>
            </div>
        </>
    );
}

export default ArticlesLoader;