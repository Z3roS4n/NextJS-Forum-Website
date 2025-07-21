"use client"

import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, useUser, UserButton } from "@clerk/nextjs";

const NavBar = () => {
    const { isLoaded, isSignedIn, user} = useUser();

    return (
        <nav className="p-6 flex flex-row justify-between page-container article-container">
            <div className="not-lg:hidden">
                <Image src={"/logoBiton.png"} alt={"BitonDevLogo"} width={175} height={100}></Image>
            </div>
            <div className="flex flex-row flex-nowrap items-center">
                <Link className="pr-6 font-medium" href='/'>Home</Link>

                <Link className="pr-6 font-medium" href='/articles'>Articles</Link>

                <SignedIn>
                    {/*<Link className="flex flex-row justify-center font-medium items-center" href='/profile'>
                    Profile
                    { user?.imageUrl ? 
                    <Image className="rounded-2xl ml-3" src={user.imageUrl ?? "/default-profile.png"} alt="Profile" width={30} height={30} />
                    : <p>N.D.</p>}
                    </Link>*/}
                    <Link className="pr-6 font-medium" href='/write'>Write</Link>
                    <UserButton userProfileUrl="/profile" showName></UserButton>
                </SignedIn>
                <SignedOut>
                    <Link className="font-medium" href='/sign-in'>Sign In</Link>
                </SignedOut>
            </div>
        </nav>
    );
}

export default NavBar;