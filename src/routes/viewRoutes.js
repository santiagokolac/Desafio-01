import { Router } from "express";
import {
  getProductsView,
  getCartView,
} from "../controllers/views.controller.js";

const router = Router();

router.get("/products", getProductsView);
router.get("/carts/:cid", getCartView);

export default router;
