"use client"

import { use, useEffect, useState } from "react";
import { Author_Subscription, User_Subscription } from "@/types/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faQuoteLeft, faCertificate, faShield, faBook, faCircleInfo } from "@fortawesome/free-solid-svg-icons"
import LabeledText from "../ui/labeledText";
import UserStats from "./other-user/userstats";
import InputComponent from "../ui/input";
import ReadMeViewer from "./other-user/readmeviewer";
import dynamic from "next/dynamic";
import { useReverification, useUser } from "@clerk/nextjs";
import { useError } from "@/app/context/ErrorContext";
import rehypeSanitize from "rehype-sanitize";
import ArticlesComponent from "../articles/articlesComponent";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ApiRequest from "@/lib/apiRequest";

interface Section {
    section: string
}

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const sections = [
    {
        id: "informations",
        name: "Informations",
        icon: <FontAwesomeIcon icon={faCircleInfo}></FontAwesomeIcon>
    },
    {
        id: "readme",
        name: "Read Me",
        icon: <FontAwesomeIcon icon={faBook}></FontAwesomeIcon>
    },
    /*{
        id: "notifications",
        name: "Notifications",
        icon: <FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon>
    },
    {
        id: "security",
        name: "Security",
        icon: <FontAwesomeIcon icon={faShield}></FontAwesomeIcon>
    },*/
    {
        id: "articles",
        name: "Articles",
        icon: <FontAwesomeIcon icon={faCircleInfo}></FontAwesomeIcon>
    },
    /*{
        id: "badges",
        name: "Badges",
        icon: <FontAwesomeIcon icon={faCertificate}></FontAwesomeIcon>
    },*/
];

