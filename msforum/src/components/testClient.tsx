"use client"

import { Article } from "@/app/articles/page";
import { useState } from "react";

interface Params {
    article: Article
}

const ArticleComponent = ({ article }: Params) => {
    const [state, setState] = useState<number>(1);

    //const articles = await fetch
    return (
        <>
            <div className="">
                <h1>{article.title}</h1>
                <p>{article.content}</p>
                <h2>{state}</h2>
                <button onClick={() => setState(state + 1)}>Aumenta Stato</button>
            </div>
        </>
    )
}

export default ArticleComponent;