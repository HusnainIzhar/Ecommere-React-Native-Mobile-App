import * as express from 'express';
import {orderManage,addOrder, getAllOrders} from "../controllers/order.controller";
import { isAuthenticated, isAuthorized } from '../middlewares/auth.middleware';

const ordersRouter = express.Router();

ordersRouter.post("/add-order",isAuthenticated,addOrder);
ordersRouter.get("/orders",isAuthenticated,getAllOrders)
ordersRouter.post("/manage-order",isAuthenticated,orderManage);

export default ordersRouter;
