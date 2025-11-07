import { Router } from "express";
import { all, register, login} from "../controllers/donor.controllers.js";
const donorRouter = Router();

donorRouter.get('/all',all);

donorRouter.post('/register',register);

donorRouter.post('/login', login);

export default donorRouter;