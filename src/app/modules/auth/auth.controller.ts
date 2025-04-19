import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import { RequestHandler } from 'express';
import config from '../../config';

const login: RequestHandler = catchAsync(async (req, res) => {
  const result = await AuthServices.login(req.body);

  const { refreshToken, accessToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.node_dev === 'production',
    httpOnly: true,
  });

  const { name, email, role, _id } = result.user;

  const userInfo = { name, email, role, _id };

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User is logged in successfully',
    data: { userInfo, accessToken, refreshToken },
  });
});

const logOut = catchAsync(async (req, res) => {
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User is logged in successfully',
    data: null,
  });
});

const refreshToken: RequestHandler = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Access token is retrived successfully',
    data: result,
  });
});

export const AuthControllers = { login, logOut, refreshToken };
