const express = require('express');
const router = express.Router();
const FormController = require('../controllers/FormController');


router.post('/', FormController.sendmail);
router.post('/upload_pdf', FormController.upload_pdf);


module.exports = router;
