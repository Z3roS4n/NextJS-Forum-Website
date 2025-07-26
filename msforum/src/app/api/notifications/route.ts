import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PostNotificationRequest } from "@/types/api";
import { error } from "console";

export async function GET(req: NextRequest) {
    try {
        const user = await currentUser();
        const { searchParams } = new URL(req.url);

        const filter = searchParams.get('filter');
        const orderby = (filter == 'latest' ? 'desc' : 'asc');

        const rawResults = await prisma?.notification.findMany({
            where: {
                user_id: user?.id
            },
            select: {
                idnotification: true,
                created_at: true,
                seen: true,
                type: true,
                user_id: true,
                idart: true,
                mention_author_id: true,
                mentionAuthor: {
                    select: {
                        user_id: true,
                        email: true,
                        username: true,
                        bio: true,
                        readme: true,
                        profile_picture: true,
                    }
                },
                user: {
                    select: {
                        user_id: true,
                        email: true,
                        username: true,
                        bio: true,
                        readme: true,
                        profile_picture: true,
                    }
                },
                article: {
                    select: {
                        idart: true,
                        title: true,
                    }
                }
            },
            orderBy: [
                { created_at: orderby },
                { seen: 'asc' }
            ],
            take: 30
        });

        return NextResponse.json(rawResults);
     } catch(error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = currentUser();
        if(!user)
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const data: PostNotificationRequest = await req.json();
        const action = data.action;
        const notifications = data.notifications_ids;

        if(action == 'set_read')
            await prisma.notification.updateMany({
                where: {
                    idnotification: { in: notifications }
                },
                data: {
                    seen: true
                }
            })
        
        if(action == 'set_unread')
            await prisma.notification.updateMany({
                where: {
                    idnotification: { in: notifications }
                },
                data: {
                    seen: false
                }
            })

        return NextResponse.json({ message: 'Ok!' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}