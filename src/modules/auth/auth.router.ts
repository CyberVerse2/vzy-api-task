import { Router } from "express";

import { httpCreateNewUser, httpLoginUser } from "./auth.controllers";

const authRouter = Router();

authRouter.post("/signup", httpCreateNewUser);
authRouter.post("/login", httpLoginUser);

export default authRouter;
