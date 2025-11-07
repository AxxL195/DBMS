import express from "express";

import { PORT } from "./config/env.js";

import pool from "./database/db.js";

import errorMiddleware from "./middlewares/error.middleware.js";

import adminRouter from "./routes/admin.routes.js";
import donorRouter from "./routes/donor.routes.js";
import hospitalRouter from "./routes/hospital.routes.js";
import appointmentRouter from "./routes/appointment.routes.js";
import bloodRequestRouter from "./routes/bloodRequest.routes.js";
import loginRouter from "./routes/login.routes.js";

const app = express();

app.use(express.json());

app.use('/api/v1/admin',adminRouter);
app.use('/api/v1/donor',donorRouter);
app.use('/api/v1/hospital',hospitalRouter);
app.use('/api/v1/appointment',appointmentRouter);
app.use('/api/v1/bloodrequest',bloodRequestRouter);
app.use('/api/v1/login',loginRouter)

app.use(errorMiddleware);


app.get('/',(req,res) =>{
    res.send("LIFELINK");
})

app.listen(PORT, ()=>{
    console.log(`server listening in http://localhost:${PORT}`);
})

export default app;