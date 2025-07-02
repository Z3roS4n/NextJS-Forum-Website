"use client"

import { SignedIn, SignedOut, useUser, useReverification } from "@clerk/nextjs";

const ProfileEmail = () => {
    const { isSignedIn, isLoaded, user } = useUser();

    return (
        <>
            <label htmlFor="email">Email</label>
            <div className="flex flex-row">
                {user?.emailAddresses.map((email) => (
                    <input id="email" key={email.id}
                    className="p-2 border-2 rounded-xl w-1/1"
                    value={email.emailAddress}
                    readOnly />
                ))}
            </div>
        </>
    )
}

export default ProfileEmail;