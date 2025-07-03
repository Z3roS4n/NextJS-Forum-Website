"use client"

import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useState } from "react";
import MyProfileSection from "./my-profile-section";

interface Section {
    section: string
}

const MyProfile = () => {
    const { isSignedIn, isLoaded, user } = useUser();
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
        <div id="userProfile" className="flex lg:flex-row flex-col justify-around">
            { isLoaded ? (
                <>
                <div id="userProfileSideBar" className="ml-10 mr-10 mt-6 lg:ml-48 lg:mt-10 p-6 border-2 rounded-2xl lg:w-1/5 lg:h-150">
                    <h2 className="font-bold text-xl">{user?.username}</h2>
                    <div className="flex lg:flex-col justify-between flex-row pt-2">
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
                <div id="userProfileSection" className="ml-10 mr-10 lg:mr-48 mt-10 lg:mt-10 p-6 border-2 rounded-2xl lg:w-3/4 overflow-y-scroll overflow-x-hidden lg:max-h-150 max-h-220">
                    <MyProfileSection
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
                </>
            ) : (
                <>
                
                </>
            )}
        </div>
    )
}

export default MyProfile;