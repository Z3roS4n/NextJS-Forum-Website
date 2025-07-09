"use client"

import { Article_Category, Category } from "@/types/components";
import { useState } from "react";

interface Params {
    articles: Article_Category[],
    categories: Category[]
}

const ArticlesComponent = ({articles, categories}: Params) => {
    const [ category, setCategory ] = useState<number>(0);
    const [ title, setTitle ] = useState<string>("");
    const [ pageIndex, setPageIndex ] = useState<number>(1);

    const totalPagesNumber: number = Math.max(1, Math.ceil(articles.length / 20));

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
        const indexStart = (pageIndex - 1) * 20;
        const indexEnd = pageIndex * 20;
        if (indexart < indexStart || indexart >= indexEnd) return "hidden";

        return "";
    };


    // TO BE IMPLEMENTED: Divide articles in pages containing 20 articles (every page loads all articles [FOR FAST SEARCH FUNCTION],
    // but shows at interval of 20s only [0 - 20, 21 - 40, 41 - 60]); others will be *hidden* by the hidden class, such as filters.

    return (
        <>
            <div className="flex flex-col lg:flex-row gap-6">
                <select name="cat" id="cat" title="Category" defaultValue={0} onChange={(e) => setCategory(Number(e.target.value))}>
                    <option value="0">All Categories</option>
                    {categories.map((category, index) => <option key={index} value={category.idcat}>{category.name}</option>)}
                </select>
                <div>
                    <label htmlFor="titleSearch">Search by Title</label>
                    <input className="border-1 rounded-2xl ml-2 p-2" type="text" name="search" id="titleSearch" onChange={(e) => setTitle(e.target.value)} />
                </div>
            </div>

            {articles.map((article: Article_Category, index) => 
                <div key={article.idart} className={"border-1 rounded-2xl p-2 " + getVisibilityClass(article.idcat ?? 0, article.title, index ?? 0) }>
                    <h2 className="font-bold text-xl overflow-hidden text-ellipsis">{article.title}</h2>
                    <p>Category: {article.category?.name || "Nessuna categoria"}</p>
                    <p className="overflow-hidden text-ellipsis">{article.content}</p>
                    <div className="btn-primary mt-2">
                        <a href={`/articles/${article.idart}`}>Read Article</a>
                    </div>
                </div>
            )}

            <div className="flex flex-row justify-center items-center">
                <button className="btn-primary m-2" onClick={() => setPageIndex(pageIndex - 1)} disabled={pageIndex == 1 || pageIndex < 1 ? true : false}>Prev</button>
                <p className="text-xl">{pageIndex}</p>
                <button className="btn-primary m-2" onClick={() => setPageIndex(pageIndex + 1)} disabled={pageIndex >= totalPagesNumber}>Next</button>
            </div>
        </>
    );
}

export default ArticlesComponent;