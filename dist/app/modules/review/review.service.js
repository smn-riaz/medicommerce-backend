"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../user/user.model");
const review_model_1 = require("./review.model");
const product_model_1 = require("../product/product.model");
const createReviewIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(payload.userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'User not found!');
    }
    const product = yield product_model_1.Product.findById(payload.productId);
    if (!product) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'Product not found!');
    }
    const isReviewExist = yield review_model_1.Review.findOne({
        productId: payload.productId,
        userId: payload.userId
    });
    if (isReviewExist) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "You've already reviewed the medicine!");
    }
    const res = yield review_model_1.Review.create(payload);
    return res;
});
const getAllReviews = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_model_1.Review.find().populate('userId').populate('productId');
    return result;
});
const getSpecificUserAndProductReview = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'User not found!');
    }
    const specificUserProductReview = yield review_model_1.Review.find({
        userId: userId
    }).populate('userId');
    return specificUserProductReview;
});
const getSpecificProductReviews = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.Product.findById(productId);
    if (!product) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'Product not found!');
    }
    const specificUserProductReview = yield review_model_1.Review.find({
        productId: productId,
    }).populate('userId');
    return specificUserProductReview;
});
exports.ReviewServices = { createReviewIntoDB, getSpecificUserAndProductReview, getSpecificProductReviews, getAllReviews };
