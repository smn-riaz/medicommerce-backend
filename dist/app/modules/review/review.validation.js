"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewValidations = exports.createReviewSchema = void 0;
const zod_1 = require("zod");
exports.createReviewSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().refine((val) => val.match(/^[0-9a-fA-F]{24}$/), {
            message: "Invalid MongoDB ObjectId for userId",
        }),
        productId: zod_1.z.string().refine((val) => val.match(/^[0-9a-fA-F]{24}$/), {
            message: "Invalid MongoDB ObjectId for productId",
        }),
        title: zod_1.z.string().min(1, "Title is required"),
        description: zod_1.z.string().min(1, "Description is required"),
        rating: zod_1.z
            .number()
            .min(1, "Rating must be at least 1")
            .max(5, "Rating must be at most 5"),
    })
});
exports.reviewValidations = { createReviewSchema: exports.createReviewSchema };
