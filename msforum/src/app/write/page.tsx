export const dynamic = 'force-dynamic';

import WriteComp from "@/components/write/writeComp";
import { SignedIn, SignedOut, useUser, UserProfile, SignIn } from "@clerk/nextjs";

export interface Categories {
    idcat: number,
    name: string,
    description: string,
}

export interface Article {
    idcat: number | undefined,
    title: string,
    content: string,
    user_id: string
}

const WriteArticle = async () => {
    return (
        <SignedIn>
            <div className="ml-10 mr-10 mt-6 lg:ml-48 lg:mr-48 lg:mt-10 p-6 border-2 rounded-2xl">
                <div className="flex flex-row items-center justify-between">
                    <h1 className="font-bold text-2xl">Write an article</h1>
                </div>
                <div className="m-6">
                    <WriteComp></WriteComp>
                </div>
            </div>
        </SignedIn>
    );
}

export default WriteArticle