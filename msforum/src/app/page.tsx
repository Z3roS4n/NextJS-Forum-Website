import Image from "next/image";

import RecentArticles from "@/components/home/recentArticles";
import YourProfile from "@/components/home/yourProfile";
import FamousUsers from "@/components/home/famousUsers";

export default function Home() {
    const fetch_articles = fetch;
    const fetch_users = fetch;
    const fetch_profile = fetch;

    return (
        <div className="page-container gap-4">
            <h1 className="title">msforum by biton.dev</h1>
            <p>Web App's homepage, here you can find last 10 published articles, users with most upvotes and a shortcut to your profile.</p>
            <div className="flex lg:flex-row flex-col lg:gap-2 not-lg:gap-4">
                <div className="flex flex-col lg:w-2/3 w-1/1 border-0">
                    <div className="article-container rounded-2xl flex-col gap-2">
                        <div className="flex flex-row w-1/1 justify-between">
                            <div className="flex flex-col self-center">
                                <h1 className="title">Recent Articles</h1>
                                <p>Last 10 articles published</p>   
                            </div>   
                            <div className="self-start">
                                <a className="btn-secondary text-nowrap" href="/articles">Go to Articles</a>
                            </div> 
                        </div>
                        <div className="flex flex-col"> {/* LAST 10 MOST RECENT ARTICLES (ARTICLE COMPONENT LIMITED TO 10) */}
                            <RecentArticles limit={5}/>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col lg:w-1/3 w-1/1 border-0 not-lg:gap-4">
                    <div className="article-container rounded-2xl flex-col">
                        <div className="flex flex-row w-1/1 justify-between">
                            <div className="flex flex-col self-center">
                                <h1 className="title">Your Profile</h1>
                                <p>Something on your profile</p>   
                            </div>   
                            <div className="self-start">
                                <a className="btn-secondary text-nowrap" href="/profile">Go to Profile</a>
                            </div> 
                        </div>
                        <div> {/* SOME PROFILE STATS (UPVOTES, ARTICLES, COMMENTS, VIEWS + PROFILE NAME) */}
                            <YourProfile/>
                        </div>

                    </div>
                    <div className="article-container rounded-2xl flex-col">
                        <div className="flex flex-row w-1/1 justify-between">
                            <div className="flex flex-col self-center">
                                <h1 className="title">Famous Users</h1>
                                <p>Top 5 users with most upvotes to comments</p>   
                            </div>   
                            <div className="self-start">
                                <a className="btn-secondary text-nowrap" href="/topUsers">Go to Top Users</a>
                            </div> 
                        </div>
                        <div> {/* TOP USERS COMPONENT (LIMITED TO 5) */}
                            <FamousUsers limit={5}/>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
