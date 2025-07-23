"use client"

import { Article } from "@/types/components";
import { useQuery } from "@tanstack/react-query";

interface ProfileArticlesProps {
    userId: string;
}

const ProfileArticles = ({ userId }: ProfileArticlesProps) => {
    const { isPending, error, data: articles } = useQuery<Article[]>({
        queryKey: ['profile_articles', userId], // Include userId nella chiave
        queryFn: async () => {
            const res = await fetch('/api/userArticles', {
                cache: 'no-cache',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: userId }),
            });

            if (!res.ok) throw new Error('Errore nel caricamento articoli');
            return res.json();
        },
    });

    if (isPending) return <div>Caricamento...</div>;
    if (error) return <div>Errore!</div>;

    const deleteArticle = async (idart: number) => {
        //const delete_req = fetch(`/api/userArticles/${idart}`, { method: 'DELETE' })
        return null; //TO BE IMPLEMENTED, NEED TO ADD ANOTHER LAYER OF SECURITY (AUTH KEY - GENERATED ON REGISTRATION - TO BE KEPT SECRET)
    }

    return (
        <>
            <h2 className="font-bold text-xl">Articles</h2>
            <div className="flex flex-col">
                {articles.map((article) =>
                    <div key={article.idart} className="article-container gap-4" id={article.idart?.toString()}>
                        <div className="overflow-hidden text-ellipsis">
                            <h3 className="font-bold">{article.title}</h3>
                            <p>{`${article.content.trim().substring(0, 34)}... Open to see more!`}</p>
                        </div>
                        <div className="flex flex-row flex-nowrap not-lg:flex-wrap gap-2">
                            <button className="btn-danger not-lg:w-1/1" onClick={() => article.idart !== null && deleteArticle(article.idart)}>Delete</button>
                            <a className="btn-primary flex not-lg:w-1/1 justify-center items-center text-center" href={`/articles/${article.idart}`}>Go To Article</a>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default ProfileArticles;