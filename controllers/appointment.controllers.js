import pool from "../database/db.js";
import { sendEmail } from "../utils/email.js";

export const hospitalAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const hospitalResult = await pool.query(
      "SELECT hospital_id, email FROM hospitals WHERE user_id = $1",
      [userId]
    );
    if (hospitalResult.rows.length === 0) {
      return res.status(404).json({ message: "Hospital not found" });
    }
    const hospitalId = hospitalResult.rows[0].hospital_id;

    // join donors and bloodrequests, bring donor info (including name/email)
    const appointments = await pool.query(
      `SELECT 
         a.appointment_id,
         a.appointment_date,
         a.appointment_time,
         a.status,
         d.donor_id,
         d.first_name,
         d.last_name,
         d.email as donor_email,
         d.blood_group,
         br.request_id,
         br.quantity_units,
         br.reason,
         br.is_urgent,
         br.request_date,
         br.is_fulfilled
       FROM appointments a
       JOIN donors d ON a.donor_id = d.donor_id
       JOIN bloodrequests br ON a.blood_request_id = br.request_id
       WHERE a.hospital_id = $1
       ORDER BY a.appointment_date DESC, a.appointment_time ASC`,
      [hospitalId]
    );

    res.json(appointments.rows);
  } catch (err) {
    console.error("Error fetching hospital appointments:", err.message);
    res.status(500).send("Server error");
  }
};


export const donorAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const donorResult = await pool.query(
      "SELECT donor_id, email FROM donors WHERE user_id = $1",
      [userId]
    );
    if (donorResult.rows.length === 0) {
      return res.status(404).json({ message: "Donor not found" });
    }
    const donorId = donorResult.rows[0].donor_id;

    const appointments = await pool.query(
      `SELECT 
         a.appointment_id,
         a.appointment_date,
         a.appointment_time,
         a.status,
         h.hospital_name,
         h.email as hospital_email,
         h.city,
         h.state,
         br.request_id,
         br.quantity_units,
         br.reason,
         br.is_urgent,
         br.request_date,
         br.is_fulfilled
       FROM appointments a
       JOIN hospitals h ON a.hospital_id = h.hospital_id
       JOIN bloodrequests br ON a.blood_request_id = br.request_id
       WHERE a.donor_id = $1
       ORDER BY a.appointment_date DESC, a.appointment_time ASC`,
      [donorId]
    );

    res.json(appointments.rows);
  } catch (err) {
    console.error("Error fetching donor appointments:", err.message);
    res.status(500).send("Server error");
  }
};


export const createAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { blood_request_id, appointment_date, appointment_time } = req.body;

    if (!blood_request_id || !appointment_date || !appointment_time) {
      return res.status(400).json({ message: "All fields are required." });
    }

   
    const donorResult = await pool.query(
      "SELECT donor_id FROM donors WHERE user_id = $1",
      [userId]
    );
    if (donorResult.rows.length === 0) {
      return res.status(404).json({ message: "Donor not found." });
    }
    const donorId = donorResult.rows[0].donor_id;

   
    const requestResult = await pool.query(
      "SELECT hospital_id FROM bloodrequests WHERE request_id = $1",
      [blood_request_id]
    );
    if (requestResult.rows.length === 0) {
      return res.status(404).json({ message: "Blood request not found." });
    }
    const hospitalId = requestResult.rows[0].hospital_id;

    
    const insertResult = await pool.query(
      `INSERT INTO appointments (
         donor_id, hospital_id, blood_request_id, appointment_date, appointment_time, status
       ) VALUES ($1,$2,$3,$4,$5,'scheduled')
       RETURNING *`,
      [donorId, hospitalId, blood_request_id, appointment_date, appointment_time]
    );

    res.status(201).json({
      message: "Appointment successfully created!",
      appointment: insertResult.rows[0],
    });
  } catch (err) {
    console.error("Error creating appointment:", err.message);
    res.status(500).send("Server error");
  }
};



