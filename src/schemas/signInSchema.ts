import {z} from 'zod';

export const signInVerification = z.object({
    email:z.string(),
    password:z.string(),
})