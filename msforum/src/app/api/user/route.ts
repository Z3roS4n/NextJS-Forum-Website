import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { PostUserInformations } from "@/types/api";

export const userQuery = {
    user_id: true,
    username: true,
    email: true,
    bio: true,
    readme: true,
    profile_picture: true,
    subscription: {
        select: {
            idsub: true,
            name: true,
            description: true,
        },
    },
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('id')

        const user = {
            id: userId,
        };

        const userInfo = await prisma.userdata.findUnique({
            where: {
                user_id: user?.id || undefined,
            },
            select: {
                user_id: true,
                username: true,
                email: true,
                bio: true,
                readme: true,
                profile_picture: true,
                subscription: {
                    select: {
                        idsub: true,
                        name: true,
                        description: true,
                    },
                },
                /*articles: {
                    select: {
                        idart: true,
                        content: true,
                        category: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },*/
            },
        });

        return NextResponse.json(userInfo);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await currentUser();
        if(!user?.id)
            throw new Error('User is not logged in.')
        
        const body: PostUserInformations = await req.json();
        const data = body.data

        if(body.action == 'set_bio') {
            await prisma.userdata.update({
                where: {
                    user_id: user.id,
                },
                data: {
                    bio: data.bio,
                }
            });
        }
        if(body.action == 'set_readme') {
            await prisma.userdata.update({
                where: {
                    user_id: user.id,
                },
                data: {
                    readme: data.readme,
                }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
