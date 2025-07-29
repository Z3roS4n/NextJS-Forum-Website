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
        modelName: "Userdata",
        fields: {
            id: "user_id",
            name: "username",
            image: "profile_picture",
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