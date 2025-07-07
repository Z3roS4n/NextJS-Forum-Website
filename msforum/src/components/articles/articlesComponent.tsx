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

    const isHidden = (artCategory: number) => {
        if(category == 0) return "";

        if(artCategory != category) return "hidden";
    };

    const searchTitle = (artTitle: string) => {
        if(title == "") return "";

        const searchLen = title.length

        const articleTitle = artTitle.toLowerCase();
        const searchedTitle = title.toLowerCase()

        if(articleTitle.substring(0, searchLen) != searchedTitle && !articleTitle.includes(searchedTitle, searchLen - 1)) return "hidden"; 
    }

    // TO BE IMPLEMENTED: Divide articles in pages containing 20 articles (every page loads all articles [FOR FAST SEARCH FUNCTION],
    // but shows at interval of 20s only [0 - 20, 21 - 40, 41 - 60]); others will be *hidden* by the hidden class, such as filters.

    return (
        <> 
            <div className="flex flex-row gap-6">
                <select name="cat" id="cat" title="Category" defaultValue={0} onChange={(e) => setCategory(Number(e.target.value))}>
                    <option value="0">All Categories</option>
                    {categories.map((category, index) => <option key={index} value={category.idcat}>{category.name}</option>)}
                </select>
                <div>
                    <label htmlFor="titleSearch">Search by Title</label>
                    <input className="border-1 rounded-2xl ml-2 p-2" type="text" name="search" id="titleSearch" onChange={(e) => setTitle(e.target.value)} />
                </div>
            </div>

            {articles.map((article: Article_Category) => 
                <div key={article.idart} className={"border-1 rounded-2xl p-2 " + isHidden(article.idcat ?? 0) + " " + searchTitle(article.title) }>
                    <h2 className="font-bold text-xl">{article.title}</h2>
                    <p>Category: {article.category?.name || "Nessuna categoria"}</p>
                    <p className="overflow-hidden text-ellipsis">{article.content}</p>
                    <div className="btn-primary">
                        <a href={`/articles/${article.idart}`}>Read Article</a>
                    </div>
                </div>
            )}
        </>
    );
}

export default ArticlesComponent;