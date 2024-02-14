import AppError from '../utils/appError';
import { ENVIRONMENT } from './environment';

import mongoose from 'mongoose';

export const initializeDB = async () => {
  try {
    const conn = await mongoose.connect(ENVIRONMENT.DB.URL);
    console.log('MongoDB Connected: ' + conn.connection.host);
  } catch (error) {
    throw new AppError(error as string);
  }
};
