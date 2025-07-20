"use client"

import { TopUsersResponse } from "@/types/api"
import { useEffect, useState } from "react"

interface FamousUsersParams {
    limit: number;
}

const FamousUsers = ({ limit }: FamousUsersParams) => {
    const [ scoreboard, setScoreboard ] = useState<TopUsersResponse>();
    const [ orderBy, setOrderBy ] = useState<keyof TopUsersResponse>("byArticles");

    // Ottimizzare: Fare 3 request parallele, invece di un unica request. Il codice back-end è già predisposto (va solo ottimizzato)
    useEffect(() => {
        const fetchScoreboard = async () => {
            try {
                const res = await fetch(`/api/topUsers?limit=${limit}`, { next: { revalidate: 300 } })
                if (!res.ok) throw new Error('Errore nel fetch');
                const data: TopUsersResponse = await res.json();
                setScoreboard(data);
            } catch (error) {
                console.log(error);
            }
        }

        fetchScoreboard();
    }, [])

    return (
        <>
            <div className="mb-4 mt-2">
                <label htmlFor="orderby" className="block text-sm text-gray-700 mb-1">Order by</label>
                <select
                    name="orderby"
                    id="orderby"
                    defaultValue="byArticles"
                    onChange={(e) => setOrderBy(e.target.value as keyof TopUsersResponse)}
                    className="w-1/3 px-3 py-2 text-sm border border-gray-300 rounded-xl shadow-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="byArticles">Articles</option>
                    <option value="byUpvotes">Upvotes</option>
                    <option value="byComments">Comments</option>
                </select>
            </div>

            <div>
                { scoreboard && scoreboard[orderBy].map((user, index) => (
                    <div key={index} className="article-container flex-row items-center">
                        <div className="flex flex-row items-center gap-3">
                            <p className="text-sm font-medium text-gray-800">{user.username}</p>
                            <p className="text-sm text-gray-500">
                            {orderBy === 'byArticles' && 'articlesCount' in user && `${user.articlesCount} articoli`}
                            {orderBy === 'byUpvotes' && 'totalUpvotes' in user && `${user.totalUpvotes} upvotes`}
                            {orderBy === 'byComments' && 'commentsCount' in user && `${user.commentsCount} commenti`}
                            </p>
                        </div>
                        <a href={`/profile/${user.user_id}`} className="link-primary">
                            Visita profilo →
                        </a>
                    </div>
                )) }
            </div>
        </>
    );
}

export default FamousUsers;