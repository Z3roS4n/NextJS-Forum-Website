"use client"

import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, useUser, UserButton } from "@clerk/nextjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import { useError } from "@/app/context/ErrorContext";
import NotifDropdownComponent from "./ui/notifDropdown";

const NavBar = () => {
    const { isLoaded, isSignedIn, user} = useUser();
    const { showError} = useError()

    return (
        <nav className="p-6 flex flex-row justify-between page-container article-container mb-4">
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
                    <div className="flex flex-row gap-4">
                        <NotifDropdownComponent/>
                        <span className="items-center rounded-md text-xl">
                            <FontAwesomeIcon icon={faQuoteLeft} />
                            {/*
                                TanStack Query to `/api/mentions/retrieve?user_id=${userInfo.user_id}`,
                                poi apre con un dropdown le mentions (con scroll controllato, solo ultime 30) 
                            */}
                        </span>
                        <UserButton userProfileUrl="/profile" showName></UserButton>  
                    </div>

                    
                </SignedIn>
                <SignedOut>
                    <Link className="font-medium" href='/sign-in'>Sign In</Link>
                </SignedOut>
            </div>
        </nav>
    );
}

export default NavBar;