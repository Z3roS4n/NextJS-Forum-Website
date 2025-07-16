import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const user = {
            id: body?.id,
        };

        const userInfo = await prisma.userdata.findUnique({
            where: {
                user_id: user?.id,
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

export async function GET(req: NextRequest) {

    return NextResponse.json(
        { message: "Method GET non implementata" },
        { status: 405 }
    );
}
