import { Article_Category, Article_Category_Author } from "@/types/components";
import Link from "next/link";

interface ArticlePageProps {
    params: {
        article: string;
    };
}

const ArticlePage = async ({ params }: ArticlePageProps) => {
    const { article } = params;

    const article_req = await fetch(`http://localhost:3000/api/articles?idart=${article}`);
    const art_res_json: Article_Category_Author[] = await article_req.json();
    const artData: Article_Category_Author = art_res_json[0];

    return (
        <>
            <div className="m-10">
                <h1 className="title">{artData.title}</h1>
                <p>Category: {artData.category?.name ?? "No Category"}</p>
                <p>Published by <Link href={`/profile/${artData.author?.user_id}`}>{artData.author?.user_id}</Link></p>

                {/* Insert markdown viewer here. */}

                {/* Comment Section (Another component, must be client side, as an interactive panel) */}
            </div>
        </>
    );
}

export default ArticlePage;