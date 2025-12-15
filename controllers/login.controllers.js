import pool from "../database/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const all= async(req,res) =>{
    try{
        const result = await pool.query(
            `SELECT * FROM users`
        )
        res.json(result.rows);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const register = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        // Allow only valid roles
        if (role !== "donor" && role !== "hospital") {
            return res.status(400).json({ 
                message: "Invalid role. Must be donor or hospital." 
            });
        }

        // CHECK IF USER ALREADY EXISTS
        const exists = await pool.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        );

        if (exists.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *`,
            [email, hashedPassword, role]
        );

        res.status(201).json({
            message: `${role} registered successfully`,
            user: result.rows[0]
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
};


export const login = async (req, res) => {

    const { email, password, role } = req.body;

    try {
        const result = await pool.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Password" });
        }

        // BLOCK WRONG PORTAL LOGIN
        if (user.role !== role) {
            return res.status(403).json({
                message: `Access denied. This portal is only for ${role}s.`
            });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({
            message: "Login Successful",
            token,
            role: user.role
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
};
