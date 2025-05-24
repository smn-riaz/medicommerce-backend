"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const product_route_1 = require("../modules/product/product.route");
const auth_route_1 = require("../modules/auth/auth.route");
const payment_route_1 = require("../modules/payment/payment.route");
const order_route_1 = require("../modules/order/order.route");
const review_route_1 = require("../modules/review/review.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/user',
        route: user_route_1.UserRouter,
    },
    {
        path: '/product',
        route: product_route_1.ProductRouter,
    },
    {
        path: '/auth',
        route: auth_route_1.AuthRouter,
    },
    {
        path: '/order',
        route: order_route_1.OrderRouter,
    },
    {
        path: '/payment',
        route: payment_route_1.PaymentRouter,
    },
    {
        path: '/review',
        route: review_route_1.ReviewRouter,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
