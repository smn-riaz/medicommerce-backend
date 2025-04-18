import { Router } from "express";
import { PaymentController } from "./payment.controller";

const router = Router()


router.post("/:id", PaymentController.makePayment  )


export const PaymentRouter = router