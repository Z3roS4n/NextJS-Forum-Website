"use server"

//import { SignedIn, SignedOut, useUser, UserProfile } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
// Update the import path below to the correct location of your Profile component
import MyProfile from "@/components/profile/my-profile";
import { Author_Subscription } from "@/types/components";

const ProfilePage = async () => {
    const user = await currentUser();

    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/user?id=${user?.id}`, { next: { revalidate: 10 } });
    const userInfo: Author_Subscription = await res.json();

    return (
        <div className="page-container">
            <MyProfile userInfo={userInfo}></MyProfile>
        </div>
    )
}

export default ProfilePage;