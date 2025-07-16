"use client"

import { useState } from "react";
import MyProfileSection from "./my-profile-section";
import { Author_Subscription, User_Subscription } from "@/types/components";

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
            icon: "fa-solid fa-circle-info"
        },
        {
            id: "security",
            name: "Security",
            icon: "fa-solid fa-shield"
        },
        {
            id: "badges",
            name: "Badges",
            icon: "fa-solid fa-certificate"
        },
    ];

    const changeSection = (sectionId: string) => {
        setSection({ section: sectionId });
    }

    return (
        <div id="userProfile" className="flex lg:flex-col flex-col justify-around gap-2">
            <div id="userProfileSideBar" className="rounded-2xl flex flex-row items-center">
                <div className="flex justify-between flex-row gap-2">
                    {
                        sections.map((sec) => (
                            <div key={sec.id}>
                                <p className="not-lg:hidden items-center hover:bg-gray-200 rounded-md p-2" id={sec.id} onClick={(e) => changeSection(e.currentTarget.id)}>
                                    {sec.name}
                                </p>
                                <p className={`lg:hidden text-3xl items-center hover:bg-gray-200 rounded-md p-2`} id={sec.id} onClick={(e) => changeSection(e.currentTarget.id)}>
                                    <i className={sec.icon}></i>
                                </p>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div id="userProfileSection" className="article-container">
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