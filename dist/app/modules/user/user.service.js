"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("./user.model");
const auth_utils_1 = require("../auth/auth.utils");
const config_1 = __importDefault(require("../../config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const createUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.User.findOne({ email: payload.email });
    if (isUserExists) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'Email is already registered !');
    }
    const user = yield user_model_1.User.create(payload);
    // create token and send to the client
    const jwtPayload = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return { user, accessToken, refreshToken };
});
const getAllUsersFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // const userQuery = new QueryBuilder(User.find(
    //     // {isActivated:true}
    // ),query).filter()
    // const result = await userQuery.modelQuery
    const result = yield user_model_1.User.find();
    return result;
});
const getSingleUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'There is no User found');
    }
    return result;
});
const deleteSingleUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'There is no User found');
    }
    return result;
});
const updateUserIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'There is no User found');
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const updatePasswordIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { prevPassword, newPassword } = payload;
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'There is no User found');
    }
    const isPasswordMached = yield user_model_1.User.isPasswordMached(prevPassword, user.password);
    const hasedNewPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
    if (!isPasswordMached) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Your Previous Password is wrong');
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, { password: hasedNewPassword }, {
        new: true,
        runValidators: true,
    });
    return result;
});
exports.UserServices = {
    createUserIntoDB,
    deleteSingleUserFromDB,
    getSingleUserFromDB,
    getAllUsersFromDB,
    updateUserIntoDB,
    updatePasswordIntoDB
};
