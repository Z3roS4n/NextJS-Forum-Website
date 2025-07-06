import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface Response {
    idcat: number
}


export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category_id = searchParams.get("idcat");
        const idcatNumber = category_id ? Number(category_id) : undefined;

        const retrieveArticle = await prisma.article.findMany({
            select: {
                idart: true,
                idcat: true,
                title: true,
                content: true,
                user_id: true,
                category: {
                    select: {
                    idcat: true,
                    name: true,
                    // aggiungi altri campi necessari da category
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
