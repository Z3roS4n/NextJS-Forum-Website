import ArticlesComponent from "@/components/articles/articlesComponent";

import ReadMeViewer from "@/components/profile/other-user/readmeviewer";
import UserStats from "@/components/profile/other-user/userstats";
import { Category } from "@/generated/prisma";
import { Article_Category_Author, Author_Subscription } from "@/types/components";
import Image from "next/image";

export default async function ProfilesPage({ params }: { params: Promise<{ slug: string }>; }) {
    const { slug } = await params;

    const [resUser, resArts, resCat] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/user?id=${slug}`, { 
            next: { revalidate: 30 }, 
        }),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/articles?user_id=${slug}`, 
            { next: { revalidate: 30 } }
        ),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/manageArticle?action=getExistingCategories`, {
            next: { revalidate: 120 },
        }),
    ]);

    const userInfo: Author_Subscription = await resUser.json();
    const articles: Article_Category_Author[] = await resArts.json();
    const categories: Category[] = await resCat.json();

    return (
        <>
            <div className="page-container">
                <div className="flex lg:flex-row flex-col lg:gap-2">
                    <div className="article-container lg:w-1/5 w-1/1">
                        <div id="user-info" className="flex flex-col items-center justify-center w-1/1 gap-2">
                            <h1 className="title self-start">Informations</h1>
                            <div className="flex flex-row items-start gap-10 mt-4">
                                <Image className="rounded-full" src={userInfo.profile_picture ?? '/default-profile-img.png'} alt={"profile-image"} width={200} height={200}></Image>
                            </div>                            
                            <div className="flex flex-col">
                                <div className="flex flex-col mt-4 justify-center items-center">
                                    <span className="block text-gray-500">Username</span>
                                    <span className="font-medium text-lg">{userInfo.username}</span>
                                    <span className="block text-gray-500">Subscription</span>
                                    <span className="font-medium text-lg">{userInfo.subscription?.name ?? "Starter User"}</span>
                                    <span className="block text-gray-500">Bio</span>
                                    <span className="font-medium text-lg text-wrap">{userInfo.bio}</span> 
                                </div>
                            </div>
                            <div className="flex flex-row gap-2">
                                <UserStats user_id={slug}></UserStats>
                            </div>
                        </div>
                        <div id="user-readme"></div>

                    </div>
                    <div className="article-container lg:w-4/5 w-1/1 overflow-auto max-h-140">
                        <div>
                            <h1 className="title">Read me</h1>
                            <ReadMeViewer content={userInfo.readme}></ReadMeViewer>
                            
                        </div>
                    </div>  
                </div>
                <div className="article-container lg:w-1/1">
                    <div className="w-1/1 flex flex-col gap-2">
                        <h1 className="title">Articles</h1>
                        <ArticlesComponent articles={articles} categories={categories} limitIndex={5}/>
                    </div>
                </div>
            </div>
        </>
    );
}