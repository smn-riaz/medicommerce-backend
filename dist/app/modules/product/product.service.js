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
exports.ProductServices = exports.aiSuggestion = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const product_model_1 = require("./product.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const product_constant_1 = require("./product.constant");
const genai_1 = require("@google/genai");
const config_1 = __importDefault(require("../../config"));
const ai = new genai_1.GoogleGenAI({ apiKey: config_1.default.gemini_api_key });
const createProductIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_model_1.Product.create(payload);
    return result;
});
const getSingleProductFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.Product.findById(id);
    if (!product) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'No Medicine is  found!');
    }
    const result = yield product_model_1.Product.findById(id);
    return result;
});
const getProductsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const productQuery = new QueryBuilder_1.default(product_model_1.Product.find().sort({ createdAt: -1 }), query)
        .search(product_constant_1.productSearchableFields)
        .filter()
        .paginate();
    const result = yield productQuery.modelQuery;
    const meta = yield productQuery.countTotal();
    return { result, meta };
});
const updateProductFromDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.Product.findById(id);
    if (!product) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'No Medicine is found!');
    }
    const result = yield product_model_1.Product.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteProductFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.Product.findById(id);
    if (!product) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'No Medicine is found!');
    }
    const result = yield product_model_1.Product.findByIdAndDelete(id);
    return result;
});
const aiSuggestion = (message) => __awaiter(void 0, void 0, void 0, function* () {
    if (!message)
        throw new Error("No message provided");
    const response = yield ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: message,
    });
    return response.text;
});
exports.aiSuggestion = aiSuggestion;
exports.ProductServices = {
    createProductIntoDB,
    updateProductFromDB,
    getProductsFromDB,
    getSingleProductFromDB,
    deleteProductFromDB,
    aiSuggestion: exports.aiSuggestion
};
