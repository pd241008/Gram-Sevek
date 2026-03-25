import { z } from "zod";

export const createComplaintSchema = z.object({
  body: z.object({
    description: z.string().min(5),
    isVoice: z.boolean().optional(),
  }),
});
