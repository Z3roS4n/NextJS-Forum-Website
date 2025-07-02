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
            name: "Informations"
        },
        {
            id: "security",
            name: "Security"
        }
    ];

    const changeSection = (sectionId: string) => {
        setSection({ section: sectionId });
    }

    return (
        <div id="userProfile" className="flex flex-row justify-around">
            { isLoaded ? (
                <>
                <div id="userProfileSideBar" className="ml-48 mt-20 p-6 border-2 rounded-2xl w-1/5 h-150">
                    <h2 className="font-bold text-xl">{user?.username}</h2>
                    <div className="flex flex-col pt-2">
                        {
                            sections.map((sec) => (
                                <p key={sec.id} className="items-center hover:bg-gray-200 rounded-md p-2" id={sec.id} onClick={(e) => changeSection(e.currentTarget.id)}>
                                    {sec.name}
                                </p>
                            ))
                        }
                    </div>
                </div>
                <div id="userProfileSection" className="ml-16 mr-48 mt-20 p-6 border-2 rounded-2xl w-3/4 overflow-y-scroll max-h-150">
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