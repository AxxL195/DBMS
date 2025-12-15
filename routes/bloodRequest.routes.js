import { Router } from "express";
import { all,allForDonors,create, deleteBloodRequest, update } from "../controllers/bloodRequest.controllers.js";
import { verifyToken } from "../middlewares/authmiddleware.js";

const bloodRequestRouter = Router();

bloodRequestRouter.get('/all',verifyToken,all);

bloodRequestRouter.post('/create',verifyToken,create);

bloodRequestRouter.get('/allForDonor',verifyToken, allForDonors);

bloodRequestRouter.put('/:id',verifyToken,update);

bloodRequestRouter.delete('/:id',verifyToken,deleteBloodRequest);

export default bloodRequestRouter;

