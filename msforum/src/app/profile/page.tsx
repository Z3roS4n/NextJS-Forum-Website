import { SignedIn, SignedOut, useUser, UserProfile } from "@clerk/nextjs";
import { useContext } from "react";
// Update the import path below to the correct location of your Profile component
import MyProfile from "@/components/profile/my-profile";

const ProfilePage = () => {
    return (
        <div className="page-container">
            <SignedIn>
                <MyProfile></MyProfile>
            </SignedIn>
        </div>
    )
}

export default ProfilePage;