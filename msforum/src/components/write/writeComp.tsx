"use client"

import { Editor } from "@toast-ui/react-editor";
import '@toast-ui/editor/dist/toastui-editor.css';
import React, { useState, useRef, useEffect } from "react";
import { Categories, Article } from "../../app/write/page";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";

const WriteComp = () => {
    const router = useRouter();
    const { isSignedIn, isLoaded, user } = useUser();
    const [title, setTitle] = useState<string>("");
    const [category, setCategory] = useState<number>();
    const [categories, setCategories] = useState<Categories[]>()

    const editorRef = useRef<Editor>(null);

    const handleChange = () => {
        if (editorRef.current) {
            const editorInstance = editorRef.current.getInstance();
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await fetch('/api/manageArticle?action=getExistingCategories', { cache: 'no-store' });
            if (res.ok) {
                const cats = await res.json();
                setCategories(cats);
            } else {
                console.error("Failed to fetch categories");
            }
        };
        fetchCategories();
    }, []);

    const redirectToProfile = () => router.push("/profile");

    const onUpdate = (type: string) => {
        if (!user?.id) {
            // Handle the case where user id is not available (optional: show an error or return)
            return;
        }
        const articleData: Article = {
            user_id: user?.id,
            idcat: category,
            title: title,
            content: editorRef.current?.getInstance().getMarkdown()
        };
        if(type === 'submit') {
            const post_article = fetch('http://localhost:3000/api/manageArticle', 
                { 
                    method: 'POST',
                    cache: 'no-store', 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify(articleData)
                }).then(res => {res.ok ? redirectToProfile : "ERROR"});
        }       
    }

    return (                    
        <>
            <div className="flex flex-row not-lg:flex-col gap-2">
                <h2 className="text-1/2xl font-bold">Category</h2>
                <select className="text-1/2xl" title="Categories" name="categories" id="categories" onChange={(e) => setCategory(Number(e.target.value))}>
                    {categories?.map((category, index) => <option key={index} value={category.id}>{category.name}</option>)}
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
                        onClick={() => onUpdate('submit')}
                        className="text-nowrap m-2 p-2 pl-4 pr-4 mr-0 bg-blue-600 rounded-xl text-white hover:bg-blue-700 transition-colors delay-150"
                        type="button">
                        Submit Article
                    </button>
                    <button 
                        className="text-nowrap m-2 p-2 pl-4 pr-4 mr-0 bg-blue-600 rounded-xl text-white hover:bg-blue-700 transition-colors delay-150"
                        type="button">
                        Save in draft
                    </button>
                </div>
            </div>
        </>
    );
}

export default WriteComp;