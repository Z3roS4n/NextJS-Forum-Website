"use client"

import { SignedIn, SignedOut, useUser, useReverification } from "@clerk/nextjs";
import { isClerkRuntimeError, isReverificationCancelledError } from "@clerk/nextjs/errors"
import { use, useState, useEffect } from "react";

const SecurityPassword = () => {
    const { isSignedIn, isLoaded, user } = useUser();
    const [actualPassword, setActualPassword] = useState<string>("");

    const [showToken, setShowToken] = useState<boolean>(false);

    const toggleShowToken = () => setShowToken(showToken ? false : true)

    return (
        <>
            <div className="flex flex-col lg:w-1/2 mt-6">
                <label htmlFor="password">Actual Password</label>
                <div className="flex flex-row">
                    <input
                        id="password"
                        className="p-2 border-2 rounded-xl w-1/1"
                        type="text"
                        defaultValue=""
                    />
                </div>
                <label htmlFor="new_password">New Password</label>
                <div className="flex flex-row">
                    <input
                        id="new_password"
                        className="p-2 border-2 rounded-xl w-1/1"
                        type="text"
                        defaultValue=""
                    />
                </div>
                <button type="button" className="btn-primary mt-4 lg:w-1/3">Update Password</button>
            </div>
            <div className="flex flex-col lg:w-1/2 mt-6">
                <label htmlFor="password">Your API TOKEN</label>
                <div className="flex flex-row">
                    <input
                        id="password"
                        className="p-2 border-2 w-1/1 button-attached"
                        type={showToken ? "text" : "password"}
                        defaultValue="weweeweew"
                    />
                    <button type="button" className="btn-primary input-attached" onClick={() => toggleShowToken()}>{showToken ? "Hide" : "Show"}</button>
                </div>
            </div>
        </>
    )
}

export default SecurityPassword;