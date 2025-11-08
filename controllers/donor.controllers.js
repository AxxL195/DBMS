import pool from "../database/db.js";
import bcrypt from "bcryptjs";

// Get all donors
export const all = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM donors");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Donor registration
export const register = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      gender,
      date_of_birth,
      phone_number,
      email,
      password,
      blood_group,
      city,
      state,
      zip_code,
      last_donation_date,
      first_time_donor,
      has_hiv,
      has_chronic_disease,
      on_medication,
      recent_surgery,
      pregnant_or_breastfeeding,
      emergency_contact,
      consent
    } = req.body;

    // Check if user already exists
    const existing = await pool.query("SELECT * FROM donors WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Donor already registered with this email" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new donor
    const result = await pool.query(
      `INSERT INTO donors (
        first_name, last_name, email, password_hash, phone_number, gender, blood_group,
        date_of_birth, city, state, zip_code, last_donation_date, first_time_donor,
        has_hiv, has_chronic_disease, on_medication, recent_surgery, pregnant_or_breastfeeding,
        emergency_contact, consent, is_available
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,true
      ) RETURNING *`,
      [
        first_name, last_name, email, hashedPassword, phone_number, gender, blood_group,
        date_of_birth, city, state, zip_code, last_donation_date, first_time_donor,
        has_hiv, has_chronic_disease, on_medication, recent_surgery, pregnant_or_breastfeeding,
        emergency_contact, consent
      ]
    );

    res.status(201).json({ message: "Donor registered successfully", donor: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Donor login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query("SELECT * FROM donors WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const donor = result.rows[0];
    const validPassword = await bcrypt.compare(password, donor.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Login successful", donor });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const 