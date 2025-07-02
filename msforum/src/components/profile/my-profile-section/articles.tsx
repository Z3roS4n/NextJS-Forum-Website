import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProfileArticlesProps {
    userId: string;
}

interface Article {
    idart: number;
    content: string;
    title: string;
}

const ProfileArticles = ({ userId }: ProfileArticlesProps) => {
    const [articles, setArticles] = useState<Article[]>([]);
    const router = useRouter()

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

    const goToArticle = (idart: number) => router.push(`articles/${idart}`)

    return (
        <>
            <h2 className="font-bold text-xl">Articles</h2>
            <div className="flex flex-col">
                {articles.map((article) =>
                    <div key={article.idart} className="flex flex-row justify-between mt-2 p-2 border-2 rounded-xl" id={article.idart.toString()}>
                        <div>
                            <h3 className="font-bold">{article.title}</h3>
                            <p>{article.content.trim().substring(0, 128)}</p>
                        </div>
                        <button type="button" onClick={() => goToArticle(article.idart)} className="p-2 pl-4 pr-4 mr-0 bg-blue-600 rounded-xl text-white hover:bg-blue-700 transition-colors delay-150">Go To Article</button>
                    </div>
                )}
            </div>
        </>
    );
}

export default ProfileArticles;