"use server"

//import { SignedIn, SignedOut, useUser, UserProfile } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
// Update the import path below to the correct location of your Profile component
import MyProfile from "@/components/profile/my-profile";
import { Author_Subscription } from "@/types/components";

const ProfilePage = async () => {
    return (
        <div className="page-container">
            <MyProfile></MyProfile>
        </div>
    )
}

export default ProfilePage;