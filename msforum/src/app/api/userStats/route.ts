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

        const prisma_fetch = await userStats(user.id);

        return NextResponse.json(prisma_fetch)
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal Server Error"}, { status: 500});
    }
}

const userStats = async (userId: string): Promise<UserStatsFunctionResponse> => {
    // User Data
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
        },
    });

    if (!userInfo) {
        throw new Error("User data not found");
    }

    // Articles Count
    const articleCount = await prisma.article.count({
        where: { user_id: userId },
    });

    // Comments Count
    const commentCount = await prisma.comment.count({
        where: { user_id: userId },
    });

    // Total Upvotes
    const upvoteSum = await prisma.comment.aggregate({
        where: { user_id: userId },
        _sum: {
            upvotes: true,
        },
    });

    return {
        user: userInfo,
        articlesPublished: articleCount,
        commentsWritten: commentCount,
        totalUpvotesReceived: upvoteSum._sum.upvotes ?? 0,
    };
};

