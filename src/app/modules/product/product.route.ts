import { Router } from "express";
import { ProductControllers } from "./product.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ProductValidation } from "./product.validation";

const router = Router();

router.post(
  "/create-product",
  validateRequest(ProductValidation.createProductValidation),
  ProductControllers.createProduct
);

router.get(
    "/:id",
    ProductControllers.getSingleProduct
  );
  
router.get("/", ProductControllers.getAllProducts);

router.patch(
  "/:id",
  validateRequest(ProductValidation.updateProductValidation),
  ProductControllers.updateProduct
);



router.delete("/:id", ProductControllers.deleteProduct);

export const ProductRouter = router;
