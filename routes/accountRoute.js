// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require('../utilities')
const regValidate = require('../utilities/account-validation')


// Route to build inventory by classification view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));

//Route to insert new user's data
router.post("/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
     utilities.handleErrors(accountController.registerAccount))

module.exports = router;