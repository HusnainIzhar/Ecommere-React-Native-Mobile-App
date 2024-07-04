import * as express from 'express';
import { uploadProduct, editProduct, getSingleProduct ,getAllProducts, getProduct, deleteProduct, deleteProductUser } from '../controllers/product.controller';
import { isAuthenticated, isAuthorized } from '../middlewares/auth.middleware';
import { updateAccessToken } from '../controllers/user.controller';

const productRouter = express.Router();

productRouter.post("/add-product",updateAccessToken,isAuthenticated,isAuthorized("Admin"), uploadProduct);
productRouter.put("/edit-product/:id",updateAccessToken,isAuthenticated,isAuthorized("Admin"), editProduct);
productRouter.get("/products", getAllProducts);
productRouter.get("/product/:id", getSingleProduct);
productRouter.get("/get-product",updateAccessToken, isAuthenticated, isAuthorized("Admin"), getProduct);
productRouter.delete("/delete-product/:id",updateAccessToken,isAuthenticated,isAuthorized("Admin"),deleteProduct);
productRouter.delete("/delete-product-user/:id",updateAccessToken, isAuthenticated, deleteProductUser);
export default productRouter;