export const hospitalUpdateStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { action } = req.body;

    if (!["confirm", "cancel"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

   
    const hospitalResult = await pool.query(
      "SELECT hospital_id FROM hospitals WHERE user_id = $1",
      [userId]
    );
    if (hospitalResult.rows.length === 0) {
      return res.status(404).json({ message: "Hospital not found" });
    }
    const hospitalId = hospitalResult.rows[0].hospital_id;

   
    const appointmentResult = await pool.query(
      `SELECT a.*, d.email as donor_email, d.first_name as donor_first
       FROM appointments a
       JOIN donors d ON a.donor_id = d.donor_id
       WHERE a.appointment_id = $1 AND a.hospital_id = $2`,
      [id, hospitalId]
    );
    if (appointmentResult.rows.length === 0) {
      return res.status(404).json({ message: "Appointment not found or unauthorized" });
    }

    const appointment = appointmentResult.rows[0];

    let newStatus;
    if (action === "confirm") newStatus = "hospital_confirmed";
    else newStatus = "cancelled";

    await pool.query(
      "UPDATE appointments SET status = $1 WHERE appointment_id = $2",
      [newStatus, id]
    );

    
    const donorEmail = appointment.donor_email;
    if (donorEmail) {
      if (newStatus === "hospital_confirmed") {
        await sendEmail({
          to: donorEmail,
          subject: "Hospital confirmed your donation appointment",
          text: `Hello ${appointment.donor_first || ""},\n\nYour appointment on ${appointment.appointment_date} at ${appointment.appointment_time} has been confirmed by the hospital.\n\nPlease open your donor dashboard to accept/confirm.\n\nThanks.`
        });
      } else if (newStatus === "cancelled") {
        await sendEmail({
          to: donorEmail,
          subject: "Hospital cancelled your appointment",
          text: `Hello,\n\nYour appointment scheduled on ${appointment.appointment_date} at ${appointment.appointment_time} was cancelled by the hospital.\n\nPlease check other requests.\n\nThanks.`
        });
      }
    }

    res.json({ message: `Appointment ${action === "confirm" ? "confirmed" : "cancelled"}` });
  } catch (err) {
    console.error("Update Error:", err.message);
    res.status(500).send("Server error");
  }
};


export const donorConfirmAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // get donor
    const donorResult = await pool.query(
      "SELECT donor_id, email, first_name FROM donors WHERE user_id = $1",
      [userId]
    );
    if (donorResult.rows.length === 0) return res.status(404).json({ message: "Donor not found" });
    const donorId = donorResult.rows[0].donor_id;
    const donorEmail = donorResult.rows[0].email;
    const donorFirst = donorResult.rows[0].first_name;


    const appointmentResult = await pool.query(
      `SELECT a.*, h.email as hospital_email, h.hospital_name
       FROM appointments a
       JOIN hospitals h ON a.hospital_id = h.hospital_id
       WHERE a.appointment_id = $1 AND a.donor_id = $2`,
      [id, donorId]
    );
    if (appointmentResult.rows.length === 0) return res.status(404).json({ message: "Appointment not found" });

    const appointment = appointmentResult.rows[0];

    if (appointment.status !== "hospital_confirmed") {
      return res.status(400).json({ message: "Appointment is not confirmed by hospital yet" });
    }

    await pool.query(
      "UPDATE appointments SET status = $1 WHERE appointment_id = $2",
      ["donor_confirmed", id]
    );

    if (donorEmail) {
      await sendEmail({
        to: donorEmail,
        subject: "Donation confirmed — thank you",
        text: `Hi ${donorFirst || ""},\n\nYou confirmed the donation appointment. Thank you!`
      });
    }

    if (appointment.hospital_email) {
      await sendEmail({
        to: appointment.hospital_email,
        subject: "Donor confirmed donation appointment",
        text: `Hospital,\n\nThe donor has confirmed the appointment scheduled on ${appointment.appointment_date} at ${appointment.appointment_time}.\n\nDonor: ${donorFirst || ""}`
      });
    }

    res.json({ message: "Donation confirmed by donor — emails sent." });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).send("Server error");
  }
};



export const donorCompleteAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const donorResult = await pool.query("SELECT donor_id, email FROM donors WHERE user_id = $1", [userId]);
    if (donorResult.rows.length === 0) return res.status(404).json({ message: "Donor not found" });

    const donorId = donorResult.rows[0].donor_id;
    const donorEmail = donorResult.rows[0].email;

    const appointmentResult = await pool.query(
      `SELECT a.*, h.email as hospital_email
       FROM appointments a
       JOIN hospitals h ON a.hospital_id = h.hospital_id
       WHERE a.appointment_id = $1 AND a.donor_id = $2`,
      [id, donorId]
    );
    if (appointmentResult.rows.length === 0) return res.status(404).json({ message: "Appointment not found" });

    await pool.query("UPDATE appointments SET status = $1 WHERE appointment_id = $2", ["donor_confirmed", id]);

    // send emails
    await sendEmail({
      to: donorEmail,
      subject: "Donation completed — Thank you",
      text: "Thank you for completing the donation."
    });
    if (appointmentResult.rows[0].hospital_email) {
      await sendEmail({
        to: appointmentResult.rows[0].hospital_email,
        subject: "Donor marked donation completed",
        text: "The donor marked the donation as completed."
      });
    }

    res.json({ message: "Donation marked as completed and emails sent." });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).send("Server error");
  }
};
