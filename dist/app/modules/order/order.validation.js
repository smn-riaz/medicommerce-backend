"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderValidationSchema = void 0;
const zod_1 = require("zod");
const createOrderSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string(),
        name: zod_1.z.string(),
        email: zod_1.z.string(),
        products: zod_1.z.array(zod_1.z.object({
            productId: zod_1.z.string(),
            name: zod_1.z.string(),
            quantity: zod_1.z.number().int().min(1),
            price: zod_1.z.number().nonnegative(),
            requiredPrescription: zod_1.z.boolean(),
        })),
        prescription: zod_1.z.string().optional(),
        shippingInfo: zod_1.z.object({
            shippingAddress: zod_1.z.string(),
            shippingCity: zod_1.z.string(),
        }),
        shippingCost: zod_1.z.number().nonnegative(),
        totalPrice: zod_1.z.number().nonnegative(),
        prescriptionReviewStatus: zod_1.z.enum(['pending', 'ok', 'cancelled']).optional(),
        orderStatus: zod_1.z.enum(['pending', 'shipped', 'delivered', 'cancelled']),
        paymentStatus: zod_1.z.boolean(),
    }),
});
const updateOrderSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().optional(),
        name: zod_1.z.string().optional(),
        email: zod_1.z.string().optional(),
        products: zod_1.z
            .array(zod_1.z.object({
            productId: zod_1.z.string(),
            name: zod_1.z.string(),
            quantity: zod_1.z.number().int().min(1),
            price: zod_1.z.number().nonnegative(),
            requiredPrescription: zod_1.z.boolean(),
        }))
            .optional(),
        prescription: zod_1.z.string().optional().optional(),
        shippingInfo: zod_1.z
            .object({
            shippingAddress: zod_1.z.string(),
            shippingCity: zod_1.z.string(),
        })
            .optional(),
        shippingCost: zod_1.z.number().nonnegative().optional(),
        totalPrice: zod_1.z.number().nonnegative().optional(),
        prescriptionReviewStatus: zod_1.z.enum(['pending', 'ok', 'cancelled']).optional(),
        orderStatus: zod_1.z
            .enum(['pending', 'shipped', 'delivered', 'cancelled'])
            .optional(),
        paymentStatus: zod_1.z.boolean().optional(),
    }),
});
exports.OrderValidationSchema = { createOrderSchema, updateOrderSchema };
