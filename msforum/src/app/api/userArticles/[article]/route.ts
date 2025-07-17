import { NextRequest, NextResponse } from "next/server";

interface ArticleDeleteParams {
    params: { article: number }
}

export async function DELETE(req: NextRequest) {
    try {

    } catch(error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}