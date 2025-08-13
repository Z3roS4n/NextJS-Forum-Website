import { setError } from "@/lib/api-status";
import { prisma } from "@/lib/prisma";

import { NextRequest, NextResponse } from "next/server";
import { userQuery } from "../../user/route";

export const GET = async (req: NextRequest, { params }: { params: Promise<{ article: string }> }) => {
    try {
        const { article } = await params;
        if(!article) setError(404);

        const idartParsed = parseInt(article);

        let retrieveArticle;
        if(article) 
            retrieveArticle = await prisma.article.findMany({
                where: {
                    idart: idartParsed,
                },
                select: {
                    idart: true,
                    idcat: true,
                    title: true,
                    content: true,
                    user_id: true,
                    datetime: true,
                    category: {
                        select: {
                            idcat: true,
                            name: true,
                            description: true
                        }, 
                    },
                    author: {
                        select: userQuery
                    }
                }
            });

        return NextResponse.json(retrieveArticle)
    } catch (error) {
        console.log(error)
        setError(500);
    }
}