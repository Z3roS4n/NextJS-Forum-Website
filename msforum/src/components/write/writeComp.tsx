"use client"

import { Editor } from "@toast-ui/react-editor";
import '@toast-ui/editor/dist/toastui-editor.css';
import React, { useState, useRef, useEffect } from "react";
import { Category, Article } from "@/types/components";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface Params {
    categories: Category[]
}

const WriteComp = ({ categories }: Params ) => {
    const router = useRouter();
    const { user } = useUser();
    const [title, setTitle] = useState<string>("");
    const [category, setCategory] = useState<number>(0);
    const editorRef = useRef<Editor>(null);

    const handleChange = (): void => {
        if (editorRef.current) {
            const editorInstance = editorRef.current.getInstance();
        }
    };

    const onSubmit = async (): Promise<void> => {
        if (!user?.id || typeof category !== "number" || isNaN(category)) {
            return;
        }

        const articleData: Article = {
            idart: null,
            user_id: user.id,
            idcat: category,
            title: title,
            content: editorRef.current?.getInstance().getMarkdown() || "",
            datetime: new Date().getUTCMilliseconds()
        };

        const post_article = await fetch('http://localhost:3000/api/manageArticle', 
            { 
                method: 'POST',
                cache: 'no-store', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(articleData)
            });

        if(post_article.ok) router.push("/articles")
        
    }

    return (                    
        <>
            <div className="flex flex-row not-lg:flex-col gap-2">
                <h2 className="text-1/2xl font-bold">Category</h2>
                <select className="text-1/2xl" title="Categories" name="categories" id="categories" onChange={(e) => { setCategory(Number(e.target.value)); }}>
                    <option value="0">No Category</option>
                    {categories?.map((category: Category, index) => <option key={index} value={category.idcat}>{category.name}</option>)}
                </select>
            </div>
            <div className="flex flex-col lg:m-2">
                <label htmlFor="title">Article Title</label>
                <input id="title" type="text" onChange={(e) => setTitle(e.target.value)} className="p-2 border-2 rounded-2xl" />
            </div>
            <div className="lg:m-2 mt-2 ">
                <Editor
                    ref={editorRef}
                    initialValue=""
                    previewStyle="vertical" // o "tab"
                    height="30em"
                    initialEditType="wysiwyg"
                    useCommandShortcut={true}
                    onChange={handleChange}
                />
            </div>
            <div className="mt-6 flex flex-col items-center">
                <div className="flex flex-row justify-center w-1/4">
                    <button 
                        onClick={() => onSubmit()}
                        className="btn-primary"
                        type="button">
                        Submit Article
                    </button>
                    <button 
                        className="btn-primary"
                        type="button">
                        Save in draft
                    </button>
                </div>
            </div>
        </>
    );
}

export default WriteComp;