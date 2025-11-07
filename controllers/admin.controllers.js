import pool from "../database/db.js";

export const all = async(req,res)=>{
    try{
        const result = await pool.query("SELECT * FROM admins");
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const login = async(req,res) =>{
    try {
        const { email, password_hash } = req.body; // ideally hash passwords using bcrypt

        const result = await pool.query(
            "SELECT admin_id, username, email, password_hash, created_at FROM admins WHERE email = $1 AND password_hash = $2",
            [email, password_hash]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.json({ message: "Login successful", admin: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
}

export const hospital = async(req,res)=>{
    try{
        const result = await pool.query("SELECT * FROM hospitals");
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
}

export const donor = async(req,res)=>{
    try{
        const result = await pool.query("SELECT * FROM donors");
        res.json(result.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const verifyHospital = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `UPDATE Hospitals 
             SET is_verified = TRUE 
             WHERE hospital_id = $1 
             RETURNING hospital_id, hospital_name, email, is_verified`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Hospital not found" });
        }

        res.json({
            message: "Hospital license verified successfully",
            hospital: result.rows[0],
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const verifiedHospitals = async(req,res) =>{
    try {
        const result = await pool.query(
            `SELECT * FROM Hospitals 
            WHERE is_verified = TRUE`
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
};
