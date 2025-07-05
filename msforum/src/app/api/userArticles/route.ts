import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface User {
    id: string;
}

export async function POST(req: NextRequest) {
    try {
        const user: User = await req.json();

        const articles = await prisma.article.findMany({
            where: {
                user_id: user?.id,
            },
            select: {
                idart: true,
                content: true,
                title: true,
            },
        });

        return NextResponse.json(articles);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// Se vuoi puoi gestire altri metodi HTTP (GET ecc.)
// per esempio, ritorna 405 per metodi non implementati:

export async function GET(req: NextRequest) {
    return NextResponse.json(
        { message: "GET method not implemented" },
        { status: 405 }
    );
}
