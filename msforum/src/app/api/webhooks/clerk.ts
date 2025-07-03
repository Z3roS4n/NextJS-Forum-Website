import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyWebhook, WebhookEvent } from '@clerk/nextjs/webhooks'
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === 'POST') {
        const evt: WebhookEvent = await verifyWebhook(req);
        console.log(evt)

        console.log("eeee")

        res.status(200);
    } else {
        console.log("eeeee")

        res.status(200);
    }
}