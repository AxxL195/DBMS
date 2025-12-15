import pool from "../database/db.js";

export const create = async (req, res) => {
  try {
    const {blood_group_required, quantity_units, reason, is_urgent } = req.body;
    const userId= req.user.id;

    const hospitalResult = await pool.query(
      "SELECT hospital_id FROM hospitals WHERE user_id = $1",
      [userId]
    );

    if (hospitalResult.rows.length === 0) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    const hospitalId = hospitalResult.rows[0].hospital_id;

    const result = await pool.query(
      `INSERT INTO BloodRequests (hospital_id, blood_group_required, quantity_units, reason, is_urgent)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING request_id, hospital_id, blood_group_required, quantity_units, reason, is_urgent, request_date, is_fulfilled`,
      [hospitalId, blood_group_required, quantity_units, reason, is_urgent]
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

export const all = async (req, res) => {
  try {
    const userId = req.user.id; 

    const hospitalResult = await pool.query(
      "SELECT hospital_id FROM hospitals WHERE user_id = $1",
      [userId]
    );

    if (hospitalResult.rows.length === 0) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    const hospitalId = hospitalResult.rows[0].hospital_id;

    const result = await pool.query(
      `SELECT * FROM bloodrequests WHERE hospital_id = $1 ORDER BY request_date DESC`,
      [hospitalId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching blood requests:", err.message);
    res.status(500).send("Server error");
  }
};


export const allForDonors = async (req, res) => {
  try {
    // Fetch all blood requests + hospital info
    const result = await pool.query(`
      SELECT 
        br.request_id,
        br.hospital_id,
        h.hospital_name,
        h.city,
        h.state,
        br.blood_group_required,
        br.quantity_units,
        br.reason,
        br.is_urgent,
        br.request_date,
        br.is_fulfilled
      FROM bloodrequests br
      JOIN hospitals h ON br.hospital_id = h.hospital_id
      WHERE br.is_fulfilled = FALSE
      ORDER BY br.request_date DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching donor blood requests:", err.message);
    res.status(500).send("Server error");
  }
};

export const update = async(req,res) => {
  try{
    const userId = req.user.id;
    const requestId= req.params.id;

    const {quantity_units,is_urgent} = req.body;

    const result= await pool.query (
      `SELECT hospital_id FROM hospitals WHERE user_id = $1`,[userId]
    );

    if(result.rows.length===0){
      return res.status(404).json({message: "hospital not found"});
    }

    const updateresult = await  pool.query(
      `UPDATE bloodrequests
       SET quantity_units = $1,
           is_urgent = $2
       WHERE request_id = $3
       RETURNING *`,
      [quantity_units, is_urgent, requestId]
    );

    res.json({
      message: "blood request updated successfully",
      updatedRequest : updateresult.rows[0]
    })
  } catch (err) {
    console.error("Error updating blood request:", err.message);
    res.status(500).send("Server error");
  }
};

export const deleteBloodRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const requestId = req.params.id;

    
    const hospitalResult = await pool.query(
      "SELECT hospital_id FROM hospitals WHERE user_id = $1",
      [userId]
    );

    if (hospitalResult.rows.length === 0) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    const hospitalId = hospitalResult.rows[0].hospital_id;

    
    const requestResult = await pool.query(
      "SELECT * FROM bloodrequests WHERE request_id = $1 AND hospital_id = $2",
      [requestId, hospitalId]
    );

    if (requestResult.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this request" });
    }

    await pool.query("DELETE FROM bloodrequests WHERE request_id = $1", [
      requestId,
    ]);

    res.json({ message: "Blood request deleted successfully!" });
  } catch (err) {
    console.error("Error deleting blood request:", err.message);
    res.status(500).send("Server error");
  }
};