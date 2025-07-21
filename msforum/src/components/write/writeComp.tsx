"use client"

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Category, Article } from "@/types/components";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import ReadMeViewer from "../profile/other-user/readmeviewer";
import SelectComponent from "../ui/select";

// import dinamico per evitare SSR issues con react-md-editor
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface Params {
    categories: Category[];
}

const WriteComp = ({ categories }: Params) => {
    const router = useRouter();
    const { user } = useUser();

    const [title, setTitle] = useState<string>("");
    const [category, setCategory] = useState<number>(0);
    const [content, setContent] = useState<string>("");

    const onSubmit = async (): Promise<void> => {
        if (!user?.id || typeof category !== "number" || isNaN(category)) {
            return;
        }

        const articleData: Article = {
            idart: null,
            user_id: user.id,
            idcat: category,
            title: title,
            content: content || "",
            datetime: new Date().getMilliseconds(), // meglio ISO string
        };

        console.log(articleData)

        const post_article = await fetch("/api/manageArticle", {
            method: "POST",
            cache: "no-store",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(articleData),
        });

        if (post_article.ok) router.push("/articles");
    };

    return (
        <>
            <div className="flex lg:flex-row flex-col lg:items-center gap-2">
                <div className="flex flex-col lg:w-1/3 w-1/1">
                    <label htmlFor="title" className="text-1/2xl font-bold">Article Title</label>
                    <input
                        id="title"
                        type="text"
                        onChange={(e) => setTitle(e.target.value)}
                        className="input"
                        value={title}
                    />
                </div>
                <div className="flex flex-col">
                    <h2 className="text-1/2xl font-bold">Category</h2>
                    <SelectComponent categories={categories} onCategorySelection={(categoryId) => setCategory(categoryId)}/>
                </div>
            </div>

            <div className="w-1/1 flex lg:flex-row flex-col gap-2">
                <div className="article-container lg:w-1/2 w-1/1 flex-col gap-2">
                    <MDEditor
                        value={content}
                        onChange={(value = "") => setContent(value)}
                        height={400}
                        preview="edit"
                        data-color-mode="light"
                        className="w-1/1"
                    />
                        <div className="self-end flex gap-2 not-lg:w-1/1">
                            <button className="btn-secondary not-lg:w-1/2" type="button">
                                Save in draft
                            </button>
                            <button onClick={onSubmit} className="btn-primary not-lg:w-1/2" type="button">
                                Submit Article
                            </button>
                            
                        </div>
                </div>
                <div className="article-container flex-col lg:w-1/2 w-1/1 overflow-auto max-h-122 justify-start">
                    <h1 className="font-bold text-xl self-center">Realtime Preview</h1>
                    <ReadMeViewer content={content}></ReadMeViewer>
                </div> 
            </div>
        </>
    );
};

export default WriteComp;
