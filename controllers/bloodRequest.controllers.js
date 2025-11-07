import pool from "../database/db.js";

// ✅ Create a new blood request
export const create = async (req, res) => {
  try {
    const { hospital_id, blood_group_required, quantity_units, reason, is_urgent } = req.body;

    const result = await pool.query(
      `INSERT INTO BloodRequests (hospital_id, blood_group_required, quantity_units, reason, is_urgent)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING request_id, hospital_id, blood_group_required, quantity_units, reason, is_urgent, request_date, is_fulfilled`,
      [hospital_id, blood_group_required, quantity_units, reason, is_urgent]
    );

    res.status(201).json({
      message: "Blood request created successfully",
      request: result.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// ✅ Get all blood requests
export const all = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM BloodRequests ORDER BY request_date DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// ✅ Get a single request by ID
export const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM BloodRequests WHERE request_id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Blood request not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// ✅ Update a request (e.g., mark fulfilled, edit quantity)
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity_units, is_fulfilled } = req.body;

    const result = await pool.query(
      `UPDATE BloodRequests
       SET quantity_units = COALESCE($1, quantity_units),
           is_fulfilled = COALESCE($2, is_fulfilled)
       WHERE request_id = $3
       RETURNING *`,
      [quantity_units, is_fulfilled, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Blood request not found" });
    }

    res.json({
      message: "Blood request updated successfully",
      request: result.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// ✅ Delete a request
export const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("DELETE FROM BloodRequests WHERE request_id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Blood request not found" });
    }

    res.json({ message: "Blood request deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
