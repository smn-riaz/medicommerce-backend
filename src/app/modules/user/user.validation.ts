import { z } from 'zod';

const createUserValidation = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').trim(),
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email format' }),
    password: z.string().min(6).max(12),
    role: z.enum(['user', 'admin']).default('user'),
  }),
});

export const UserValidation = { createUserValidation };
