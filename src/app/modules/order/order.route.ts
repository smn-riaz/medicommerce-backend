import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { OrderValidationSchema } from "./order.validation";
import { OrderController } from "./order.controller";


const router = Router()


router.post('/create-order-prescription', validateRequest(OrderValidationSchema.createOrderSchema), OrderController.createOrderWithPrescription)



router.post('/create-order-payment', 
    validateRequest(OrderValidationSchema.createOrderSchema),
     OrderController.createOrderPaymentWithoutPrescription)




router.get("/", OrderController.getAllOrder)

router.get('/:orderId', OrderController.getSpecificOrder)

router.patch("/:id",validateRequest(OrderValidationSchema.updateOrderSchema), OrderController.updateOrder)

router.patch("/prescription/:id",validateRequest(OrderValidationSchema.updateOrderSchema), OrderController.updatePrescriptionReview)

router.get('/user-order/:id', OrderController.getUserOrders)

export const OrderRouter = router