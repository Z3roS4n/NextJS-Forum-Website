import { NextRequest, NextResponse } from "next/server";
import { PrismaPromise } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { PostCommentRequest, UpvoteCommentRequest } from "@/types/api";

export async function GET(req: NextRequest) {
    try {
        const user = await currentUser();
        const { searchParams } = new URL(req.url);
        const idart: number = Number(searchParams.get("idart"));
        const upvotes: boolean = Boolean(searchParams.get('upvotes'));

        let response;

        if(!idart)
            return NextResponse.json({ error: "Article ID's missing." }, { status: 401 });

        if(upvotes) {
            response = await prisma.comment.findMany({
                where: { idart },
                select: {
                    idcomment: true,
                    _count: {
                        select: { upvoteComments: true }
                    },
                    upvoteComments: user
                        ? {
                            where: { user_id: user.id },
                            select: { idupcom: true, user_id: true, idcomment: true }
                        }
                        : false
                }
            });

            // Mappa il risultato per includere il campo "upvoted"
            response = response.map(comment => ({
                idcomment: comment.idcomment,
                upvotes: comment._count.upvoteComments,
                upvoted: user ? comment.upvoteComments.length > 0 : false
            }));
        } else
            response = await prisma.comment.findMany({
                where: {
                    idart: idart,
                },
                select: {
                    idcomment: true,
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
                    },
                    _count: {
                        select: {
                            upvoteComments: true
                        }
                    },
                },
                orderBy: [
                    { datetime: 'desc' }
                ]
            })

        //aggiornare con query per upvotes.
        return NextResponse.json(response);

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

        if(request.action == 'comment' || request.action == 'reply') {
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

        if(request.action === 'set_upvote') {
            //aggiornare con query per upvotes
            const upvote_insert = await prisma.upvoteComment.createManyAndReturn({
                data: {
                    user_id: user.id,
                    idcomment: request.data.idcomment
                }
            })
        }

        if(request.action === 'toggle_upvote') {
            const upvote = await prisma.upvoteComment.findFirst({
                where: {
                    user_id: user.id,
                    idcomment: request.data.idcomment
                }
            });

            if (upvote) {
                const upvote_delete = await prisma.upvoteComment.delete({
                    where: {
                        idupcom: upvote.idupcom
                    }
                });
            } else {
                const upvote_insert = await prisma.upvoteComment.createManyAndReturn({
                    data: {
                        user_id: user.id,
                        idcomment: request.data.idcomment
                    }
                })
            }
        }

        if(request.action === 'rem_upvote') {
            //aggiornare con query per upvotes
            // First, find the unique upvote record for this user and comment
            const upvote = await prisma.upvoteComment.findFirst({
                where: {
                    user_id: user.id,
                    idcomment: request.data.idcomment
                }
            });

            if (upvote) {
                const upvote_delete = await prisma.upvoteComment.delete({
                    where: {
                        idupcom: upvote.idupcom
                    }
                });
            }
        }

        return NextResponse.json({ message: "Ok"});
    } catch(error) {
        console.log(error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}