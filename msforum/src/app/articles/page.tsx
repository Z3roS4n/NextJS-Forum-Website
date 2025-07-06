import ArticlesComponent from "@/components/articles/articlesComponent"

export interface Article {
    idart: number,
    idcat: number,
    user_id: string,
    title: string,
    content: string,
    category: Categories
}

export interface Categories {
    idcat: number,
    name: string,
    description: string
}

const ArticlesPage = async () => {
    const req = await fetch("http://localhost:3000/api/articles", { method: 'GET' });
    const articles: Article[] = await req.json()

    const req_cat = await fetch("http://localhost:3000/api/manageArticle?action=getExistingCategories", { method: 'GET' });
    const categories: Categories[] = await req_cat.json();

    return (
        <>
            <div className="ml-12 mr-12 mt-6">
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