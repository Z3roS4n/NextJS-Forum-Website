"use client"

interface ProfileEmailParams {
    email: string;
}

const ProfileEmail = ({ email }: ProfileEmailParams) => {

    return (
        <>
            <label htmlFor="email">Email</label>
            <div className="flex flex-row">
                <input id="email"
                className="p-2 border-2 rounded-xl w-1/1"
                value={email}
                readOnly />
            </div>
        </>
    )
}

export default ProfileEmail;