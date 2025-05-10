import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { reviewValidations } from "./review.validation";
import { ReviewController } from "./review.controller";
import { auth } from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = Router()

router.post('/create-review',
    // auth(USER_ROLE.user),
    validateRequest(reviewValidations.createReviewSchema), ReviewController.createReview)


router.get('/',ReviewController.getAllReviews)

router.get('/:id',ReviewController.getSpecificProductReviews)

router.get('/user-product/:id',ReviewController.getSpecificUserAndProductReview)



export const ReviewRouter = router