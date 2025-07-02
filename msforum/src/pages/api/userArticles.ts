import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "@/lib/prisma";

interface User {
    id: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == 'POST') {
        const user: User = req.body;

        const articles = await prisma.article.findMany({
            where: {
                iduser: user?.id,
            },
            select: {
                idart: true,
                content: true,
                title: true
            }
        });

        res.status(200).json(articles);
    } else {
        // Handle any other HTTP method
        /*
        const userInfo = await prisma.userData.findMany({
            select: {
                iduser: true,
                subscription: {
                    select: {
                    name: true,
                    }
                }
            }
        });

        res.status(200).json(userInfo);
        */
    }
}