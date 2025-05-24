"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const createUserValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Name is required').trim(),
        email: zod_1.z
            .string({ required_error: 'Email is required' })
            .email({ message: 'Invalid email format' }),
        password: zod_1.z.string().min(6).max(12),
        role: zod_1.z.enum(['user', 'admin']).default('user'),
    }),
});
const updateUserValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Name is required').trim().optional(),
        email: zod_1.z
            .string({ required_error: 'Email is required' })
            .email({ message: 'Invalid email format' }).optional(),
        password: zod_1.z.string().min(6).max(12).optional(),
        role: zod_1.z.enum(['user', 'admin']).default('user').optional(),
    }),
});
exports.UserValidation = { createUserValidation, updateUserValidation };
