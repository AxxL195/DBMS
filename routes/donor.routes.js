import { Router } from "express";
import { all, getDonationHistory, getDonorInfo, profile, register, updateDonorInfo} from "../controllers/donor.controllers.js";
import { verifyToken } from "../middlewares/authmiddleware.js";
const donorRouter = Router();

donorRouter.get('/all',all);

donorRouter.post('/register',register);

donorRouter.get('/profile',verifyToken,profile)

donorRouter.get('/getdonationhistory',verifyToken,getDonationHistory);

donorRouter.get("/me",verifyToken,getDonorInfo);

donorRouter.put("/update",verifyToken,updateDonorInfo);

export default donorRouter;