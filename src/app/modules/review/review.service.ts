import  HttpStatus  from 'http-status';
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { IReview } from "./review.interface";
import { Review } from "./review.model";
import { Product } from '../product/product.model';

const createReviewIntoDB = async (payload: IReview) => {

  
  
    const user = await User.findById(payload.userId)

    if (!user) {
      throw new AppError(HttpStatus.CONFLICT, 'User not found!');
    }

    const product = await Product.findById(payload.productId)

    if (!product) {
      throw new AppError(HttpStatus.CONFLICT, 'Product not found!');
    }


    const isReviewExist = await Review.findOne({
      productId: payload.productId,
      userId: payload.userId
    });
    
    if (isReviewExist) {
      throw new AppError(HttpStatus.CONFLICT, "You've already reviewed the medicine!");
    }
    


    const res = await Review.create(payload)

    return res
}


const getAllReviews = async () => {

}

export const ReviewServices = {createReviewIntoDB, getAllReviews}