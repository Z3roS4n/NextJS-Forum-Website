// src/actions/auth.ts
"use server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { signUpSchema } from "@/lib/validation";
import { APIError } from "better-auth/api";
import { z } from "zod";

export async function signUpAction(formData: FormData) {
    const data = {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
    };

    const validation = signUpSchema.safeParse(data);

    if (!validation.success) {
        return {
            errors: z.treeifyError(validation.error),
        };
    }

    try {
        await auth.api.signUpEmail({
            body: data,
            headers: await headers(),
        });
        return { success: true };
    } catch (err) {
        if (err instanceof APIError)
            return { errors: { _form: err.message } };
        throw err;
    }
}
