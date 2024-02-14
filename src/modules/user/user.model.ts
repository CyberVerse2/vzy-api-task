import { Schema, model } from 'mongoose';
import { IUser } from './user.interface';
import { hashData } from '../../common/utils/helper'

const User = new Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true
    },
    refreshToken: String,
    paymentStatus: {
      type: String,
      enum: ['paid', 'pending'],
      default: 'pending'
    },
    isDeleted: {
      type: Boolean,
      default: false
    },

    password: {
      type: String,
      required: true
    },
    isTermsAndConditionAccepted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

User.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await hashData(user.password!);
  }
  next();
});

const UserModel = model<IUser>('User', User);
export default UserModel;