const MyProfile = () => {
    const { user } = useUser();
    const queryClient = useQueryClient();
    const { showError } = useError();
    const changeUsername = useReverification((newUsername: string) => user?.update({ username: newUsername }));

    const { data: userInfo, isLoading: userLoading } = useQuery<Author_Subscription>({
        queryKey: ['user'],
        queryFn: async () => {
            return await ApiRequest.getData({ url: '/api/user', params: { id: user?.id } });
        },
        staleTime: 0,
        gcTime: 0,
        enabled: !!user
    })

    const [section, setSection] = useState<Section>({ section: "informations" });
    const [RMContent, setRMContent] = useState<string>(userInfo?.readme ?? "");
    const [UserBio, setUserBio] = useState<string>(userInfo?.bio ?? "");
    const [Username, setUsername] = useState<string>(userInfo?.username ?? "");

    useEffect(() => {
        setRMContent(userInfo?.readme ?? "");
        setUserBio(userInfo?.bio ?? "");
        setUsername(userInfo?.username ?? "");
    }, [userInfo]);

    const updateUser = useMutation({
        mutationFn: async () => {
            await changeUsername(Username);
            return await ApiRequest.putData({ url: '/api/user', body: { data: { bio: UserBio, readme: RMContent} } });
        },
        onSuccess: async () => {
            queryClient.invalidateQueries({
                queryKey: ['user']
            });
        }
    })

    const changeSection = (sectionId: string) => {
        setSection({ section: sectionId });
    }

    const handleSave = () => {
        try {
            updateUser.mutate();
        } catch (error) {
            showError("There was an error saving your informations, reload the page and try again.", "Saving Error!");
        }
    }

    const selectedSection = (currentSection: string) => section.section == currentSection ? true : false;

    const checkSelected = (selSection: string) => {
        return section.section == selSection ? 'bg-[#D4E2FF]' : '';
    }

    const detectChanges = (): number => {
        let changes = 0;
        if(UserBio != userInfo?.bio)
            changes++;
        if(Username != userInfo?.username)
            changes++;
        if(RMContent != userInfo?.readme)
            changes++;

        return changes;
    }


    return (
        <div id="userProfile" className="flex lg:flex-col flex-col justify-around gap-2">
            <div id="userProfileSideBar" className="rounded-2xl flex lg:flex-row flex-col items-center gap-2">
                <div className="article-container not-lg:w-1/1 flex flex-row gap-2">
                    {
                        sections.map((sec) => (
                            <div key={sec.id}>
                                <p className={"not-lg:hidden items-center hover:bg-gray-200 rounded-md p-2 " + checkSelected(sec.id)} id={sec.id} onClick={(e) => changeSection(e.currentTarget.id)}>
                                    {sec.name}
                                </p>
                                <p className={`lg:hidden text-2xl items-center hover:bg-gray-200 rounded-md p-2 ` + checkSelected(sec.id)} id={sec.id} onClick={(e) => changeSection(e.currentTarget.id)}>
                                    {sec.icon}
                                </p>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div id="userProfileSection">
                <div id={section.section} className="flex flex-col">
                <div className="flex lg:flex-row flex-col lg:gap-2">
                    <div className="w-1/1">
                        <div id="user-info" className="flex flex-col items-center justify-center w-1/1 gap-2">
                            <h1 className="title self-start">{sections.find(s => s.id === section.section)?.name ?? ""}</h1>
                                {/* INFORMATIONS SECTION */}
                                <div hidden={!selectedSection("informations")} className="w-1/1 flex lg:flex-row flex-col gap-2">
                                    <div className="flex flex-col gap-2 lg:w-1/5 w-1/1 article-container">
                                        <h1 className="font-bold text-xl self-center">Profile Preview</h1>
                                        <div className="flex flex-row justify-center items-center gap-10 mt-4">
                                            <Image className="rounded-full" src={userInfo?.profile_picture ?? '/default.jpg'} alt={"profile-image"} width={200} height={200}></Image>
                                        </div>    

                                        <div className="flex flex-col justify-center">
                                            <div className="flex flex-col justify-center gap-2">
                                                <div className="flex flex-row items-center justify-around">
                                                    <LabeledText head={'Username'}>{userInfo?.username}</LabeledText>
                                                    <LabeledText head={'Subscription'}>{userInfo?.subscription?.name ?? "Starter User"}</LabeledText>
                                                </div>
                                                <LabeledText head={`Something about ${userInfo?.username}...`}>{userInfo?.bio}</LabeledText>
                                            </div>
                                        </div>          

                                        <div>
                                            <UserStats user_id={userInfo?.user_id ?? ""}></UserStats>
                                        </div>
                                    </div>
                                    <div className="article-container flex flex-col gap-2 lg:w-2/5 w-1/1">
                                        <div className="flex flex-col gap-2 w-1/1">
                                            <div className="flex lg:flex-row flex-col gap-2">
                                                <InputComponent label="Username" default={Username} onChange={(e) => setUsername(e.target.value)} maxLength={64}></InputComponent>
                                                <InputComponent label="Email Address" default={userInfo?.email} readOnly></InputComponent>
                                            </div> 
                                            <InputComponent label="Your Bio(logical life-form)" type="textarea" default={UserBio} onChange={(e) => setUserBio(e.target.value)} maxLength={128}></InputComponent>
                                        </div>

                                        <div className="w-1/1">
                                            <button onClick={handleSave} disabled={detectChanges() ? false : true} className="btn-primary lg:w-1/4 w-1/1 button-disabled">Save edits</button>
                                        </div>
                                    </div>
                                    <div className="article-container flex flex-col lg:w-2/5 overflow-auto max-h-170">
                                        <h1 className="font-bold text-xl self-center">Readme Preview</h1>
                                        <ReadMeViewer content={RMContent}></ReadMeViewer>
                                    </div>
                                </div>

                                <div hidden={!selectedSection("readme")} className="w-1/1 flex lg:flex-row flex-col gap-2">
                                    <div className="article-container lg:w-3/5">
                                        <div className="flex flex-col gap-2 w-1/1">
                                            <MDEditor
                                                value={RMContent}
                                                onChange={(value?: string) => setRMContent(value ?? "")}
                                                data-color-mode="light"
                                                preview="edit"
                                                height={400}
                                                maxHeight={400}
                                                previewOptions={{
                                                    rehypePlugins: [rehypeSanitize],
                                                }}
                                            />
                                            <div className="self-end not-lg:w-1/1">
                                            <button className="btn-primary not-lg:w-1/1 button-disabled" onClick={handleSave} disabled={detectChanges() ? false : true}>Save Edits</button> 
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
                                        <ArticlesComponent limitIndex={5} user_id={userInfo?.user_id}/>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyProfile;