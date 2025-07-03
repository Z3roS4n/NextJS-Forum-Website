import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface User {
    id: string;
}

export async function POST(req: NextRequest) {
    try {
        const user: User = await req.json();

        const userInfo = await prisma.userData.findUnique({
            where: {
                iduser: user?.id,
            },
            select: {
                iduser: true,
                subscription: {
                    select: {
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

// Se vuoi gestire altre HTTP method, ad esempio GET, puoi aggiungerle così:

export async function GET(req: NextRequest) {
  // Se vuoi abilitare una logica per GET, qui la metti
    return NextResponse.json(
        { message: "Method GET non implementata" },
        { status: 405 }
    );
}
