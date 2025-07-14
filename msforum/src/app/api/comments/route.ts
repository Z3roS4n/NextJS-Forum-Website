import { NextRequest, NextResponse } from "next/server";
import { PrismaPromise } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { PostCommentRequest } from "@/types/api";

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
                upvotes: true,
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

export async function POST(req: NextRequest) {
    const user = await currentUser();
    const request: PostCommentRequest = await req.json();

    try {
        if(!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if(request.reply_to)
            return NextResponse.json({ error: "Not yet implemented"}, { status: 501 })

        if(!request.reply_to) {
            const prisma_insert = await prisma.comment.createManyAndReturn({
                data: {
                    user_id: user.id,
                    content: request.content,
                    idart: request.idart,
                    reply_to: null,
                    datetime: request.datetime,
                }
            })
            return NextResponse.json(prisma_insert);
        }
            
    } catch(error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}