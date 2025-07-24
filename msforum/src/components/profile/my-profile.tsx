"use client"

import { useState } from "react";
import MyProfileSection from "./my-profile-section";
import { Author_Subscription, User_Subscription } from "@/types/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faQuoteLeft, faCertificate, faShield, faBook, faCircleInfo } from "@fortawesome/free-solid-svg-icons"

interface Section {
    section: string
}

interface MyProfileParams {
    userInfo: Author_Subscription;
}

const MyProfile = ({ userInfo }: MyProfileParams) => {
    const [ section, setSection ] = useState<Section>({ section: "informations" });

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
        {
            id: "security",
            name: "Security",
            icon: <FontAwesomeIcon icon={faShield}></FontAwesomeIcon>
        },
        {
            id: "articles",
            name: "Articles",
            icon: <FontAwesomeIcon icon={faCircleInfo}></FontAwesomeIcon>
        },
        {
            id: "badges",
            name: "Badges",
            icon: <FontAwesomeIcon icon={faCertificate}></FontAwesomeIcon>
        },
    ];

    const changeSection = (sectionId: string) => {
        setSection({ section: sectionId });
    }

    return (
        <div id="userProfile" className="flex lg:flex-col flex-col justify-around gap-2">
            <div id="userProfileSideBar" className="rounded-2xl flex lg:flex-row flex-col items-center gap-2">
                <div className="article-container not-lg:w-1/1 flex flex-row gap-2">
                    {
                        sections.map((sec) => (
                            <div key={sec.id}>
                                <p className="not-lg:hidden items-center hover:bg-gray-200 rounded-md p-2" id={sec.id} onClick={(e) => changeSection(e.currentTarget.id)}>
                                    {sec.name}
                                </p>
                                <p className={`lg:hidden text-3xl items-center hover:bg-gray-200 rounded-md p-2`} id={sec.id} onClick={(e) => changeSection(e.currentTarget.id)}>
                                    {sec.icon}
                                </p>
                            </div>
                        ))
                    }
                </div>
                <div className="article-container flex flex-row self-start gap-2"> {/* bg-transparent shadow-none border-0 not-lg:m-0 */}
                    <button 
                        className="items-center hover:bg-gray-200 rounded-md p-2 text-2xl"
                        type="button"><FontAwesomeIcon icon={faEnvelope} /> 
                        {/* 
                            TanStack Query to `/api/notifications?user_id=${userInfo.user_id}`,
                            poi apre con un dropdown le notifiche (con scroll controllato, solo ultime 30)
                        */}
                    </button>
                    <button 
                        className="items-center hover:bg-gray-200 rounded-md p-2 text-2xl"
                        type="button"><FontAwesomeIcon icon={faQuoteLeft} />
                        {/*
                            TanStack Query to `/api/mentions/retrieve?user_id=${userInfo.user_id}`,
                            poi apre con un dropdown le mentions (con scroll controllato, solo ultime 30) 
                        */}
                    </button>
                </div>
            </div>
            <div id="userProfileSection">
                <MyProfileSection
                    userInfo={userInfo}
                    section={
                        (() => {
                            const sec = sections.find((s) => s.id === section.section);
                            return sec
                                ? { sectionId: sec.id, name: sec.name }
                                : { sectionId: "", name: "" };
                        })()
                    }
                />
            </div>
        </div>
    )
}

export default MyProfile;