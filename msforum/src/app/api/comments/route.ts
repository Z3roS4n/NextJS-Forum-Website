import { NextRequest, NextResponse } from "next/server";
import { PrismaPromise } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { PostCommentRequest, UpvoteCommentRequest } from "@/types/api";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const idart: number = Number(searchParams.get("idart"));

        const commentsRetrieval = await prisma.comment.findMany({
            where: {
                idart: idart,
            },
            select: {
                idcomment: true,
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

        //aggiornare con query per upvotes.

        return NextResponse.json(commentsRetrieval);

    } catch(error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const user = await currentUser();
    const request: PostCommentRequest | UpvoteCommentRequest = await req.json();

    try {
        if(!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if(request.action === 'comment') {
            const prisma_insert = await prisma.comment.createManyAndReturn({
                data: {
                    user_id: user.id,
                    content: request.data.content,
                    idart: request.data.idart,
                    reply_to: request.data.reply_to,
                    datetime: request.data.datetime,
                }
            })
            return NextResponse.json(prisma_insert);
        }

        if(request.action === 'upvote') {
            //aggiornare con query per upvotes
            const prisma_update = await prisma.comment.update({
                where: {
                    idcomment: request.data.idcomment,
                },
                data: {
                    upvotes: {
                        set: request.data.upvotes,
                    }
                }
            })
            return NextResponse.json(prisma_update);
        }
            
    } catch(error) {
        console.log(error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}