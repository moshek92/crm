//var customersRouter = require('../routes/customers');
//app.use('/customers', customersRouter);
const express = require('express');
const router = express.Router();
const cm = require('../controllers/customers');
//const fileMgmt = require('../shared/fileMgmt');

// http://localhost:3000/customers

//router.get('/home', function (req, res, next) {
// const filePath = fileMgmt.getHtmlFilePath('customers-home.html');
// res.sendFile(filePath);
//});






router.post('/', cm.addCustomer);


module.exports = router;