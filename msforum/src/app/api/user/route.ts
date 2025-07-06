import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface User {
    id: string;
}

export async function POST(req: NextRequest) {
    try {
        const user: User = await req.json();

        const userInfo = await prisma.userdata.findUnique({
            where: {
                user_id: user?.id,
            },
            select: {
                user_id: true,
                email: true,
                subscription: {
                    select: {
                        idsub: true,
                        name: true,
                    },
                },
                articles: {
                    select: {
                        idart: true,
                        content: true,
                        category: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
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
