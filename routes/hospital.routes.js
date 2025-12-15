import { Router } from "express";
import {
    all,
    getHospitalProfile,
    profile,
    register,    
    updateHospital
} from "../controllers/hospital.controllers.js";
import { verifyToken } from "../middlewares/authmiddleware.js";


const hospitalRouter = Router();

hospitalRouter.get("/all", all);
hospitalRouter.post("/register", register);
hospitalRouter.get("/profile",verifyToken,profile);
hospitalRouter.get("/me",verifyToken,getHospitalProfile);
hospitalRouter.put("/update",verifyToken,updateHospital);

export default hospitalRouter;
