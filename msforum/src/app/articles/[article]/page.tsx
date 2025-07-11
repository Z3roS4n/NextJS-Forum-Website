import ArticleViewer from "@/components/articles/articleViewer";
import CommentHandler from "@/components/articles/commentsHandler";
import { Article_Category, Article_Category_Author, Comment_Author_Subscription } from "@/types/components";
import Link from "next/link";

interface ArticlePageProps {
    params: {
        article: string;
    };
}

const ArticlePage = async ({ params }: ArticlePageProps) => {
    const { article } = await params;

    const article_req = await fetch(`http://localhost:3000/api/articles?idart=${article}`);
    const art_res_json: Article_Category_Author[] = await article_req.json();
    const artData: Article_Category_Author = art_res_json[0];

    const comments_req = await fetch(`http://localhost:3000/api/comments?idart=${article}`, { cache: 'no-store'});
    const comm_res_json: Comment_Author_Subscription[] = await comments_req.json();

    return (
        <>
            <div className="m-10 flex flex-col gap-2">
                <div>
                    <h1 className="title">{artData.title}</h1>
                    <p>Category: {artData.category?.name ?? "No Category"}</p>
                    <p>Published by <Link href={`/profile/${artData.author?.user_id}`}>{artData.author?.user_id}</Link></p>
                </div>

                {/* Insert markdown viewer here. */}
                <ArticleViewer article={artData}></ArticleViewer>

                {/* Comment Section (Another component, must be client side, as an interactive panel) */}
                <h1 className="title">Comments ({comm_res_json.length})</h1>
                <CommentHandler comments={comm_res_json}></CommentHandler>
            </div>
        </>
    );
}

export default ArticlePage;