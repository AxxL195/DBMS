import pool from "../database/db.js";
import bcrypt from "bcrypt";

export const all = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM hospitals");
        res.json(result.rows);
    }  
     catch (err) {
         console.error(err.message);
        res.status(500).send("Server error");
     }
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

        const hashedPassword = await bcrypt.hash(password_hash, 10);

        const result = await pool.query(
            `INSERT INTO Hospitals (
                hospital_name, email, password_hash, phone_number, address, city, state, zip_code
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING hospital_id, hospital_name, email, city, state, zip_code, created_at`,
            [hospital_name, email, hashedPassword, phone_number, address, city, state, zip_code]
        );

        res.status(201).json({
            message: "Hospital registered successfully",
            hospital: result.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const login = async (req, res) => {
    try {
        const { email, password_hash } = req.body;

        const result = await pool.query(
            `SELECT * FROM Hospitals WHERE email = $1`,
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Hospital not found" });
        }

        const hospital = result.rows[0];
        const isMatch = await bcrypt.compare(password_hash, hospital.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.json({
            message: "Login successful",
            hospital: {
                hospital_id: hospital.hospital_id,
                hospital_name: hospital.hospital_name,
                email: hospital.email,
                city: hospital.city
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const verifyLicense = async (req, res) => {
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

export const getAppointments = async (req, res) => {
    try {
        const { hospital_id } = req.params;

        const result = await pool.query(
            `SELECT * FROM Appointments WHERE hospital_id = $1`,
            [hospital_id]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const createAppointment = async (req, res) => {
    try {
        const { donor_id, hospital_id, appointment_date, notes } = req.body;

        const result = await pool.query(
            `INSERT INTO Appointments (donor_id, hospital_id, appointment_date, notes)
             VALUES ($1, $2, $3, $4)
             RETURNING appointment_id, donor_id, hospital_id, appointment_date, status`,
            [donor_id, hospital_id, appointment_date, notes]
        );

        res.status(201).json({
            message: "Appointment created successfully",
            appointment: result.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const updateDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { phone_number, address, city, state, zip_code } = req.body;

        const result = await pool.query(
            `UPDATE Hospitals 
             SET phone_number = $1, address = $2, city = $3, state = $4, zip_code = $5
             WHERE hospital_id = $6
             RETURNING hospital_id, hospital_name, email, phone_number, address, city, state, zip_code`,
            [phone_number, address, city, state, zip_code, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Hospital not found" });
        }

        res.json({
            message: "Hospital details updated successfully",
            hospital: result.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `UPDATE Appointments 
             SET status = 'Cancelled'
             WHERE appointment_id = $1
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.json({
            message: "Appointment cancelled successfully",
            appointment: result.rows[0],
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const getDonors = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT donor_id, first_name, last_name, email, blood_group, city, state 
             FROM Donors WHERE is_available = TRUE`
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};
