const express = require('express');
const router = express.Router();
const UploadController = require('../crud/upload.js');
const { upload } = require('../middleware/multer.middleware');

const uploadController = new UploadController();

router.post('/upload/:conferencename', upload.single('file'), uploadController.uploadFile.bind(uploadController));

module.exports = router;  