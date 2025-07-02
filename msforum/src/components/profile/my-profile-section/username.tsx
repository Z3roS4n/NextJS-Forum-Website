"use client"

import { SignedIn, SignedOut, useUser, useReverification } from "@clerk/nextjs";
import { isClerkRuntimeError, isReverificationCancelledError } from "@clerk/nextjs/errors"
import { use, useState, useEffect } from "react";

const ProfileUsername = () => {
    const { isSignedIn, isLoaded, user } = useUser();
    const [newUsername, setNewUsername] = useState(user?.username ?? '');

    const changeUsername = useReverification((newUsername: string) => user?.update({ username: newUsername }));
    const handleUsernameChange = async () => {
        try {
            await changeUsername(newUsername);
        } catch ( e ) {
            if (isClerkRuntimeError(e) && isReverificationCancelledError(e)) {
                console.error('User cancelled reverification', e.code)
            }
        }
    }

    return (
        <>
            <label htmlFor="username">Username</label>
            <div className="flex flex-row">
                <input
                    id="username"
                    className="p-2 border-2 rounded-tl-xl rounded-bl-xl w-1/1"
                    type="text"
                    defaultValue={user?.username ?? ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewUsername(e?.target.value)}
                />
                <button type="button"
                        className="text-center bg-blue-600 pr-4 pl-4 rounded-tr-xl rounded-br-xl text-white hover:bg-blue-700 transition-colors delay-150"
                        onClick={handleUsernameChange}>
                    Save
                </button>
            </div>
        </>
    )
}

export default ProfileUsername;