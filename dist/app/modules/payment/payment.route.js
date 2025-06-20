"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRouter = void 0;
const express_1 = require("express");
const payment_controller_1 = require("./payment.controller");
const user_constant_1 = require("../user/user.constant");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/:id', (0, auth_1.auth)(user_constant_1.USER_ROLE.user), payment_controller_1.PaymentController.makePayment);
exports.PaymentRouter = router;
