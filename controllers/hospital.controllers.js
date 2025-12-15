import pool from "../database/db.js";
import bcrypt from "bcrypt";

export const all = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM hospitals");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");  }
};

export const register = async (req, res) => {
    try {
        const {
            hospital_name,
            email,
            password_hash,
            phone_number,
            address,
            city,
            state,
            zip_code
        } = req.body;

        const existing = await pool.query("SELECT * FROM hospitals WHERE email = $1",[email]);
        if(existing.rows.length>0){
            return res.status(400).json({message: "Hospital already registered with this email"});
        }

        const hashedPassword = await bcrypt.hash(password_hash, 10);

        let userId;
        const userResult = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
        if (userResult.rows.length > 0) {
        userId = userResult.rows[0].id;
        } else {
            const newUser = await pool.query(
            "INSERT INTO users (email, password, role) VALUES ($1, $2, 'hospital') RETURNING id",
            [email, hashedPassword]
        );
        userId = newUser.rows[0].id;
        }

        const result = await pool.query(
            `INSERT INTO hospitals (
                hospital_name, email, password_hash, phone_number, address, city, state, zip_code, user_id
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING hospital_id, hospital_name, email, city, state, zip_code, created_at, user_id`,
            [hospital_name, email, hashedPassword, phone_number, address, city, state, zip_code, userId]
        );

        res.status(201).json({
            message: "Hospital registered successfully",
            hospital: result.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({message:"Server error"})
    }};

export const profile = async(req, res) => {
  try{
    const hospitalid= req.user.id;
    const result = await pool.query("SELECT * FROM hospitals WHERE user_id = $1",[hospitalid]);

    if(result.rows.length===0){
      return res.status(404).json({message: "donor not found"});
    }
    
    res.json (result.rows[0]);
  }
  catch(err){
    console.error(err.message);
    res.status(500).json({message:"Server error"})
  }
}

export const getHospitalProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      "SELECT * FROM hospitals WHERE user_id = $1",
      [userId]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Hospital not found" });

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const updateHospital = async (req, res) => {
  const userId = req.user.id;
  const { hospital_name, phone_number, city, password } = req.body;

  try {
    // Update user password if given
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
        hashed,
        userId
      ]);
    }

    // Update hospital details
    await pool.query(
      `UPDATE hospitals SET hospital_name = $1, phone_number = $2, city = $3 
       WHERE user_id = $4`,
      [hospital_name, phone_number, city, userId]
    );

    res.json({ message: "Hospital info updated successfully" });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
