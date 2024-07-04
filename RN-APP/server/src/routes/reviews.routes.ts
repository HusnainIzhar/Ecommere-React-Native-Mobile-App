import * as express from 'express';
import { addReview,deleteReview } from '../controllers/review.controller';
import { isAuthenticated, isAuthorized } from '../middlewares/auth.middleware';

const reviewsRouter = express.Router();

reviewsRouter.post("/add-review",isAuthenticated,addReview);
reviewsRouter.get("/delete-review/:id",isAuthenticated,deleteReview);

export default reviewsRouter;

