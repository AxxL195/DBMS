import pool from "../database/db.js"

export const signin = async(req,res) =>{
    try{
        const {email,password_hash} = req.body;

        const result=await pool.query("SELECT donor_id, first_name, last_name, email, blood_group, city, state FROM Donors WHERE email = $1 AND password_hash = $2",
            [email, password_hash]
        );

        if(result.rows.length===0)
        {
            return res.status(401).json({message:"invalid credentials"});
        }

        res.json({message:"Login successful",donor :result.rows[0]});
    }catch(error){
        console.error(error.message);
        res.status(500).send("Server Error");
    }
};

