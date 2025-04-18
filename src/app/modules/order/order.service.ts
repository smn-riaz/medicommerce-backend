import SSLCommerz from "sslcommerz-lts"
import  httpStatus  from 'http-status';
import AppError from "../../errors/AppError";
import { Product } from "../product/product.model";
import { User } from "../user/user.model";
import { PaymentData, TOrder } from "./order.interface";
import { Order } from "./order.model";
import { orderStatus, prescriptionReviewStatus, TOrderStatus, TPrescriptionReviewStatus } from './order.constant';
import config from '../../config';
import { sendTestEmail } from "../emailNotification/emailNotification";
// import { sendTestEmail } from "../emailNotification/emailNotification";


const createOrderWithPrescriptionIntoDB = async (payload: TOrder) => {

  const user = await User.findById(payload.userId)
 

  if(!user){
    throw new AppError(httpStatus.NOT_FOUND, "There is no User found")
  }

  if(user.role !== "user"){
    throw new AppError(httpStatus.NOT_FOUND, "Sorry ! Admin can not place order.")
  }

  const productIds = payload.products.map(p => p.productId); 

  const outOfStockProducts = await Product.find({
    _id: { $in: productIds },
    quantity: { $lte: 0 },
  }).select("_id name");

  if (outOfStockProducts.length > 0) {
    const names = outOfStockProducts.map(p => p.name).join(", ");
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Out of stock : ${names}`
    );
  }

  const result = await Order.create(payload);

  return result;
}




export const createOrderPaymentWithoutPrescriptionIntoDB = async (
  payload: TOrder
) => {


  const { totalPrice,name, email, products, shippingInfo,  userId } = payload;


  if (!totalPrice) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Total price is required for payment initialization."
    );
  }

  if (!products || products.length === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "At least one product must be selected."
    );
  }

  if (!shippingInfo || !shippingInfo.shippingAddress || !shippingInfo.shippingCity) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Complete shipping information is required."
    );
  }



  const productName = products.map((product) => product?.name || "Unknown").join("-");

  // Start a session for the transaction
  // const session = await mongoose.startSession();
  // session.startTransaction();

  try {
    // Check user validity
    const user = await User.findById(userId)
    // .session(session);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "There is no user found.");
    }

    if (user.role !== "user") {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Sorry! Only regular users can place orders."
      );
    }

    // Check stock availability and decrement product quantities
    const productIds = products.map((p) => p.productId);
    const productsInStock = await Product.find({
      _id: { $in: productIds },
    })
    // .session(session);

    const outOfStockProducts: string[] = [];

    for (const product of productsInStock) {
      const orderedProduct = products.find((p) => p.productId.toString() === product._id.toString());
      if (orderedProduct && product.quantity < orderedProduct.quantity) {
        outOfStockProducts.push(product.name);
      } else {
        // Decrease product quantity
        product.quantity -= orderedProduct?.quantity || 0;

        // If stock is 0, mark product as out of stock
        if (product.quantity <= 0) {
          product.inStock = false;
        }

        // await product.save({ session });
      }
    }

    if (outOfStockProducts.length > 0) {
      const names = outOfStockProducts.join(", ");
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Out of stock: ${names}`
      );
    }

    // Prepare payment data
    const tran_id = `txn_${Date.now()}`;

    const data: PaymentData = {
      total_amount: totalPrice,
      currency: "BDT",
      tran_id,
      success_url: `${config.ssl_success_url}/?trxId=${tran_id}` as string,
      fail_url: config.ssl_failed_url as string,
      cancel_url: config.ssl_cancel_url as string,
      ipn_url: config.ssl_ipn_url as string,
      shipping_method: "Courier",
      product_name: productName,
      product_category: "Medicine",
      product_profile: "general",
      cus_name: name,
      cus_email: email,
      cus_add1: shippingInfo.shippingAddress,
      cus_add2: "",
      cus_city: shippingInfo.shippingCity,
      cus_state: "",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: "01711111111",
      cus_fax: "01711111111",
      ship_name: name,
      ship_add1: shippingInfo.shippingAddress,
      ship_add2: "",
      ship_city: shippingInfo.shippingCity,
      ship_state: "",
      ship_postcode: 1000,
      ship_country: "Bangladesh",
    };

    // Initialize payment
    const sslcz = new SSLCommerz(
      config.ssl_store_id,
      config.ssl_store_password,
      config.ssl_is_live
    );

    const apiResponse = await sslcz.init(data);

    const GatewayPageURL = apiResponse?.GatewayPageURL;

    if (!GatewayPageURL) {
      console.error("SSLCommerz error:", apiResponse);
      throw new AppError(
        httpStatus.BAD_GATEWAY,
        "Failed to generate payment gateway URL."
      );
    }


   
