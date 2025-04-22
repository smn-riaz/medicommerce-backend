import { Router } from 'express';
import { UserRouter } from '../modules/user/user.route';
import { ProductRouter } from '../modules/product/product.route';
import { AuthRouter } from '../modules/auth/auth.route';
import { PaymentRouter } from '../modules/payment/payment.route';
import { OrderRouter } from '../modules/order/order.route';
import { ReviewRouter } from '../modules/review/review.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/user',
    route: UserRouter,
  },
  {
    path: '/product',
    route: ProductRouter,
  },
  {
    path: '/auth',
    route: AuthRouter,
  },
  {
    path: '/order',
    route: OrderRouter,
  },
  {
    path: '/payment',
    route: PaymentRouter,
  },
  {
    path: '/review',
    route: ReviewRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
