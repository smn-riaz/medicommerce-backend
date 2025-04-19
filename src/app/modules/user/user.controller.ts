import { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import HttpStatus from 'http-status';
import { UserServices } from './user.service';

const createUser: RequestHandler = catchAsync(async (req, res) => {
  const { accessToken, refreshToken } = await UserServices.createUserIntoDB(
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'User created successfully',
    data: { accessToken, refreshToken },
  });
});

const getSingleUser: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  const { name, email, _id, role } = await UserServices.getSingleUserFromDB(id);

  const user = { name, email, _id, role };

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'User Retrived successfully',
    data: user,
  });
});

const deleteUser: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  const { name, email, _id, role } =
    await UserServices.deleteSingleUserFromDB(id);

  const user = { name, email, _id, role };

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'User deleted successfully',
    data: user,
  });
});

const getAllUsers: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsersFromDB({});

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Users are retrived successfully',
    data: result,
  });
});

export const UserControllers = {
  createUser,
  getSingleUser,
  deleteUser,
  getAllUsers,
};
