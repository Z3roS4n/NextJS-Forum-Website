import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { PrismaClient } from "@/generated/prisma";
 
const prisma = new PrismaClient();
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    user: {
        modelName: "userdata",
        fields: {
            name: "username",
            image: "profile_picture",
            id: "user_id"
        },
    },
    account: {
        fields: {
            userId: "user_id",
        }
    },
    session: {
        fields: {
            userId: "user_id",
        }
    },
    emailAndPassword: {
        enabled: true, 
        requireEmailVerification: true,
    }, 
});