import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyHmacSignature(secret: string, rawBody: Buffer, signature: string | undefined, prefix = "sha256="): boolean {
    if (!signature) return false;

    const expected = Buffer.from(prefix + createHmac("sha256", secret).update(rawBody).digest("hex"));
    const received = Buffer.from(signature);

    return expected.length === received.length && timingSafeEqual(expected, received);
}
