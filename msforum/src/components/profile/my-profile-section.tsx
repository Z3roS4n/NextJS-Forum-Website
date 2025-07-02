"use client"

import { prisma } from "@/lib/prisma";
import { SignedIn, SignedOut, useUser, useReverification } from "@clerk/nextjs";
import { isClerkRuntimeError, isReverificationCancelledError } from "@clerk/nextjs/errors"
import { use, useState, useEffect, cache } from "react";
import Image from "next/image";

import ProfileUsername from "./my-profile-section/username";
import ProfileEmail from "./my-profile-section/email";
import ProfileArticles from "./my-profile-section/articles";

interface Props {
    section: {
        sectionId: string,
        name: string
    }
}

interface UserInfo {
    iduser: string,
    email: string
}

interface User {
    iduser: string;
    subscription: {
        name: string;
    };
}

const MyProfileSection = (props: Props) => {
    const { isSignedIn, isLoaded, user } = useUser();
    const [userInfo, setUserInfo] = useState<User>();

    useEffect(() => {
        const fetchUserInfo = async () => {
            const res = await fetch("http://localhost:3000/api/user", { 
                cache: 'no-store', 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ id: user?.id })
            });
            const data = await res.json();
            setUserInfo(data);
        };
        fetchUserInfo();
    }, []);

    return (
        <>
        <div id={props.section.sectionId} className="flex flex-col">
            <h2 className="font-bold text-xl">{props.section.name}</h2>
            { props.section.sectionId == "informations" ? 
                <>
                    <div className="flex flex-row" id="profile-image">
                        <div>
                            <Image className="rounded-full m-6" src={ user?.imageUrl || "" } alt="Profile Image" width={150} height={150} />
                        </div>
                        <div id="profile-info" className="flex flex-col m-6 text-md w-1/3">

                            {/* USERNAME */}
                            <ProfileUsername></ProfileUsername>

                            {/* EMAIL */}
                            <ProfileEmail></ProfileEmail>
                        </div>
                    </div>
                    <div id="articles" className="flex flex-col w-1/1">
                        {/* ARTICLES */}
                        <ProfileArticles userId={user?.id ?? ""}></ProfileArticles>
                    </div>

                </> :
                <>

                </>
            }
        </div>
        </>
    )
}

export default MyProfileSection;
