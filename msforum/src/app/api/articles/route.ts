import { PrismaPromise } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category_id = searchParams.get("idcat");
        const idcatNumber = category_id ? Number(category_id) : undefined;
        const idart = searchParams.get("idart");
        const idartParsed = idart ? Number(idart) : undefined;

        let retrieveArticle;

        if(searchParams.size == 0)
            retrieveArticle = await prisma.article.findMany({
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
                },
                orderBy: [
                    { datetime:  'desc' }
                ]
            });
        else if(idart)
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
                        select: {
                            user_id: true,
                            email: true
                        }
                    }
                }
            });

        return NextResponse.json(retrieveArticle)
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
