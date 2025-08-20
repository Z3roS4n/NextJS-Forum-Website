import ArticlesComponent from "@/components/articles/articlesComponent"
import ArticlesLoader from "@/components/articles/articlesLoarder";
import { Article_Category, Article_Category_Author, Category } from "@/types/components";

//<ArticlesComponent limitIndex={10}></ArticlesComponent>

const ArticlesPage = async () => {
    return (
        <>
            <div className="page-container">
                <div>
                    <h1 className="title">Articles</h1>
                    <p>Here you can search through all published articles on this site!</p>
                </div>
                
                <div className="flex flex-col gap-4">
                    
                    <ArticlesLoader></ArticlesLoader>
                </div>
            </div>
        </>
    )
}

export const metadata = {
    title: "Articles | MSForum",
    description: "Browse all published articles on MSForum.",
};

export default ArticlesPage;