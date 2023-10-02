const express = require("express");
const router = express.Router();
const reader = require('xlsx');
const Certificate = require('../confrenceModule/models/announcements');
const multer = require('multer');
const fs = require('fs'); // Import the fs module for file deletion

const modelPaths={
    certificate:"../certificateModule/models/certificate",
    announcement:"../confrenceModule/models/announcements"
}
//const mongooseSchema = mongooseSchemas.

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

router.post('/:objectType', upload.single('csvFile'), (req, res) => {
  const filePath = req.file.path;
  // Reading our excel file
  const file = reader.readFile(filePath)

  let data = []

  const sheetsArray = file.SheetNames; // sheetsArray contains names of all sheets 

  for (let i = 0; i < sheetsArray.length; i++) {
    const sheet = reader.utils.sheet_to_json(
      file.Sheets[sheetsArray[i]])
    sheet.forEach((row) => {
      console.log(row);

      const objectType = req.params.objectType; // Access the :obconst mongooseSchema = require(modelPaths[objectType]);
      const mongooseSchema = require(modelPaths[objectType]);
      const schema = new mongooseSchema(row);
      schema.save();

      data.push(row);
    })
  }

  // Delete the uploaded file after saving data to MongoDB
  fs.unlink(filePath, (err) => { 
    if (err) {
      console.error(err);
      res.status(500).send('Error deleting the file');
    } else {
      res.send('CSV file uploaded, data saved to MongoDB, and file deleted.');
    }
  });
});

module.exports = router;
