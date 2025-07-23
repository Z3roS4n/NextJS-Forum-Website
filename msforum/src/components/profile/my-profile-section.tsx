"use client"
import Image from "next/image";

import { Article_Category_Author, Author_Subscription } from "@/types/components";
import UserStats from "./other-user/userstats";
import ReadMeViewer from "./other-user/readmeviewer";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import rehypeSanitize from "rehype-sanitize";
import { useReverification, useUser } from "@clerk/nextjs";
import { isClerkRuntimeError, isReverificationCancelledError } from "@clerk/nextjs/errors";
import { Category } from "@/generated/prisma";
import ArticlesComponent from "../articles/articlesComponent";
import { useError } from "@/app/context/ErrorContext";
import { useQueries, useQuery } from "@tanstack/react-query";

interface MyProfileSectionParams {
    userInfo: Author_Subscription;
    section: {
        sectionId: string;
        name: string;
    }
}

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const MyProfileSection = ({ userInfo, section }: MyProfileSectionParams) => {
    const { user } = useUser();
    const changeUsername = useReverification((newUsername: string) => user?.update({ username: newUsername }));
    const { showError } = useError();
    
    const [RMContent, setRMContent] = useState<string>(userInfo.readme);
    const [UserBio, setUserBio] = useState<string>(userInfo.bio);
    const [Username, setUsername] = useState<string>(userInfo.username);
    
    const { data: Articles, isPending: loadingArticles, error: errorArticles } = useQuery<Article_Category_Author[]>({
        queryKey: ['articles', userInfo.user_id],
        queryFn: async () => {
            const res = await fetch(`/api/articles?user_id=${userInfo.user_id}`, {
                next: { revalidate: 30 },
            });
            if (!res.ok) throw new Error('Errore articoli');
            return res.json();
        },
        enabled: !!userInfo.user_id,
    });

    const { data: Categories, isPending: loadingCategories, error: errorCategories } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await fetch(`/api/manageArticle?action=getExistingCategories`, {
                next: { revalidate: 120 },
            });
            if (!res.ok) throw new Error('Errore categorie');
            return res.json();
        },
    });

    const postUserChanges = async (action: string) => {
        try {
            if(action == 'set_bio')
                fetch(`/api/user`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        action: action,
                        data: {
                            bio: UserBio,
                        }
                    })
                })
            if(action == 'set_readme')
                fetch(`/api/user`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        action: action,
                        data: {
                            readme: RMContent,
                        }
                    })
                })
        } catch (error) {
            return showError("There was an unexpected error, retry later.", "Client Error")
        }
    }

    const handleSaveEdits = async () => {
        try {
            
            if(userInfo.username !== Username) {
                await changeUsername(Username);
            }
            
            if(userInfo.bio !== UserBio) {
                await postUserChanges('set_bio');
            }

            if(RMContent != userInfo.readme) {
                await postUserChanges('set_readme');
            }

        } catch (error) {
            if (isClerkRuntimeError(error) || isReverificationCancelledError(error)) {
                console.error('Error updating profile:', error);
            }
        }
    }
    const selectedSection = (currentSection: string) => section.sectionId == currentSection ? true : false;

    const detectChanges = (): number => {
        let changes = 0;
        if(UserBio != userInfo.bio)
            changes++;
        if(Username != userInfo.username)
            changes++;
        if(RMContent != userInfo.readme)
            changes++;

        return changes;
    }

    return (
        <>
            <div id={section.sectionId} className="flex flex-col">
                <div className="flex lg:flex-row flex-col lg:gap-2">
                    <div className="w-1/1">
                        <div id="user-info" className="flex flex-col items-center justify-center w-1/1 gap-2">
                            <h1 className="title self-start">{section.name}</h1>
                            {/* INFORMATIONS SECTION */}
                            <div hidden={!selectedSection("informations")} className="w-1/1 flex lg:flex-row flex-col gap-2">
                                <div className="flex flex-col gap-2 lg:w-1/5 w-1/1 article-container">
                                    <h1 className="font-bold text-xl self-center">Profile Preview</h1>
                                    <div className="flex flex-row justify-center items-center gap-10 mt-4">
                                        <Image className="rounded-full" src={userInfo.profile_picture ?? '/default.jpg'} alt={"profile-image"} width={200} height={200}></Image>
                                    </div>                            
                                    <div className="flex flex-col justify-center">
                                        <div className="flex flex-col mt-4 justify-center items-center">
                                            <span className="block text-gray-500">Username</span>
                                            <span className="font-medium text-lg">{userInfo.username}</span>
                                            <span className="block text-gray-500">Subscription</span>
                                            <span className="font-medium text-lg">{userInfo.subscription?.name ?? "Starter User"}</span>
                                            <span className="block text-gray-500">Bio</span>
                                            <span className="font-medium text-lg text-wrap">{userInfo.bio}</span> 
                                        </div>
                                    </div>                                
                                    <div className="flex gap-2">
                                        <UserStats user_id={userInfo.user_id}></UserStats>
                                    </div>
                                </div>
                                <div className="article-container flex flex-col gap-2 lg:w-2/5 w-1/1">
                                    <div className="flex flex-col gap-2 w-1/1">
                                        <div className="flex flex-col w-1/1">
                                            <label htmlFor="set-username" className="font-bold text-lg">Username</label>
                                            <input id="set-username" defaultValue={Username} onChange={(e) => setUsername(e.target.value)} className="input lg:w-1/1" maxLength={128}/>
                                        </div>
                                        <div className="flex flex-col w-1/1">
                                            <label htmlFor="set-username" className="font-bold text-lg">Email Address</label>
                                            <input id="set-username" value={userInfo.email} className="input lg:w-1/1" maxLength={128} readOnly/>
                                        </div>
                                        <div className="flex flex-col w-1/1">
                                            <label htmlFor="set-userbio" className="font-bold text-lg">Your Bio</label>
                                            <textarea id="set-userbio" defaultValue={UserBio} onChange={(e) => setUserBio(e.target.value)} className="input lg:w-1/1 resize-none h-30" maxLength={128}/>
                                        </div>   
                                    </div>

                                    <div className="w-1/1">
                                        <button onClick={handleSaveEdits} disabled={detectChanges() ? false : true} className="btn-primary lg:w-1/4 w-1/1 button-disabled">Save edits</button>
                                    </div>
                                </div>
                                <div className="article-container flex flex-col lg:w-2/5 overflow-auto max-h-140">
                                    <h1 className="font-bold text-xl self-center">Readme Preview</h1>
                                    <ReadMeViewer content={userInfo.readme}></ReadMeViewer>
                                </div>
                            </div>

                            <div hidden={!selectedSection("readme")} className="w-1/1 flex lg:flex-row flex-col gap-2">
                                <div className="article-container lg:w-3/5">
                                    <div className="flex flex-col gap-2 w-1/1">
                                        <MDEditor
                                            value={RMContent}
                                            onChange={(value = "") => setRMContent(value)}
                                            data-color-mode="light"
                                            preview="edit"
                                            height={400}
                                            maxHeight={400}
                                            previewOptions={{
                                                rehypePlugins: [rehypeSanitize],
                                            }}
                                        />
                                        <div className="self-end not-lg:w-1/1">
                                           <button className="btn-primary not-lg:w-1/1 button-disabled" onClick={handleSaveEdits} disabled={detectChanges() ? false : true}>Save edits</button> 
                                        </div>
                                    </div>
                                </div>  
                                <div className="article-container flex-col lg:w-2/5 overflow-auto max-h-122 justify-start">
                                    <h1 className="font-bold text-xl self-center">Realtime Preview</h1>
                                    <ReadMeViewer content={RMContent}></ReadMeViewer>
                                </div>
                                
                            </div>

                            <div hidden={!selectedSection("security")} className="w-1/1">
                                <div className="article-container w-1/1">
                                </div>
                            </div>

                            <div hidden={!selectedSection("articles")} className="w-1/1">
                                <div className="article-container flex-col gap-2 w-1/1">
                                    { errorArticles || errorCategories ? <div>Errore nel caricamento</div> : '' }
                                    { 
                                        loadingArticles || loadingCategories ? <div>Loading...</div>
                                        : <ArticlesComponent articles={Articles || []} categories={Categories || []} limitIndex={5}/>
                                    }
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MyProfileSection;
