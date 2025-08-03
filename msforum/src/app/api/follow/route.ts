import { PostFollow } from "@/types/api";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const user_id = searchParams.get("user_id");

        // deve returnare un obj { followers: [ ..user ], followed: [ ..user ] }

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export const POST = async (req: NextRequest) => {
    try {
        const body: PostFollow = await req.json();
        const data = body.data;
        if(body.action == 'follow')
            ''

        if(body.action == 'unfollow')
            ''        
        
        return NextResponse.json({ error: "Nothing happens bro" })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}