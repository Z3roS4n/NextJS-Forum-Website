import { SignedIn, SignedOut, useUser, UserProfile, SignIn } from "@clerk/nextjs";

const WriteArticle = () => {
    return (
        <SignedIn>
            <div className="flex flex-col ml-48 mr-48 mt-20 p-6 border-2 rounded-2xl h-150 max-h-150 overflow-y-auto">
                <h1 className="font-bold text-2xl">Write an article</h1>
            </div>
        </SignedIn>
    );
}

export default WriteArticle