if(GatewayPageURL){
  await Order.create(
      {
        ...payload,
        paymentStatus: true, 
      },
  )
  return GatewayPageURL;
}

    
    // await session.commitTransaction();

  
    // session.endSession();

  } catch (error) {
    console.error("Error occurred during order processing:", error);
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "An error occurred while processing the order.");
  }
};







const getAllOrderFromDB = async() => {

    const result = await Order.find()

    return result

}





const getUserOrdersFromDB = async (id:string) => {

  const result = await Order.find({userId:id})

  // .populate('product')

  return result;
};





const getSpecificOrderFromDB = async (id: string) => {
  const result = await Order.findById(id)

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'There is no Order found');
  }

  return result;
};






const updateOrderIntoDB = async (id: string, payload: Partial<TOrder>) => {

  const orderInfo = await Order.findById(id);

  const user = await User.findById(orderInfo?.userId)

  if (!orderInfo) {
    throw new AppError(httpStatus.NOT_FOUND, 'There is no order found');
  }


  if(orderInfo.prescription  && (orderInfo.prescriptionReviewStatus !== "ok")){
    throw new AppError(httpStatus.NOT_FOUND, 'Change prescription review status first');
  }


  if(!orderInfo.paymentStatus){
    throw new AppError(httpStatus.NOT_FOUND, 'User has to pay first..');
  }


  const currentStatus = orderInfo.orderStatus;
  const newStatus = payload.orderStatus;

  if (!newStatus || newStatus === currentStatus) {
  
    const result = await Order.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    return result;
  }


  if (currentStatus === orderStatus.CANCELLED) {
    throw new AppError(httpStatus.CONFLICT, 'Order is cancelled. Cannot change status.');
  }

  if (currentStatus === orderStatus.DELIVERED) {
    throw new AppError(httpStatus.CONFLICT, 'Order is already delivered. Cannot change status.');
  }

  const allowedTransitions: Record<string, string[]> = {
    [orderStatus.PENDING]: [orderStatus.SHIPPED, orderStatus.CANCELLED],
    [orderStatus.SHIPPED]: [orderStatus.DELIVERED, orderStatus.CANCELLED],
    [orderStatus.DELIVERED]: [],
    [orderStatus.CANCELLED]: []
  };

  if (!currentStatus || !allowedTransitions[currentStatus]?.includes(newStatus)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Cannot change order status from ${currentStatus} to ${newStatus}`
    );
  }

  const result = await Order.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })

  if(result){
  
      await sendTestEmail(user?.email as string, user?.name as string,payload?.orderStatus as string, "Order status")
    
  }

  return result;
};



const updatePrescriptionReviewIntoDB = async (
  id: string,
  payload: Partial<TOrder>
) => {
  const orderInfo = await Order.findById(id);

  const user = await User.findById(orderInfo?.userId)

  if (!orderInfo) {
    throw new AppError(httpStatus.NOT_FOUND, "There is no order found");
  }

  const currentPrescriptionStatus = orderInfo.prescriptionReviewStatus as TPrescriptionReviewStatus;
  const newPrescriptionStatus = payload.prescriptionReviewStatus as TPrescriptionReviewStatus;

  
  if (!newPrescriptionStatus || newPrescriptionStatus === currentPrescriptionStatus) {
    return await Order.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
  }


  const currentOrderStatus = orderInfo.orderStatus as TOrderStatus;
  if (
    currentOrderStatus === orderStatus.CANCELLED ||
    currentOrderStatus === orderStatus.DELIVERED
  ) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Order is already ${currentOrderStatus}. Cannot change prescription review status.`
    );
  }

  
  const allowedTransitions: Record<TPrescriptionReviewStatus, TPrescriptionReviewStatus[]> = {
    [prescriptionReviewStatus.PENDING]: [
      prescriptionReviewStatus.OK,
      prescriptionReviewStatus.CANCELLED,
    ],
    [prescriptionReviewStatus.OK]: [],
    [prescriptionReviewStatus.CANCELLED]: [],
  };

  if (
    !allowedTransitions[currentPrescriptionStatus]?.includes(newPrescriptionStatus)
  ) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Cannot change prescription review status from ${currentPrescriptionStatus} to ${newPrescriptionStatus}`
    );
  }

  const res = await Order.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if(res){
     await sendTestEmail(user?.email as string, user?.name as string,payload?.prescriptionReviewStatus as string, "Prescription review")
  }


  return res
};



export const OrderServices = { createOrderWithPrescriptionIntoDB,updatePrescriptionReviewIntoDB, createOrderPaymentWithoutPrescriptionIntoDB, getSpecificOrderFromDB,getUserOrdersFromDB,updateOrderIntoDB, getAllOrderFromDB };
