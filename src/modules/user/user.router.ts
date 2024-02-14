import { Router } from 'express';

import {
  httpGetCurrentUser,
  httpUpdateUser,
  httpDeleteUser
} from './user.controllers';
import { protect } from '../../common/middlewares/protect';

const userRouter = Router();

userRouter.use(protect);

userRouter.get('/', httpGetCurrentUser);
userRouter.patch('/update', httpUpdateUser);
userRouter.delete('/delete', httpDeleteUser);

export default userRouter;
