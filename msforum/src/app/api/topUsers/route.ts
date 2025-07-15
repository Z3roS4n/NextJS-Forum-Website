import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TopUserByArticles, TopUserByComments, TopUserByUpvotes } from "@/types/api";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit") || "10");

        const [byUpvotes, byArticles, byComments] = await Promise.all([
            getTopUsersByUpvotes(limit),
            getTopUsersByArticles(limit),
            getTopUsersByComments(limit),
        ]);


        return NextResponse.json({
            byUpvotes,
            byArticles,
            byComments,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

const getTopUsersByUpvotes = async (limit: number): Promise<TopUserByUpvotes[]> => {
    const results = await prisma.comment.groupBy({
        by: ["user_id"],
        _sum: {
            upvotes: true,
        },
        orderBy: {
            _sum: {
                upvotes: "desc",
            },
        },
        take: limit,
    });

    const users = await prisma.userdata.findMany({
        where: { user_id: { in: results.map(r => r.user_id) } },
        select: {
            user_id: true,
            username: true,
            email: true,
        },
    });

    return results.map(r => {
        const user = users.find(u => u.user_id === r.user_id);
        if (!user) {
            throw new Error(`User not found for user_id: ${r.user_id}`);
        }

        return {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            totalUpvotes: r._sum.upvotes ?? 0,
        };
    });
};

const getTopUsersByArticles = async (limit: number): Promise<TopUserByArticles[]> => {
    const results = await prisma.article.groupBy({
        by: ["user_id"],
        _count: {
            idart: true,
        },
        orderBy: {
            _count: {
                idart: "desc",
            },
        },
        take: limit,
    });

    const users = await prisma.userdata.findMany({
        where: { user_id: { in: results.map(r => r.user_id) } },
        select: {
            user_id: true,
            username: true,
            email: true,
        },
    });

    return results.map(r => {
        const user = users.find(u => u.user_id === r.user_id);
        if (!user) {
            throw new Error(`User not found for user_id: ${r.user_id}`);
        }

        return {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            articlesCount: r._count.idart,
        };
    });
};

const getTopUsersByComments = async (limit: number): Promise<TopUserByComments[]> => {
    const results = await prisma.comment.groupBy({
        by: ["user_id"],
        _count: {
            idcomment: true,
        },
        orderBy: {
            _count: {
                idcomment: "desc",
            },
        },
        take: limit,
    });

    const users = await prisma.userdata.findMany({
        where: { user_id: { in: results.map(r => r.user_id) } },
        select: {
            user_id: true,
            username: true,
            email: true,
        },
    });

    return results.map(r => {
        const user = users.find(u => u.user_id === r.user_id);
        if (!user) {
            throw new Error(`User not found for user_id: ${r.user_id}`);
        }

        return {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            commentsCount: r._count.idcomment,
        };
    });
};
