import  HttpStatus  from 'http-status';

import AppError from "../../errors/AppError";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { createToken } from '../auth/auth.utils';
import config from '../../config';

const createUserIntoDB = async(payload:TUser) => {

    const isUserExists = await User.findOne({email:payload.email})

    if(isUserExists){
        throw new AppError(HttpStatus.CONFLICT,'Email is already registered !')
    }

    
    const user = await User.create(payload)

      // create token and send to the client
      const jwtPayload = {
          id:user._id,
          name:user.name,
          email: user.email,
          role:user.role
      }
    
      const accessToken = createToken(jwtPayload, config.jwt_access_secret as string,
          config.jwt_access_expires_in as string
      )
    
    
      const refreshToken = createToken(jwtPayload, config.jwt_refresh_secret as string,
          config.jwt_refresh_expires_in as string
      )

    return {user, accessToken, refreshToken}

}



const getAllUsersFromDB = async(query:Record<string,unknown>) => {
    
    // const userQuery = new QueryBuilder(User.find(
    //     // {isActivated:true}
    // ),query).filter()

    // const result = await userQuery.modelQuery

    const result = await User.find()

    return result
    
}


const getSingleUserFromDB = async(id:string) => {

    const result = await User.findById(id)

    if(!result) {
        throw new AppError(HttpStatus.NOT_FOUND, "There is no User found")
    }
     return result
    
}


const deleteSingleUserFromDB = async(id:string) => {

    const result = await User.findByIdAndDelete(id)

    if(!result) {
        throw new AppError(HttpStatus.NOT_FOUND, "There is no User found")
    }
     return result
    
}


export const UserServices = {createUserIntoDB,deleteSingleUserFromDB, getSingleUserFromDB,  getAllUsersFromDB}