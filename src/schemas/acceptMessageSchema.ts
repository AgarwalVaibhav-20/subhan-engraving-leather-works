import {z} from 'zod';

export const AccepMessageSchema = z.object({
    acceptMessages:z.boolean()
})