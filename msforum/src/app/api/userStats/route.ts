import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust the import path as needed
import { currentUser } from "@clerk/nextjs/server";
import { UserStatsFunctionResponse } from "@/types/api";

export async function GET(req: NextRequest) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("user_id") || user.id;

        const prisma_fetch = await userStats(userId);

        return NextResponse.json(prisma_fetch)
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal Server Error"}, { status: 500});
    }
}

const userStats = async (userId: string): Promise<UserStatsFunctionResponse> => {
    const userInfo = await prisma.userdata.findUnique({
        where: { user_id: userId },
        select: {
            user_id: true,
            username: true,
            email: true,
            subscription: {
                select: {
                    idsub: true,
                    name: true,
                    description: true,
                },
            },
            _count: {
                select: {
                    articles: true,
                    comments: true,
                },
            },
            comments: {
                select: {
                    upvotes: true,
                },
            },
        },
    });

    if (!userInfo) {
        throw new Error("User data not found");
    }

    const totalUpvotesReceived = userInfo.comments.reduce(
        (sum, c) => sum + (c.upvotes ?? 0),
        0
    );

    return {
        user: {
            user_id: userInfo.user_id,
            username: userInfo.username,
            email: userInfo.email,
            subscription: userInfo.subscription,
        },
        articlesPublished: userInfo._count.articles,
        commentsWritten: userInfo._count.comments,
        totalUpvotesReceived,
    };
};