var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', async (req, res) => {
  let data = await Schema.find({})
  res.status(201).json({ data });
});

const Schema = require('../models/schema');

router.post('/create-student', async (req, res) => {
  const studentName = req.body.studentName
  const studentPhone = req.body.studentPhone
  const parentName = req.body.parentName
  const parentPhone = req.body.parentPhone
  const hostelId = req.body.hostelId

  let studentPassword = Math.random().toString(36).slice(2, 10)
  let parentPassword = Math.random().toString(36).slice(2, 10)
  let obj = [{ type: "student", name: studentName, phone: studentPhone, password: studentPassword, hostel: hostelId }, { type: "parent", name: parentName, phone: parentPhone, password: parentPassword, }]
  try {
    // Save both the student and parent to the database
    let users = await Schema.insertMany(obj)
    console.log(users)
    await Schema.findByIdAndUpdate({ _id: hostelId }, { $push: { students: users[0]?._id } })
    let student = await Schema.findByIdAndUpdate({ _id: users[0]?._id }, { parent: users[1]?._id }, { new: true })
    let parent = await Schema.findByIdAndUpdate({ _id: users[1]?._id }, { child: users[0]?._id }, { new: true })
    console.log(student, parent)
    res.status(201).json({ message: 'Student and Parent created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/hostel', async (req, res) => {
  const randomnumber = Math.floor(Math.random() * 1000000);
  const hostelName = req.body.name
  try {
    Schema.create({ name: hostelName, type: 'hostel' })
    res.status(201).json({ message: 'Hostel is created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

router.post('/addStudent', async (req, res) => {
  const hostelId = req.body.id
  try {
    let student = await Schema.find({ number: 1234567892 })
    Schema.findByIdAndUpdate({ _id: hostelId }, { $push: { students: student._id } })
    res.status(201).json({ message: 'Hostel is created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

router.post('/attendance', async (req, res) => {
  let id = req.body.id
  let date = new Date().toLocaleDateString()
  let status = req.body.status
  let data = await Schema.updateOne({ _id: id },
    { $push: { attendance: { date, status } } }, { new: true })
  console.log("DATA-->", data)
  res.send(data);
});


router.get('/attendance', async (req, res) => {
  let id = req.body.id
  let data = await Schema.findById({ _id: id }).select("_id name attendance")
  console.log("DATA-->", data)
  res.send(data);
});

router.get("/studentsByHostel", async (req, res) => {
  let id = req.body.id
  let data = await Schema.findById({ _id: id }).select("_id name students").populate("students", '_id name attendance')
  console.log("DATA-->", data)
  res.send(data);
})

router.get('/studentDetails', async (req, res) => {
  let id = req.query.id
  let data = await Schema.find({ _id: id }).select("-password").populate("hostel parent", "-password")
  console.log("DATA-->", data)
  res.send(data);
});

module.exports = router;
