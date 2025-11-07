import { Router } from "express";
import {
    all,
    register,
    login,
    verifyLicense,
    getAppointments,
    createAppointment,
    updateDetails,
    cancelAppointment,
    getDonors
} from "../controllers/hospital.controllers.js";

const hospitalRouter = Router();

hospitalRouter.get("/all", all);
hospitalRouter.post("/register", register);
hospitalRouter.post("/login", login);
hospitalRouter.put("/license/verify/:id", verifyLicense);
hospitalRouter.get("/appointment/:hospital_id", getAppointments);
hospitalRouter.post("/appointment", createAppointment);
hospitalRouter.put("/appointment/:id", updateDetails);
hospitalRouter.delete("/appointment/:id", cancelAppointment);
hospitalRouter.get("/donor", getDonors);

export default hospitalRouter;
