import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { UserControllers } from "./user.controller";

const router = Router()


router.post("/create-user", validateRequest(UserValidation.createUserValidation), UserControllers.createUser)

router.get("/", UserControllers.getAllUsers)

router.get("/:id", UserControllers.getSingleUser)

router.delete("/:id", UserControllers.deleteUser)


export const UserRouter = router