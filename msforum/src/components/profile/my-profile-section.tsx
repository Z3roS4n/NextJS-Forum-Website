//import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

import ProfileUsername from "./my-profile-section/username";
import ProfileEmail from "./my-profile-section/email";
import ProfileArticles from "./my-profile-section/articles";

import { Author_Subscription } from "@/types/components";
import SecurityPassword from "./security-section/password";
import MyProfileBio from "./my-profile-section/bio";

interface MyProfileSectionParams {
    userInfo: Author_Subscription;
    section: {
        sectionId: string;
        name: string;
    }
}

const MyProfileSection = ({ userInfo, section }: MyProfileSectionParams) => {
    const user = userInfo;
    if(!user?.user_id)
        return <><div>Please, log in.</div></>

    const selectedSection = (currentSection: string) => section.sectionId != currentSection ? "hidden" : "";

    return (
        <>
            <div id={section.sectionId} className="flex flex-col">
                <h2 className="font-bold text-xl">{section.name}</h2>
                <div className={selectedSection("informations") + " flex flex-row justify-between flex-wrap w-1/1"}>
                    <div className="flex lg:flex-row flex-col lg:w-1/1"  id="profile-image">
                        <div id="profile-info" className="flex lg:flex-row flex-col lg:m-6 text-md lg:w-1/1 lg:items-center">
                            <div className="flex justify-center">
                                <Image className="rounded-full m-6 w-2/3" src={ userInfo.profile_picture ?? "" } alt="Profile Image" width={150} height={150} />
                            </div>

                            <div>
                                {/* USERNAME */}
                                <ProfileUsername></ProfileUsername>

                                {/* EMAIL */}
                                <ProfileEmail email={userInfo.email}></ProfileEmail>      
                            </div>

                            <div>
                                <MyProfileBio user_bio={userInfo.bio}/>
                            </div>

                        </div>
                    </div>
                    <div id="articles_readme" className="flex flex-col w-1/1 mt-6">
                        Something,..
                        {/* ARTICLES */}
                        <ProfileArticles userId={user?.user_id ?? ""}></ProfileArticles>
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
