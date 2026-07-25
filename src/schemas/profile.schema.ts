import { z } from "zod";

export const profileSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    avatar_url: z.string().url().optional().or(z.literal('')),
});
export type ProfileFormData = z.infer<typeof profileSchema>;