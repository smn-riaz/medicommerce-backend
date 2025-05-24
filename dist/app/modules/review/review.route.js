"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRouter = void 0;
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const review_validation_1 = require("./review.validation");
const review_controller_1 = require("./review.controller");
const router = (0, express_1.Router)();
router.post('/create-review', 
// auth(USER_ROLE.user),
(0, validateRequest_1.default)(review_validation_1.reviewValidations.createReviewSchema), review_controller_1.ReviewController.createReview);
router.get('/', review_controller_1.ReviewController.getAllReviews);
router.get('/:id', review_controller_1.ReviewController.getSpecificProductReviews);
router.get('/user-product/:id', review_controller_1.ReviewController.getSpecificUserAndProductReview);
exports.ReviewRouter = router;
