"use client"

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Category, Article } from "@/types/components";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

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
      <div className="flex flex-row not-lg:flex-col gap-2">
        <h2 className="text-1/2xl font-bold">Category</h2>
        <select
          className="text-1/2xl"
          title="Categories"
          name="categories"
          id="categories"
          onChange={(e) => {
            setCategory(Number(e.target.value));
          }}
          value={category}
        >
          <option value={0}>No Category</option>
          {categories?.map((cat: Category, index) => (
            <option key={index} value={cat.idcat}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col lg:m-2">
        <label htmlFor="title">Article Title</label>
        <input
          id="title"
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border-2 rounded-2xl"
          value={title}
        />
      </div>

      <div className="lg:m-2 mt-2">
        <MDEditor
          value={content}
          onChange={(value = "") => setContent(value)}
          height={400}
        />
      </div>

      <div className="mt-6 flex flex-col items-center">
        <div className="flex flex-row justify-center w-1/4 gap-4">
          <button onClick={onSubmit} className="btn-primary" type="button">
            Submit Article
          </button>
          <button className="btn-primary" type="button">
            Save in draft
          </button>
        </div>
      </div>
    </>
  );
};

export default WriteComp;
