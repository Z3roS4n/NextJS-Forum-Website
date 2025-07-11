import { NextRequest, NextResponse } from "next/server";
import { PrismaPromise } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const idart: number = Number(searchParams.get("idart"));

        const commentsRetrieval = await prisma.comment.findMany({
            where: {
                idart: idart,
            },
            select: {
                user_id: true,
                content: true,
                reply_to: true,
                datetime: true,
                author: {
                    select: {
                        user_id: true,
                        username: true,
                        subscription: {
                            select: {
                                idsub: true,
                                name: true,
                            }
                        }
                    }
                }
            },
            orderBy: [
                { datetime: 'desc' }
            ]
        })

        return NextResponse.json(commentsRetrieval);

    } catch(error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}