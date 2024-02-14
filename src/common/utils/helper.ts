import { compare, hash } from "bcrypt";
import { randomBytes } from "crypto";
import { ENVIRONMENT } from "../configs/environment";
import jwt from "jsonwebtoken";
import { CookieOptions, Response } from "express";
import { ValidationError, validate } from "class-validator";
import AppError from "./appError";

export const generateRandomString = (): string => {
  return randomBytes(10).toString("hex");
};

export const hashData = async (data: string): Promise<string> => {
  const hashedData = await hash(data, 10);
  return hashedData;
};

export const compareData = async (data: string, hashedData: string) => {
  const isValid = await compare(data, hashedData);
  return isValid;
};

export const signData = (data: object, secret: string, expiresIn: string) => {
  return jwt.sign({ ...data }, secret, {
    expiresIn,
  });
};

export const decodeData = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};

export const setCookie = (
  res: Response,
  name: string,
  value: string,
  options: CookieOptions = {},
) => {
  res.cookie(name, value, {
    httpOnly: true,
    secure: ENVIRONMENT.APP.ENV === "production",
    path: "/",
    sameSite: "none",
    ...options,
  });
};

export const validateEntity = async (dto: any) => {
  const errors = await validate(dto);

  if (errors.length > 0) {
    const errorMap: string[] = [];

    errors.forEach((item) => {
      for (const constraint of Object.values(item.constraints!)) {
        errorMap.push(constraint);
      }
    });

    throw new AppError("Validation error", 400, errorMap);
  }
};
