-- LifeLink Phase 2 Sample Data Inserts
-- Run after creating schema

-- 1️⃣ Donors
INSERT INTO Donors (first_name, last_name, email, password_hash, phone_number, blood_group, date_of_birth, city, state, zip_code, last_donation_date, is_available)
VALUES
('Aarav', 'Sharma', 'aarav.sharma@example.com', 'hash1', '9876543210', 'A+', '1998-03-15', 'Delhi', 'Delhi', '110001', '2025-01-10', TRUE),
('Neha', 'Patel', 'neha.patel@example.com', 'hash2', '9876543211', 'B+', '1995-05-20', 'Ahmedabad', 'Gujarat', '380001', '2024-11-22', TRUE),
('Ravi', 'Verma', 'ravi.verma@example.com', 'hash3', '9876543212', 'O+', '1992-07-18', 'Mumbai', 'Maharashtra', '400001', NULL, TRUE),
('Simran', 'Kaur', 'simran.kaur@example.com', 'hash4', '9876543213', 'AB+', '1997-09-25', 'Amritsar', 'Punjab', '143001', '2025-02-14', TRUE),
('Kabir', 'Singh', 'kabir.singh@example.com', 'hash5', '9876543214', 'A-', '1999-01-02', 'Jaipur', 'Rajasthan', '302001', '2024-12-01', FALSE),
('Priya', 'Iyer', 'priya.iyer@example.com', 'hash6', '9876543215', 'B-', '1996-10-11', 'Chennai', 'Tamil Nadu', '600001', NULL, TRUE),
('Rahul', 'Mehta', 'rahul.mehta@example.com', 'hash7', '9876543216', 'O-', '1993-08-05', 'Pune', 'Maharashtra', '411001', '2024-08-10', TRUE),
('Tanya', 'Rao', 'tanya.rao@example.com', 'hash8', '9876543217', 'A+', '1998-11-28', 'Bengaluru', 'Karnataka', '560001', '2024-10-01', TRUE),
('Arjun', 'Nair', 'arjun.nair@example.com', 'hash9', '9876543218', 'AB-', '1990-12-22', 'Kochi', 'Kerala', '682001', NULL, TRUE),
('Sakshi', 'Gupta', 'sakshi.gupta@example.com', 'hash10', '9876543219', 'B+', '1997-04-12', 'Lucknow', 'Uttar Pradesh', '226001', '2025-03-18', TRUE);

-- 2️⃣ Hospitals
INSERT INTO Hospitals (hospital_name, email, password_hash, phone_number, address, city, state, zip_code)
VALUES
('AIIMS Delhi', 'aiims@example.com', 'hosp1', '01126588500', 'Ansari Nagar', 'Delhi', 'Delhi', '110029'),
('Fortis Hospital', 'fortis@example.com', 'hosp2', '02243330000', 'Mulund West', 'Mumbai', 'Maharashtra', '400080'),
('Apollo Hospital', 'apollo@example.com', 'hosp3', '04428296565', 'Greams Road', 'Chennai', 'Tamil Nadu', '600006'),
('CMC Hospital', 'cmc@example.com', 'hosp4', '04162281000', 'IDA Scudder Road', 'Vellore', 'Tamil Nadu', '632004'),
('Medanta', 'medanta@example.com', 'hosp5', '01244141414', 'Sector 38', 'Gurugram', 'Haryana', '122001'),
('Narayana Health', 'narayana@example.com', 'hosp6', '08071222222', 'Bommasandra', 'Bengaluru', 'Karnataka', '560099'),
('Ruby Hall Clinic', 'rubyhall@example.com', 'hosp7', '02026163391', 'Sassoon Road', 'Pune', 'Maharashtra', '411001'),
('Max Hospital', 'max@example.com', 'hosp8', '01140554055', 'Saket', 'Delhi', 'Delhi', '110017'),
('KIMS Hospital', 'kims@example.com', 'hosp9', '04044885000', 'Minister Road', 'Hyderabad', 'Telangana', '500003'),
('Sanjay Gandhi Hospital', 'sgh@example.com', 'hosp10', '05222315555', 'Rae Bareli Road', 'Lucknow', 'Uttar Pradesh', '226014');

-- 3️⃣ Admins
INSERT INTO Admins (username, email, password_hash)
VALUES
('admin1', 'admin1@lifelink.com', 'adminhash1'),
('admin2', 'admin2@lifelink.com', 'adminhash2'),
('admin3', 'admin3@lifelink.com', 'adminhash3'),
('admin4', 'admin4@lifelink.com', 'adminhash4'),
('admin5', 'admin5@lifelink.com', 'adminhash5'),
('admin6', 'admin6@lifelink.com', 'adminhash6'),
('admin7', 'admin7@lifelink.com', 'adminhash7'),
('admin8', 'admin8@lifelink.com', 'adminhash8'),
('admin9', 'admin9@lifelink.com', 'adminhash9'),
('admin10', 'admin10@lifelink.com', 'adminhash10');

-- 4️⃣ BloodRequests
INSERT INTO BloodRequests (hospital_id, blood_group_required, quantity_units, reason, is_urgent, is_fulfilled)
VALUES
(1, 'A+', 2, 'Accident victim', TRUE, FALSE),
(2, 'O+', 3, 'Surgery', FALSE, FALSE),
(3, 'B+', 1, 'Cancer treatment', TRUE, FALSE),
(4, 'AB-', 4, 'Liver transplant', TRUE, FALSE),
(5, 'A-', 2, 'Emergency case', TRUE, FALSE),
(6, 'O-', 1, 'Childbirth', FALSE, FALSE),
(7, 'B-', 2, 'Anemia patient', FALSE, TRUE),
(8, 'A+', 3, 'Road accident', TRUE, FALSE),
(9, 'AB+', 5, 'Operation', FALSE, FALSE),
(10, 'O+', 2, 'Heart surgery', TRUE, FALSE);

-- 5️⃣ Appointments
INSERT INTO Appointments (donor_id, hospital_id, request_id, appointment_date, status, notes)
VALUES
(1, 1, 1, '2025-10-20 10:00:00', 'Scheduled', 'First-time donor'),
(2, 2, 2, '2025-10-21 11:30:00', 'Completed', 'All good'),
(3, 3, 3, '2025-10-22 09:45:00', 'Pending', 'Awaiting confirmation'),
(4, 4, 4, '2025-10-23 14:00:00', 'Scheduled', 'Donor available'),
(5, 5, 5, '2025-10-24 13:00:00', 'Cancelled', 'Rescheduled'),
(6, 6, 6, '2025-10-25 12:00:00', 'Scheduled', 'Regular donor'),
(7, 7, 7, '2025-10-26 15:15:00', 'Completed', 'Successful donation'),
(8, 8, 8, '2025-10-27 11:00:00', 'Pending', 'Waiting for confirmation'),
(9, 9, 9, '2025-10-28 09:00:00', 'Scheduled', 'First donation this year'),
(10, 10, 10, '2025-10-29 10:45:00', 'Scheduled', 'Morning slot preferred');
