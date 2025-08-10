"use client"

import { useUser } from "@clerk/nextjs";
import ArticlesComponent from "@/components/articles/articlesComponent";
import FollowComponent from "@/components/profile/other-user/follow";

import ReadMeViewer from "@/components/profile/other-user/readmeviewer";
import UserStats from "@/components/profile/other-user/userstats";
import LoadingComponent from "@/components/ui/loading";
import { Category } from "@/generated/prisma";
import { Article_Category_Author, Author_Subscription } from "@/types/components";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";
import LabeledText from "@/components/ui/labeledText";

export default function ProfilesPage() {
    const { slug } = useParams<{ slug: string }>();

    const { data: userInfo, isLoading: userInfoLoading } = useQuery<Author_Subscription>({
        queryKey: ['userInfo', slug],
        queryFn: async () => {
            const res = await fetch(`/api/user?id=${slug}`);
            if(!res.ok) throw new Error('Fetch Error!');
            return res.json();
        },
        enabled: !!slug,
        gcTime: 1000 * 10,
        staleTime: 1000 * 10
    })

    return (
        <>
            <div className="page-container">
                <div className="flex lg:flex-row flex-col lg:gap-2">
                    <div className="article-container lg:w-1/5 w-1/1 max-h-180">
                        { !userInfo ? <LoadingComponent/> :
                            <div id="user-info" className="flex flex-col items-center w-1/1 gap-3">
                                <h1 className="title self-start">Informations</h1>
                                <div className="flex flex-row items-start gap-10 mt-4">
                                    <Image className="rounded-full" src={userInfo.profile_picture ?? '/default-profile-img.png'} alt={"profile-image"} width={200} height={200}></Image>
                                </div>       
                                                    
                                <div className="flex flex-col justify-center">
                                    <div className="flex flex-col justify-center gap-2">
                                        <div className="flex flex-row items-center justify-around">
                                            <LabeledText head={'Username'}>{userInfo.username}</LabeledText>
                                            <LabeledText head={'Subscription'}>{userInfo.subscription?.name ?? "Starter User"}</LabeledText>
                                        </div>
                                        <LabeledText head={`Something about ${userInfo.username}...`}>{userInfo.bio}</LabeledText>
                                    </div>
                                </div>  

                                <div className="flex justify-end flex-col gap-4">
                                    <div className="w-1/1 flex flex-row justify-center">
                                        <FollowComponent btnClassName="w-2/3" user_id={slug}/> 
                                    </div>
                                    <div className="flex flex-row gap-2">
                                        <UserStats user_id={slug}></UserStats>
                                    </div>               
                                </div>

                            </div>
                        }
                        <div id="user-readme"></div>

                    </div>
                    <div className="article-container lg:w-4/5 w-1/1 overflow-auto max-h-180">
                        <div>
                            <h1 className="title">Read me</h1>
                            { !userInfo ? <LoadingComponent/> :
                                <ReadMeViewer content={userInfo.readme}/>
                            }
                            
                        </div>
                    </div>  
                </div>
                <div className="article-container lg:w-1/1">
                    <div className="w-1/1 flex flex-col gap-2">
                        <h1 className="title">Articles</h1>
                        <ArticlesComponent limitIndex={5} user_id={slug}/>
                    </div>
                </div>
            </div>
        </>
    );
}