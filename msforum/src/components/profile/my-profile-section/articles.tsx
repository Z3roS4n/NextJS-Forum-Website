import { Article } from "@/types/components";
import { useEffect, useState } from "react";

interface ProfileArticlesProps {
    userId: string;
}

const ProfileArticles = ({ userId }: ProfileArticlesProps) => {
    const [articles, setArticles] = useState<Article[]>([]);

    useEffect(
        () => {
            const fetchArticles = async () => {
                const res = await fetch('/api/userArticles', 
                    { 
                        cache: 'no-cache', 
                        method: 'POST', 
                        headers: { 'Content-Type': 'application/json' }, 
                        body: JSON.stringify({ id: userId }) 
                    }
                );
                const data = await res.json();
                setArticles(data);
            } 
            fetchArticles();   
        }, [userId]
    );

    const deleteArticle = async (idart: number) => {
        //const delete_req = fetch(`/api/userArticles/${idart}`, { method: 'DELETE' })
        return null; //TO BE IMPLEMENTED, NEED TO ADD ANOTHER LAYER OF SECURITY (AUTH KEY - GENERATED ON REGISTRATION - TO BE KEPT SECRET)
    }

    return (
        <>
            <h2 className="font-bold text-xl">Articles</h2>
            <div className="flex flex-col">
                {articles.map((article) =>
                    <div key={article.idart} className="flex flex-row justify-between mt-2 p-2 border-2 rounded-xl" id={article.idart?.toString()}>
                        <div className="overflow-hidden text-ellipsis">
                            <h3 className="font-bold">{article.title}</h3>
                            <p>{article.content.trim().substring(0, 128)}</p>
                        </div>
                        <div>
                            <button className="btn-danger" onClick={() => article.idart !== null && deleteArticle(article.idart)}>Delete</button>
                            <a className="btn-primary" href={`/articles/${article.idart}`}>Go To Article</a>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default ProfileArticles;