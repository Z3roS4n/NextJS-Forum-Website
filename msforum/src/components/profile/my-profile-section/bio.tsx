"use client"

import { useState } from "react";

interface MyProfileBioParams {
    user_bio: string;
}

const MyProfileBio = ({ user_bio }: MyProfileBioParams) => {
    const [ bio, setBio ] = useState<string>();

    return (
        <>
            <div className="flex flex-col gap-2">
                <label htmlFor="bio">Bio</label>
                <div>
                    <input id="bio" name="bio" className="input" defaultValue={user_bio}></input>
                </div>
                <button type="button" className="btn-primary w-1/2">Save</button>

            </div>
        </>
    );
}

export default MyProfileBio