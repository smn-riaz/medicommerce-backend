import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TProduct } from './product.interface';
import { Product } from './product.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { productSearchableFields } from './product.constant';
import { GoogleGenAI } from "@google/genai";
import config from '../../config';

const createProductIntoDB = async (payload: TProduct) => {
  const result = await Product.create(payload);

  return result;
};


const getSingleProductFromDB = async (id: string) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'No Medicine is  found!');
  }

  const result = await Product.findById(id);

  return result;
};



const getProductsFromDB = async (query: Record<string, unknown>) => {

  const productQuery = new QueryBuilder(Product.find().sort({ createdAt: -1 }), query)
    .search(productSearchableFields)
    .filter()
    .paginate();

  const result = await productQuery.modelQuery;


  const meta = await productQuery.countTotal();


  return {result,meta}
};

const updateProductFromDB = async (id: string, payload: Partial<TProduct>) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'No Medicine is found!');
  }

  const result = await Product.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};



const deleteProductFromDB = async (id: string) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'No Medicine is found!');
  }

  const result = await Product.findByIdAndDelete(id);

  return result;
};


const ai = new GoogleGenAI({ apiKey: config.gemini_api_key });


export const aiSuggestion = async (message: string) => {
  if (!message) throw new Error("No message provided");

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: message,
  });

  return(response.text);

};




export const ProductServices = {
  createProductIntoDB,
  updateProductFromDB,
  getProductsFromDB,
  getSingleProductFromDB,
  deleteProductFromDB,
  aiSuggestion
};
