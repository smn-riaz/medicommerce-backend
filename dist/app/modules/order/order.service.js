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
exports.OrderServices = exports.createOrderPaymentWithoutPrescriptionIntoDB = void 0;
const sslcommerz_lts_1 = __importDefault(require("sslcommerz-lts"));
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const product_model_1 = require("../product/product.model");
const user_model_1 = require("../user/user.model");
const order_model_1 = require("./order.model");
const order_constant_1 = require("./order.constant");
const config_1 = __importDefault(require("../../config"));
const emailNotification_1 = require("../emailNotification/emailNotification");
const createOrderWithPrescriptionIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(payload.userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'There is no User found');
    }
    if (user.role !== 'user') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Sorry! Admin cannot place an order.');
    }
    const productIds = payload.products.map((p) => p.productId);
    const outOfStockProducts = yield product_model_1.Product.find({
        _id: { $in: productIds },
        quantity: { $lte: 0 },
    }).select('_id name');
    if (outOfStockProducts.length > 0) {
        const names = outOfStockProducts.map((p) => p.name).join(', ');
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Out of stock: ${names}`);
    }
    for (const item of payload.products) {
        const product = yield product_model_1.Product.findById(item.productId);
        if (!product || product.quantity < item.quantity) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Not enough stock for product: ${(product === null || product === void 0 ? void 0 : product.name) || 'Unknown'}`);
        }
    }
    const result = yield order_model_1.Order.create(payload);
    for (const item of payload.products) {
        const product = yield product_model_1.Product.findById(item.productId);
        if (product) {
            product.quantity -= item.quantity;
            yield product.save();
        }
    }
    return result;
});
const createOrderPaymentWithoutPrescriptionIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { totalPrice, name, email, products, shippingInfo, userId } = payload;
    if (!totalPrice) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Total price is required for payment initialization.');
    }
    if (!(products === null || products === void 0 ? void 0 : products.length)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'At least one product must be selected.');
    }
    if (!(shippingInfo === null || shippingInfo === void 0 ? void 0 : shippingInfo.shippingAddress) ||
        !(shippingInfo === null || shippingInfo === void 0 ? void 0 : shippingInfo.shippingCity)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Shipping info is required.');
    }
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found.');
    }
    if (user.role !== 'user') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Only users are allowed to place orders.');
    }
    const productIds = products.map((p) => p.productId);
    const dbProducts = yield product_model_1.Product.find({ _id: { $in: productIds } });
    const outOfStock = [];
    for (const dbProduct of dbProducts) {
        const orderItem = products.find((p) => p.productId.toString() === dbProduct._id.toString());
        if (!orderItem || dbProduct.quantity < orderItem.quantity) {
            outOfStock.push(dbProduct.name);
        }
        else {
            dbProduct.quantity -= orderItem.quantity;
            if (dbProduct.quantity <= 0) {
                dbProduct.inStock = false;
            }
            yield dbProduct.save();
        }
    }
    if (outOfStock.length > 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Out of stock: ${outOfStock.join(', ')}`);
    }
    const tran_id = `txn_${Date.now()}`;
    const productNames = products.map((p) => p.name || 'Unknown').join('-');
    const paymentData = {
        total_amount: totalPrice,
        currency: 'BDT',
        tran_id,
        success_url: config_1.default.ssl_success_url,
        fail_url: config_1.default.ssl_failed_url,
        cancel_url: config_1.default.ssl_cancel_url,
        ipn_url: config_1.default.ssl_ipn_url,
        shipping_method: 'Courier',
        product_name: productNames,
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
    const sslcz = new sslcommerz_lts_1.default(config_1.default.ssl_store_id, config_1.default.ssl_store_password, config_1.default.ssl_is_live);
    const apiResponse = yield sslcz.init(paymentData);
    const gatewayUrl = apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.GatewayPageURL;
    if (!gatewayUrl) {
        console.error('SSLCommerz Error:', apiResponse);
        throw new AppError_1.default(http_status_1.default.BAD_GATEWAY, 'Failed to generate payment gateway URL.');
    }
    yield order_model_1.Order.create(Object.assign(Object.assign({}, payload), { paymentStatus: true }));
    return gatewayUrl;
});
exports.createOrderPaymentWithoutPrescriptionIntoDB = createOrderPaymentWithoutPrescriptionIntoDB;
const getAllOrderFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.find();
    return result;
});
const getUserOrdersFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.find({ userId: id });
    // .populate('product')
    return result;
});
const getSpecificOrderFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.findById(id).populate({
        path: "products.productId",
        model: 'Product'
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'There is no Order found');
    }
    return result;
});
const updateOrderIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const orderInfo = yield order_model_1.Order.findById(id);
    const user = yield user_model_1.User.findById(orderInfo === null || orderInfo === void 0 ? void 0 : orderInfo.userId);
    if (!orderInfo) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'There is no order found');
    }
    if (orderInfo.prescription && orderInfo.prescriptionReviewStatus !== 'ok') {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Change prescription review status first');
    }
    if (!orderInfo.paymentStatus) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User has to pay first..');
    }
    const currentStatus = orderInfo.orderStatus;
    const newStatus = payload.orderStatus;
    if (!newStatus || newStatus === currentStatus) {
        const result = yield order_model_1.Order.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
        });
        return result;
    }
    if (currentStatus === order_constant_1.orderStatus.CANCELLED) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'Order is cancelled. Cannot change status.');
    }
    if (currentStatus === order_constant_1.orderStatus.DELIVERED) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'Order is already delivered. Cannot change status.');
    }
    const allowedTransitions = {
        [order_constant_1.orderStatus.PENDING]: [order_constant_1.orderStatus.SHIPPED, order_constant_1.orderStatus.CANCELLED],
        [order_constant_1.orderStatus.SHIPPED]: [order_constant_1.orderStatus.DELIVERED, order_constant_1.orderStatus.CANCELLED],
        [order_constant_1.orderStatus.DELIVERED]: [],
        [order_constant_1.orderStatus.CANCELLED]: [],
    };
    if (!currentStatus ||
        !((_a = allowedTransitions[currentStatus]) === null || _a === void 0 ? void 0 : _a.includes(newStatus))) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, `Cannot change order status from ${currentStatus} to ${newStatus}`);
    }
    const result = yield order_model_1.Order.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (result) {
        yield (0, emailNotification_1.sendTestEmail)(user === null || user === void 0 ? void 0 : user.email, user === null || user === void 0 ? void 0 : user.name, payload === null || payload === void 0 ? void 0 : payload.orderStatus, 'Order status');
    }
    return result;
});
const updatePrescriptionReviewIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const orderInfo = yield order_model_1.Order.findById(id);
    const user = yield user_model_1.User.findById(orderInfo === null || orderInfo === void 0 ? void 0 : orderInfo.userId);
    if (!orderInfo) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'There is no order found');
    }
    const currentPrescriptionStatus = orderInfo.prescriptionReviewStatus;
    const newPrescriptionStatus = payload.prescriptionReviewStatus;
    if (!newPrescriptionStatus ||
        newPrescriptionStatus === currentPrescriptionStatus) {
        return yield order_model_1.Order.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
        });
    }
    const currentOrderStatus = orderInfo.orderStatus;
    if (currentOrderStatus === order_constant_1.orderStatus.CANCELLED ||
        currentOrderStatus === order_constant_1.orderStatus.DELIVERED) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, `Order is already ${currentOrderStatus}. Cannot change prescription review status.`);
    }
    const allowedTransitions = {
        [order_constant_1.prescriptionReviewStatus.PENDING]: [
            order_constant_1.prescriptionReviewStatus.OK,
            order_constant_1.prescriptionReviewStatus.CANCELLED,
        ],
        [order_constant_1.prescriptionReviewStatus.OK]: [],
        [order_constant_1.prescriptionReviewStatus.CANCELLED]: [],
    };
    if (!((_a = allowedTransitions[currentPrescriptionStatus]) === null || _a === void 0 ? void 0 : _a.includes(newPrescriptionStatus))) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, `Cannot change prescription review status from ${currentPrescriptionStatus} to ${newPrescriptionStatus}`);
    }
    const res = yield order_model_1.Order.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (res) {
        yield (0, emailNotification_1.sendTestEmail)(user === null || user === void 0 ? void 0 : user.email, user === null || user === void 0 ? void 0 : user.name, payload === null || payload === void 0 ? void 0 : payload.prescriptionReviewStatus, 'Prescription review');
    }
    return res;
});
exports.OrderServices = {
    createOrderWithPrescriptionIntoDB,
    updatePrescriptionReviewIntoDB,
    createOrderPaymentWithoutPrescriptionIntoDB: exports.createOrderPaymentWithoutPrescriptionIntoDB,
    getSpecificOrderFromDB,
    getUserOrdersFromDB,
    updateOrderIntoDB,
    getAllOrderFromDB,
};
