"use server"

//import { SignedIn, SignedOut, useUser, UserProfile } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
// Update the import path below to the correct location of your Profile component
import MyProfile from "@/components/profile/my-profile";
import { Author_Subscription } from "@/types/components";

const ProfilePage = async () => {
    const user = await currentUser();

    const res = await fetch(`${process.env.LOCAL_URL}/api/user`, { 
        method: 'POST', 
        next: { revalidate: 10 }, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: user?.id,
        })
    });
    const userInfo: Author_Subscription = await res.json();

    return (
        <div className="page-container">

            <MyProfile userInfo={userInfo}></MyProfile>

        </div>
    )
}

export default ProfilePage;