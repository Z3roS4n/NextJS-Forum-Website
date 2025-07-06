
import { prisma } from "@/lib/prisma";
import { Article } from "@/types/components";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const action = searchParams.get("action");

        if (action === "getExistingCategories") {
            const categories = await prisma.category.findMany({
                select: {
                    idcat: true,
                    name: true,
                    description: true,
                },
            });
            return NextResponse.json(categories);
        }

        return NextResponse.json(
            { error: "Invalid or missing action parameter" },
            { status: 400 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const article: Article = await req.json();

        const submit = await prisma.article.create({
            data: {
                user_id: article.user_id,
                idcat: article.idcat ?? null,
                content: article.content,
                title: article.title
            },
            select: {
                user_id: true,        
            }
        })

        return NextResponse.json({ message: "Article received", article });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}