"use client"

import { useState } from "react"

interface FollowParams {
    user_id: string;
    btnClassName?: string;
    onUpdate?: () => {};
}

const FollowComponent = ({ user_id, btnClassName, onUpdate }: FollowParams) => {
    const [ follow, setFollow ] = useState<boolean>(false);
    
    return (
        <>
            <button className={`${follow ? "btn-secondary" : "btn-primary"} ${btnClassName}`}  onClick={() => setFollow(!follow)}>{follow ? "Unfollow" : "Follow"}</button>
        </>
    )
}

export default FollowComponent;