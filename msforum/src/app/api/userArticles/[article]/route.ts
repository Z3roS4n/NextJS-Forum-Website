import { NextRequest, NextResponse } from "next/server";

interface ArticleDeleteParams {
    params: { article: number }
}

export async function DELETE(req: NextRequest, { params }: ArticleDeleteParams) {
    try {
        const article_delete = prisma?.article.delete({
            where: {
                idart: params.article
            }
        })
    } catch(error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}