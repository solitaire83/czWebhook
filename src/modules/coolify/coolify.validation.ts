// https://coolify.io/docs/core/notifications/channels/webhook/payload-reference

export type CoolifyEvent = {
    success: boolean;
    event: string;
    message: string;
    application_name?: string;
    environment?: string;
};
