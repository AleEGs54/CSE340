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
  //update here
  //Make sure the user who wants to edit the content is the same logged in
  utilities.checkLogin,
  utilities.checkUserCredentials,
  utilities.handleErrors(accountController.buildUpdate)
);

router.get(
  "/administration",
  utilities.checkPrivileges(['Admin']),
  utilities.handleErrors(accountController.buildUserAdministration)
);

router.get(
  "/administration/add-account",
  utilities.checkPrivileges(['Admin']),
  utilities.handleErrors(accountController.buildAddAccount)
);

router.get(
  "/administration/getTypes/:type",
  utilities.checkPrivileges(['Admin']),
  utilities.handleErrors(accountController.getAccountsJSON)
);
router.get(
  "/administration/edit/:account_id",
  utilities.checkPrivileges(['Admin']),
  utilities.handleErrors(accountController.buildEditAccount)
);

router.get(
  "/administration/delete/:account_id",
  utilities.checkPrivileges(['Admin']),
  utilities.handleErrors(accountController.buildDeleteAccount)
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

router.post(
  "/administration/add-account",
  utilities.checkPrivileges(['Admin']),
  validate.registrationRules(),
  validate.checkManualRegData,
  utilities.handleErrors(accountController.addAccount)
);

router.post(
  "/administration/edit/account-information",
  utilities.checkPrivileges(['Admin']),
  validate.updateRules(),
  validate.checkEditData,
  utilities.handleErrors(accountController.editAccount)
);

router.post(
  "/administration/edit/password",
  utilities.checkPrivileges(['Admin']),
  validate.updatePasswordRules(),
  validate.checkEditPassword,
  utilities.handleErrors(accountController.editPassword)
);

router.post(
  "/administration/delete",
  utilities.checkPrivileges(['Admin']),
  utilities.handleErrors(accountController.deleteAccount)
);

module.exports = router;
