import WriteComp from "@/components/write/writeComp";
import { Category } from "@/types/components";
import { SignedIn } from "@clerk/nextjs";

const WriteArticle = async () => {
    const req_articleCategories = await fetch('http://localhost:3000/api/manageArticle?action=getExistingCategories', { cache: 'no-store' });
    const categories: Category[] = await req_articleCategories.json();

    return (
        <SignedIn>
            <div className="ml-10 mr-10 mt-6 lg:ml-48 lg:mr-48 lg:mt-10 p-6 border-2 rounded-2xl">
                <div className="flex flex-row items-center justify-between">
                    <h1 className="font-bold text-2xl">Write an article</h1>
                </div>
                <div className="m-6">
                    <WriteComp categories={categories}></WriteComp>
                </div>
            </div>
        </SignedIn>
    );
}

export default WriteArticle;