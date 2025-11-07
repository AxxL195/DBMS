import { Router } from "express";
import { all, register, login}from "../controllers/login.controllers.js";

const loginRouter = Router();

loginRouter.get('/all',all);

loginRouter.post('/login',login);

loginRouter.post('/register',register);


export default loginRouter;