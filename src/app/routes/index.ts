import { Router } from 'express';
import { UserRouter } from '../modules/user/user.route';
import { ProductRouter } from '../modules/product/product.route';
import { AuthRouter } from '../modules/auth/auth.route';
import { PaymentRouter } from '../modules/payment/payment.route';
import { OrderRouter } from '../modules/order/order.route';

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
