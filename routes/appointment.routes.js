import { Router } from "express";
import { all,id, create, update ,deleteAppointment} from "../controllers/appointment.controllers.js";

const appointmentRouter = Router();

appointmentRouter.get('/all',all);//shows all the appointment

appointmentRouter.get('/:id',id);//shows the specific appointment

appointmentRouter.post('/create',create);//create appointment

appointmentRouter.put('/update/:id',update);//updates appointment

appointmentRouter.delete('/delete/:id',deleteAppointment);//deletes appointment


export default appointmentRouter;