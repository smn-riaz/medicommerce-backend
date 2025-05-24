"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidation = void 0;
const zod_1 = require("zod");
const createProductValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Name is required').trim(),
        type: zod_1.z.enum(['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Drops', 'Food', 'Skin', 'Baby']),
        description: zod_1.z.string().min(1, 'Description is required'),
        price: zod_1.z.number().gt(0, 'Price must be greater than 0'),
        discount: zod_1.z.number().min(0).max(100).default(0),
        imageUrl: zod_1.z.array(zod_1.z.string().url()).min(1),
        manufacturer: zod_1.z.string().min(1, 'Manufacturer is required'),
        quantity: zod_1.z.number().min(0, 'Quantity cannot be negative'),
        expireDate: zod_1.z.string(),
        inStock: zod_1.z.boolean().default(true),
        requiredPrescription: zod_1.z.boolean(),
    }),
});
const updateProductValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Name is required').trim().optional(),
        type: zod_1.z
            .enum(['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Drops'])
            .optional(),
        description: zod_1.z.string().min(1, 'Description is required').optional(),
        price: zod_1.z.number().gt(0, 'Price must be greater than 0').optional(),
        discount: zod_1.z.number().min(0).max(100).default(0).optional(),
        imageUrl: zod_1.z.array(zod_1.z.string().url()).min(1).optional(),
        manufacturer: zod_1.z.string().min(1, 'Manufacturer is required').optional(),
        quantity: zod_1.z.number().min(0, 'Quantity cannot be negative').optional(),
        expireDate: zod_1.z.string().min(1, 'Expiry date is required').optional(),
        inStock: zod_1.z.boolean().default(true).optional(),
    }),
});
exports.ProductValidation = {
    createProductValidation,
    updateProductValidation,
};
