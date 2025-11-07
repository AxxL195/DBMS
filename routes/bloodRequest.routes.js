import { Router } from "express";
import { all,create, getOne,remove,update } from "../controllers/bloodRequest.controllers.js";

const bloodRequestRouter = Router();

bloodRequestRouter.get('/',all);

bloodRequestRouter.post('/',create);

bloodRequestRouter.get('/:id',getOne);

bloodRequestRouter.put('/update/:id',update);

bloodRequestRouter.delete('/remove/:id',remove)

export default bloodRequestRouter;

