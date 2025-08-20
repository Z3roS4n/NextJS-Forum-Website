import ArticleViewer from "@/components/articles/articleViewer";
import CommentHandler from "@/components/articles/commentsHandler";
import ApiRequest from "@/lib/apiRequest";
import { Article_Category_Author, Comment_Author_Subscription } from "@/types/components";
import Link from "next/link";

const ArticlePage = async ({ params }: { params: Promise<{ article: string }>; }) => {
    const { article } = await params;

    const article_req: Article_Category_Author[] = await ApiRequest.getData({ url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/articles/${article}` });
    const artData: Article_Category_Author = article_req[0];

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
                <CommentHandler></CommentHandler>
            </div>
        </>
    );
}

export async function generateMetadata({ params }: { params: Promise<{ article: string }> }) {
    const { article } = await params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/articles?idart=${article}`, {
        next: { revalidate: 120 }
    });
    const articles: Article_Category_Author[] = await res.json();
    const artData = articles[0];

    return {
        title: (artData?.title || "Article") + " | MSForum",
        description: artData?.content || "Read this article on our forum.",
        openGraph: {
            title: artData?.title,
            description: artData?.content,
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/articles/${article}`,
            type: "article"
        }
    };
}

export default ArticlePage;