// routes/appointment.routes.js
import { Router } from "express";
import { verifyToken } from "../middlewares/authmiddleware.js";
import {
  createAppointment,
  donorAppointment,
  donorConfirmAppointment,
  hospitalAppointment,
  hospitalUpdateStatus, // renamed handler for clarity
  donorCompleteAppointment // optional alias if you use separate endpoint
} from "../controllers/appointment.controllers.js";

const appointmentRouter = Router();

// --------------------
// Read endpoints
// --------------------
appointmentRouter.get("/hospital", verifyToken, hospitalAppointment); // used by hospital frontend
appointmentRouter.get("/donor", verifyToken, donorAppointment); // used by donor frontend

// --------------------
// Create appointment
// --------------------
appointmentRouter.post("/create", verifyToken, createAppointment); // donor creates appointment

// --------------------
// Hospital updates status (confirm / cancel) - single endpoint
// Body: { action: "confirm" | "cancel" }
// --------------------
appointmentRouter.put("/status/:id", verifyToken, hospitalUpdateStatus);

// --------------------
// Donor confirms/completes donation (after hospital confirms)
// --------------------
appointmentRouter.put("/donor-confirm/:id", verifyToken, donorConfirmAppointment);

// (optional) donor marks donation completed with a different label
appointmentRouter.put("/complete/:id", verifyToken, donorCompleteAppointment);

export default appointmentRouter;
