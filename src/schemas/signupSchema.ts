import { z } from 'zod'

export const signUpSchema = z.object({
  fullname: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
