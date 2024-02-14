import { Request, Response, NextFunction } from "express";
/**
 * Wraps an async function to handle errors.
 *
 * @param {function} fn - The async function to be wrapped.
 * @return {function} - The wrapped function.
 */
type CatchAsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<Response | void>;

export const catchAsync = (fn: CatchAsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
