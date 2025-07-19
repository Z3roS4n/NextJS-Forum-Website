import { Article_Category_Author } from "@/types/components"

interface ArticleComponentParams {
    articles: Article_Category_Author[]
}

const ArticleComp = ({ articles }: ArticleComponentParams) => {
    return (
        <>
            { articles?.map((article, index) =>
                <div key={index} className={"article-container w-1/1"}>
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

export default ArticleComp;