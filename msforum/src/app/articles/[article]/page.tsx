type Params = {
    params: {
        article: string;
    };
};

const ArticlePage = async ({ params }: Params) => {
    return (
        <>
            <h1>Articolo: {params.article}</h1>
        </>
    );
};

export default ArticlePage;