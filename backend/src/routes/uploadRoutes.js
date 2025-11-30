const express = require('express');
const multer = require('multer');
const auth = require('../middleware/authMiddleware');
const { uploadImage } = require('../controllers/uploadController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/', auth, upload.single('file'), uploadImage);

module.exports = router;