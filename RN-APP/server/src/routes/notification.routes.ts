import * as express from 'express';
import { isAuthenticated, isAuthorized } from '../middlewares/auth.middleware';
import { getNotification, updateNotification } from '../controllers/notification.controller';

const notificationRouter = express.Router();

notificationRouter.get("/get-all-notifications",isAuthenticated,isAuthorized("admin"),getNotification);
notificationRouter.put("/update-notification/:id",isAuthenticated,isAuthorized("admin"),updateNotification);

export default notificationRouter;