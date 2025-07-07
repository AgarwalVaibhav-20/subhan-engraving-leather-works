// /schemas/verifySchema.ts
import { z } from "zod";

export const verifySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6, "OTP must be 6 digits"),
});
