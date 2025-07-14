"use client"

import { prisma } from "@/lib/prisma";
import { SignedIn, SignedOut, useUser, useReverification } from "@clerk/nextjs";
import { isClerkRuntimeError, isReverificationCancelledError } from "@clerk/nextjs/errors"
import { use, useState, useEffect, cache } from "react";
import Image from "next/image";

import ProfileUsername from "./my-profile-section/username";
import ProfileEmail from "./my-profile-section/email";
import ProfileArticles from "./my-profile-section/articles";

import { User_Subscription } from "@/types/components";
import SecurityPassword from "./security-section/password";

interface Props {
    section: {
        sectionId: string,
        name: string
    }
}

const MyProfileSection = (props: Props) => {
    const { isSignedIn, isLoaded, user } = useUser();
    const [userInfo, setUserInfo] = useState<User_Subscription>();

    useEffect(() => {
        const fetchUserInfo = async () => {
            const res = await fetch("http://localhost:3000/api/user", { 
                cache: 'no-store', 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            setUserInfo(data);
        };
        fetchUserInfo();
    }, []);

    const selectedSection = (currentSection: string) => props.section.sectionId != currentSection ? "hidden" : "";

    return (
        <>
            <div id={props.section.sectionId} className="flex flex-col">
                <h2 className="font-bold text-xl">{props.section.name}</h2>
                <div className={selectedSection("informations") + " flex lg:flex-row flex-col justify-between "}>
                    <div className="flex lg:flex-row flex-col lg:w-1/3"  id="profile-image">
                        <div id="profile-info" className="flex flex-col lg:m-6 text-md lg:w-1/1">
                            <div className="flex justify-center">
                                <Image className="rounded-full m-6 w-2/3" src={ user?.imageUrl || "" } alt="Profile Image" width={150} height={150} />
                            </div>

                            {/* USERNAME */}
                            <ProfileUsername></ProfileUsername>

                            {/* EMAIL */}
                            <ProfileEmail></ProfileEmail>
                        </div>
                    </div>
                    <div id="articles" className="flex flex-col mt-6 lg:w-1/2">
                        {/* ARTICLES */}
                        <ProfileArticles userId={user?.id ?? ""}></ProfileArticles>
                    </div>
                </div>

                <div className={selectedSection("security")}>
                    <div>
                        <SecurityPassword></SecurityPassword>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MyProfileSection;
