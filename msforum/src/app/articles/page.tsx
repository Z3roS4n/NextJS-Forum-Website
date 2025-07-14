import ArticlesComponent from "@/components/articles/articlesComponent"
import { Article_Category, Category } from "@/types/components";

const ArticlesPage = async () => {
    const req = await fetch("http://localhost:3000/api/articles", { method: 'GET' });
    const articles: Article_Category[] = await req.json()

    const req_cat = await fetch("http://localhost:3000/api/manageArticle?action=getExistingCategories", { method: 'GET' });
    const categories: Category[] = await req_cat.json();

    return (
        <>
            <div className="page-container">
                <div>
                    <h1 className="title">Articles</h1>
                    <p>Here you can search through all published articles on this site!</p>
                </div>
                
                <div className="flex flex-col gap-4">
                    <ArticlesComponent articles={articles} categories={categories}></ArticlesComponent>
                </div>
            </div>
        </>
    )
}

export default ArticlesPage;