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
        const user_id = searchParams.get("user_id");

        const recordsLimit = searchParams.get("limit") || null;
        let retrieveArticle;

        if(idart) 
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
                            username: true,
                            email: true
                        }
                    }
                }
            });
        else if(user_id)
            retrieveArticle = await prisma.article.findMany({
                where: {
                    user_id: user_id,
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
                            username: true,
                            email: true
                        }
                    }
                },
                orderBy: [
                    { datetime: 'desc' }
                ]
            });
        else
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
                            description: true,
                        },
                    },
                },
                orderBy: [{ datetime: 'desc' }],
                take: recordsLimit ? parseInt(recordsLimit, 10) : undefined,
            });

        return NextResponse.json(retrieveArticle)
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
