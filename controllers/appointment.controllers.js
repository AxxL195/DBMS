import pool from "../database/db.js";

export const all =async(req,res)=>{
    try{
        const result = await pool.query("SELECT * FROM appointments");
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const id = async(req,res)=>{
    try{
        const {id} = req.params;

        const result = await pool.query(
            `SELECT appointment_id,donor_id,hospital_id,status FROM appointments WHERE appointment_id=$1`,
            [id]
        );

        if(result.rows.length===0){
            return res.status(404).json({message:"Appointment not scheduled"})
        }

        res.status(201).json({message: "Appointment found",
            appointment : result.rows[0]
        })
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const create = async(req,res) =>{
    try{
        const {donor_id, hospital_id, appointment_date} = req.body;

        const result = await pool.query(
        `INSERT INTO Appointments (donor_id, hospital_id, appointment_date)
        VALUES ($1, $2, $3)
        RETURNING appointment_id, donor_id, hospital_id, appointment_date,status`,
        [donor_id, hospital_id, appointment_date]

    );
        res.status(201).json({
        message: "Appointment created successfully",
        appointment: result.rows[0],
        });
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const update = async (req, res) => {
    try {
        const { id } = req.params; // appointment_id from URL
        const { appointment_date, status, notes } = req.body; // optional fields to update

        if (!appointment_date && !status && !notes) {
            return res.status(400).json({ message: "At least one field to update is required" });
        }

        // Update only the provided fields
        const fields = [];
        const values = [];
        let counter = 1;

        if (appointment_date) {
            fields.push(`appointment_date = $${counter}`);
            values.push(appointment_date);
            counter++;
        }
        if (status) {
            fields.push(`status = $${counter}`);
            values.push(status);
            counter++;
        }
        if (notes) {
            fields.push(`notes = $${counter}`);
            values.push(notes);
            counter++;
        }

        values.push(id); // last value is appointment_id
        const query = `UPDATE Appointments SET ${fields.join(", ")} WHERE appointment_id = $${counter} RETURNING *`;

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.json({
            message: "Appointment updated successfully",
            appointment: result.rows[0],
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM Appointments 
             WHERE appointment_id = $1 
             RETURNING appointment_id, donor_id, hospital_id, appointment_date, status`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.json({
            message: "Appointment deleted successfully",
            deleted_appointment: result.rows[0]
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};
