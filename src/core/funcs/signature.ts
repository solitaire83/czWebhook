import { createHmac, timingSafeEqual } from "node:crypto";

export function safeEqual(expected: string, received: string): boolean {
    const a = Buffer.from(expected);
    const b = Buffer.from(received);

    return a.length === b.length && timingSafeEqual(a, b);
}

export function verifyHmacSignature(secret: string, rawBody: Buffer, signature: string | undefined, prefix = "sha256="): boolean {
    if (!signature) return false;

    return safeEqual(prefix + createHmac("sha256", secret).update(rawBody).digest("hex"), signature);
}
