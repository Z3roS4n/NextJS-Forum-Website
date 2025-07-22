import ArticlesComponent from "@/components/articles/articlesComponent"
import { Article_Category, Article_Category_Author, Category } from "@/types/components";

const ArticlesPage = async () => {
    const [articlesRes, categoriesRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/articles`, {
            next: { revalidate: 30 },
        }),
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/manageArticle?action=getExistingCategories`, {
            next: { revalidate: 120 },
        }),
    ]);
    const articles: Article_Category_Author[] = await articlesRes.json();
    const categories: Category[] = await categoriesRes.json();

    return (
        <>
            <div className="page-container">
                <div>
                    <h1 className="title">Articles</h1>
                    <p>Here you can search through all published articles on this site!</p>
                </div>
                
                <div className="flex flex-col gap-4">
                    <ArticlesComponent articles={articles} categories={categories} limitIndex={10}></ArticlesComponent>
                </div>
            </div>
        </>
    )
}

export default ArticlesPage;