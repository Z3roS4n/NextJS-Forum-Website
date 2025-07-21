
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

    const [article_req, comments_req] = await Promise.all([
        fetch(`${process.env.LOCAL_URL || ''}/api/articles?idart=${article}`, {
            next: { revalidate: 120 } 
        }),
        fetch(`${process.env.LOCAL_URL || ''}/api/comments?idart=${article}`, {
            cache: 'no-store'
        })
    ]);
    const art_res_json: Article_Category_Author[] = await article_req.json();
    const artData: Article_Category_Author = art_res_json[0];
    const comm_res_json: Comment_Author_Subscription[] = await comments_req.json();

    return (
        <>
            <div className="page-container gap-2">
                <div className="flex flex-col">
                    <h1 className="title">{artData.title}</h1>
                    <p className="text-lg">Category: {artData.category?.name ?? "No Category"}</p>
                    <p className="text-lg">Published by <Link className="link-primary text-lg" href={`/profile/${artData.author?.user_id}`}>{artData.author?.username}</Link></p>
                </div>

                {/* Markdown viewer. */}
                <ArticleViewer article={artData}></ArticleViewer>

                {/* Comment Section (Another component, must be client side, as an interactive panel) */}
                <h1 className="title">Comments ({comm_res_json.length})</h1>
                <CommentHandler comments={comm_res_json}></CommentHandler>
            </div>
        </>
    );
}

export default ArticlePage;