import WriteComp from "@/components/write/writeComp";
import { Category } from "@/types/components";
import { SignedIn } from "@clerk/nextjs";

const WriteArticle = async () => {
    const req_articleCategories = await fetch('http://localhost:3000/api/manageArticle?action=getExistingCategories', { cache: 'no-store' });
    const categories: Category[] = await req_articleCategories.json();

    return (
        <SignedIn>
            <div className="page-container gap-4">
                <div className="flex flex-row items-center justify-between">
                    <h1 className="font-bold text-2xl">Write an article</h1>
                </div>
                <div className="">
                    <WriteComp categories={categories}></WriteComp>
                </div>
            </div>
        </SignedIn>
    );
}

export default WriteArticle;