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

    let userId;
    const userResult = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (userResult.rows.length > 0) {
      userId = userResult.rows[0].id;
    } else {
      const newUser = await pool.query(
        "INSERT INTO users (email, password, role) VALUES ($1, $2, 'donor') RETURNING id",
        [email, hashedPassword]
      );
      userId = newUser.rows[0].id;
    }


    // Insert new donor
    const result = await pool.query(
      `INSERT INTO donors (
        first_name, last_name, email, password_hash, phone_number, gender, blood_group,
        date_of_birth, city, state, zip_code, last_donation_date, first_time_donor,
        has_hiv, has_chronic_disease, on_medication, recent_surgery, pregnant_or_breastfeeding,
        emergency_contact, consent, is_available, user_id
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,true,$21
      ) RETURNING *`,
      [
        first_name, last_name, email, hashedPassword, phone_number, gender, blood_group,
        date_of_birth, city, state, zip_code, last_donation_date, first_time_donor,
        has_hiv, has_chronic_disease, on_medication, recent_surgery, pregnant_or_breastfeeding,
        emergency_contact, consent, userId
      ]
    );

    res.status(201).json({ message: "Donor registered successfully", donor: result.rows[0] });
  }catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const profile = async(req, res) => {
  try{
    const donorid= req.user.id;
    const result = await pool.query("SELECT * FROM donors WHERE user_id = $1",[donorid]);

    if(result.rows.length===0){
      return res.status(404).json({message: "donor not found"});
    }
    
    res.json (result.rows[0]);
  }
  catch(err){
    console.error(err.message);
    res.status(500).send("server error");
  }
}

export const getDonationHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const donorResult = await pool.query(
      "SELECT donor_id FROM donors WHERE user_id = $1",
      [userId]
    );

    if (donorResult.rows.length === 0) {
      return res.status(404).json({ message: "Donor not found" });
    }

    const donorId = donorResult.rows[0].donor_id;

    // Fetch donation history
    const result = await pool.query(
      `SELECT * FROM donation_history WHERE donor_id = $1 ORDER BY donation_date DESC`,
      [donorId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No donation history found" });
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const getDonorInfo = async (req, res) => {
  try {
    const userId = req.user.id;

    const donorResult = await pool.query(
      "SELECT * FROM donors WHERE user_id = $1",
      [userId]
    );

    if (donorResult.rows.length === 0) {
      return res.status(404).json({ message: "Donor not found" });
    }

    res.json(donorResult.rows[0]);

  } catch (err) {
    console.error("Error fetching donor info:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateDonorInfo = async (req, res) => {
  try {
    const userId = req.user.id; 

    const {
      first_name,
      last_name,
      gender,
      date_of_birth,
      phone_number,
      email,
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
    } = req.body;

    // Validate inputs
    if (!first_name || !last_name || !phone_number) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Check if donor exists
    const donorResult = await pool.query(
      "SELECT donor_id FROM donors WHERE user_id = $1",
      [userId]
    );

    if (donorResult.rows.length === 0) {
      return res.status(404).json({ message: "Donor not found" });
    }

    const donorId = donorResult.rows[0].donor_id;

    // Update donor
    await pool.query(
      `UPDATE donors 
       SET first_name= $1,
      last_name=$2,
      gender=$3,
      date_of_birth=$4,
      phone_number=$5,
      email=$6,
      blood_group=$7,
      city=$8,
      state=$9,
      zip_code=$10,
      last_donation_date=$11,
      first_time_donor=$12,
      has_hiv=$13,
      has_chronic_disease=$14,
      on_medication=$15,
      recent_surgery=$16,
      pregnant_or_breastfeeding=$17,
      emergency_contact=$18
      WHERE donor_id = $19`,
      [
      first_name,
      last_name,
      gender,
      date_of_birth,
      phone_number,
      email,
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
      donorId
      ]
    );

    res.json({ message: "Donor information updated successfully!" });

  } catch (err) {
    console.error("Error updating donor info:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
