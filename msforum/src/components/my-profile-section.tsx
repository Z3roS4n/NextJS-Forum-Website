"use client"

import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useState } from "react";
import Image from "next/image";

interface Section {
    section: string
}

interface Props {
    section: {
        sectionId: string,
        name: string
    }
}

const MyProfileSection = (props: Props) => {
    const { isSignedIn, isLoaded, user } = useUser();

    return (
        <div id={props.section.sectionId} className="flex flex-col">
            <h2 className="font-bold text-xl">{props.section.name}</h2>
            { props.section.sectionId == "informations" ? 
                <>
                    <div className="flex flex-row" id="profile-image">
                        <Image className="rounded-full m-6" src={ user?.imageUrl || "" } alt="Profile Image" width={100} height={100} />
                        <div id="profile-info" className="flex flex-col m-6 text-md">
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                className="p-2"
                                type="text"
                                value={user?.username ?? ""}
                                onChange={() => {}}
                            />
                        </div>
                    </div>
                </> :
                <>

                </>
            }
        </div>
    )
}

export default MyProfileSection;