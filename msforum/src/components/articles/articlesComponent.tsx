"use client"

import { Article, Categories } from "@/app/articles/page";
import { useState } from "react";

interface Params {
    articles: Article[],
    categories: Categories[]
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

        if(artTitle.substring(0, searchLen) != title && !artTitle.includes(title, searchLen - 1)) return "hidden"; 
    }

    return (
        <> 
            <div>
                <select name="cat" id="cat" title="Category" defaultValue={0} onChange={(e) => setCategory(Number(e.target.value))}>
                    <option value="0">All Categories</option>
                    {categories.map((category, index) => <option key={index} value={category.idcat}>{category.name}</option>)}
                </select>
                <div>
                    <label htmlFor="titleSearch">Search by Title</label>
                    <input className="border-1 rounded-2xl ml-2 p-2" type="text" name="search" id="titleSearch" onChange={(e) => setTitle(e.target.value)} />
                </div>
            </div>

            {articles.map((article: Article) => 
                <div key={article.idart} className={"border-1 rounded-2xl p-2 " + isHidden(article.idcat) + " " + searchTitle(article.title) }>
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