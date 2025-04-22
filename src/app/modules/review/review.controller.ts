import  HttpStatus  from 'http-status';
import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ReviewServices } from './review.service';

const createReview: RequestHandler = catchAsync(async (req, res) => {

  console.log(req.body);
    
// const result = await ReviewServices.createReviewIntoDB(req.body)
  
//     sendResponse(res, {
//       success: true,
//       statusCode: HttpStatus.OK,
//       message: 'Review is created successfully',
//       data: result
//     });

  });


const getAllReviews: RequestHandler = catchAsync(async (req, res) => {
    
const result = await ReviewServices.getAllReviews()
  
    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Reviews are retrived successfully',
      data: result
    });
  });



  export const ReviewController = {createReview}