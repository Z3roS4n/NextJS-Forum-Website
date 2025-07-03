import WriteComp from "@/components/write/writeComp";
import { SignedIn, SignedOut, useUser, UserProfile, SignIn } from "@clerk/nextjs";

export interface Categories {
    id: number,
    name: string,
    description: string,
}

const WriteArticle = async () => {
    const cat_req = await fetch('http://localhost:3000/api/manageArticle?action=getExistingCategories');
    const categories: Categories[] = await cat_req.json();

    return (
        <SignedIn>
            <div className="ml-10 mr-10 mt-6 lg:ml-48 lg:mr-48 lg:mt-10 p-6 border-2 rounded-2xl">
                <div className="flex flex-row items-center justify-between">
                    <h1 className="font-bold text-2xl">Write an article</h1>
                    <div className="flex flex-row not-lg:flex-col gap-2">
                        <h2 className="text-1/2xl font-bold">Category</h2>
                        <select className="text-1/2xl" title="Categories" name="categories" id="categories">
                            {categories.map((category, index) => <option key={index} value={category.id}>{category.name}</option>)}
                        </select>
                    </div>
                </div>
                <div className="m-6">
                    <WriteComp></WriteComp>
                </div>
            </div>
        </SignedIn>
    );
}

export default WriteArticle