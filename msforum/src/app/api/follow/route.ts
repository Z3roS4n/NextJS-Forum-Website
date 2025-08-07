import { setError, setStatus } from "@/lib/api-status";
import { PostFollow } from "@/types/api";
import { NextRequest, NextResponse } from "next/server";
import { userQuery } from "../user/route";
import { currentUser } from "@clerk/nextjs/server";
import { error } from "console";

export const GET = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const user_id = searchParams.get("user_id");

        // deve returnare un obj { followers: [ ..user ], followed: [ ..user ] }

        if (!user_id) {
            return setError(400, "Missing user_id parameter");
        }

        // Get users that the current user is following
        const followed = await prisma?.follow.findMany({
            where: {
                follower_id: user_id,
            },
            include: {
                followed: {
                    select: userQuery
                }
            }
        });

        // Get users that follow the current user
        const followers = await prisma?.follow.findMany({
            where: {
                followed_id: user_id,
            },
            include: {
                follower: {
                    select: userQuery
                }
            }
        });

        return NextResponse.json({ followers, followed });

    } catch (error) {
        console.log(error)
        return setError(500);
    }
}

export const POST = async (req: NextRequest) => {
    try {
        const user = await currentUser();
        const body: PostFollow = await req.json();
        const data = body.data;

        if (!user?.id) {
            return setError( 400, "Missing follower_id");
        }

        if (!data || !data.followed) {
            return setError(400, "Missing followed user id");
        }

        if(body.action == 'follow') {
            await prisma?.follow.create({
                data: {
                    follower_id: user.id,
                    followed_id: data.followed
                }
            });
        }

        if(body.action == 'unfollow')
            await prisma?.follow.deleteMany({
                where: {
                    follower_id: user.id,
                    followed_id: data.followed
                }
            });        
        
        return setStatus(200);
    } catch (error) {
        console.log(error)
        return setError(500);
    }
}