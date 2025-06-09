// Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const validate = require("../utilities/account-validation");

// Route to build inventory by classification view
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
);

router.get(
  "/login",
  utilities.processLogout,
  utilities.handleErrors(accountController.buildLogin)
);

router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdate)
);

//Route to insert new user's data
router.post(
  "/register",
  validate.registrationRules(),
  validate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
  "/login",
  validate.loginRules(),
  validate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

router.post(
  "/update/account-information",
  utilities.checkLogin,
  validate.updateRules(),
  validate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

router.post(
  "/update/password",
  utilities.checkLogin,
  validate.updatePasswordRules(),
  validate.checkUpdatePassword,
  utilities.handleErrors(accountController.updatePassword)
);

module.exports = router;
