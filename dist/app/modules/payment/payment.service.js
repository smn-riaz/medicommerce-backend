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
exports.PaymentServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sslcommerz_lts_1 = __importDefault(require("sslcommerz-lts"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const order_model_1 = require("../order/order.model");
const makePaymentWithPrescription = (data, paymentInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const sslcz = new sslcommerz_lts_1.default(config_1.default.ssl_store_id, config_1.default.ssl_store_password, config_1.default.ssl_is_live);
    try {
        const order = yield order_model_1.Order.findById(paymentInfo._id);
        if (!order) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Order is not Found');
        }
        const apiResponse = yield sslcz.init(data);
        const GatewayPageURL = apiResponse.GatewayPageURL;
        if (GatewayPageURL) {
            yield order_model_1.Order.findByIdAndUpdate(paymentInfo._id, { paymentStatus: true }, {
                new: true,
                runValidators: true,
            });
            return GatewayPageURL;
        }
        else {
            throw new AppError_1.default(http_status_1.default.BAD_GATEWAY, 'Failed to generate payment gateway URL.');
        }
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'An error occurred while processing payment.');
    }
});
exports.PaymentServices = { makePaymentWithPrescription };
