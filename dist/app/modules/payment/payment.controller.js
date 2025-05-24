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
exports.PaymentController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const payment_service_1 = require("./payment.service");
const config_1 = __importDefault(require("../../config"));
const makePayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { totalPrice, products, shippingInfo, name, email } = req.body;
    const productName = products.map((product) => product.name).join('-');
    const data = {
        total_amount: totalPrice,
        currency: 'BDT',
        tran_id: `txn_${Date.now()}`,
        success_url: `${config_1.default.ssl_success_url}`,
        fail_url: `${config_1.default.ssl_failed_url}`,
        cancel_url: `${config_1.default.ssl_cancel_url}`,
        ipn_url: `${config_1.default.ssl_ipn_url}`,
        shipping_method: 'Courier',
        product_name: productName,
        product_category: 'Medicine',
        product_profile: 'general',
        cus_name: name,
        cus_email: email,
        cus_add1: shippingInfo.shippingAddress,
        cus_add2: '',
        cus_city: shippingInfo.shippingCity,
        cus_state: '',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111',
        cus_fax: '01711111111',
        ship_name: name,
        ship_add1: shippingInfo.shippingAddress,
        ship_add2: '',
        ship_city: shippingInfo.shippingCity,
        ship_state: '',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };
    const result = yield payment_service_1.PaymentServices.makePaymentWithPrescription(data, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Payment process is ongoing...',
        data: result,
    });
}));
exports.PaymentController = { makePayment };
