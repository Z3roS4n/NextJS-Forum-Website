import { NextResponse } from "next/server";

export const setError = ( code: number, message?: string) => {
    if(code == 500)
        message = "Internal Server Error.";

    return NextResponse.json({ error: message }, { status: code })
}

export const setStatus = ( code: number, message?: string) => {
    if(code == 200)
        message = "Ok";

    return NextResponse.json({ message: message }, { status: code })
}
