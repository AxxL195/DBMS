import { Router } from "express";
import {all, login, hospital, donor ,verifyHospital, verifiedHospitals} from "../controllers/admin.controllers.js";

const adminRouter=Router();

adminRouter.get('/all', all);//shows all the admin info

adminRouter.post('/login',login);//shows the specific admin info

adminRouter.get('/hospital',hospital);//shows the all hospital details

adminRouter.put('/hospital/verify/:id',verifyHospital);//verifies the hosiptal

adminRouter.get('/donor',donor)//shows all the donors

adminRouter.get('/verifiedhospitals',verifiedHospitals);//shows the verified hospitals

// adminRouter.get('/reports',(req,res)=>{
//     res.send({title:'fetch activity or abuse reports'});
// })


export default adminRouter;