import { PrismaPromise } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { settings } from "@/lib/defaultSiteSettings";
import { articlesQuery } from "@/lib/prisma-queries";


export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const page: number = parseInt(searchParams.get("pageNumber") || "1");
        const pageSize: number = parseInt(searchParams.get("pageSize") || String(settings.pageSize));
        const legacy: boolean = Boolean(searchParams.get("legacy")) || false;

        const category_id: number = parseInt(searchParams.get("categoryId") || String(settings.noCategory));
        const user_id: string | undefined = searchParams.get("user_id") || undefined;
        const searchedTitle: string | undefined = searchParams.get("searchedTitle") || undefined;

        const recordsLimit = searchParams.get("limit") || null;

        let retrieveArticles;
        const skip = (page - 1) * pageSize; //query page skip

        if(!legacy)
            // If either user_id is provided or a specific category is selected, use paginated query
            if (user_id || (category_id !== settings.noCategory && category_id !== 0) || searchedTitle) {
                retrieveArticles = await prisma.article.findMany({
                    where: {
                        user_id: user_id,
                        idcat: category_id !== settings.noCategory && category_id !== 0 ? category_id : undefined,
                        title: {
                            contains: searchedTitle,
                            mode: "insensitive"
                        },
                    },
                    select: articlesQuery,
                    orderBy: [{ datetime: 'desc' }],
                    take: pageSize,
                    skip: skip,
                });
            } else {
                // Otherwise, use the limited query (e.g., for homepage or all categories)
                retrieveArticles = await prisma.article.findMany({
                    select: articlesQuery,
                    orderBy: [{ datetime: 'desc' }],
                    take: recordsLimit ? parseInt(recordsLimit, 10) : pageSize,
                    skip: skip,
                });
            }

        else
            if((!page && !category_id)) {
                retrieveArticles = await prisma.article.findMany({
                    select: articlesQuery,
                    orderBy: [{ datetime: 'desc' }],
                    take: recordsLimit ? parseInt(recordsLimit, 10) : pageSize,
                });
            }
    
        return NextResponse.json(retrieveArticles)
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
