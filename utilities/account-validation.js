const utilities = require(".");
const accountModel = require("../models/account-model");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const validate = {};

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
  return [
    //firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .escape()
      .isEmail()
      .withMessage("A valid email is required")
      .normalizeEmail()
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmailInclusive(
          account_email
        );
        if (emailExists) {
          throw new Error("Email already exists.");
        }
      }),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements"),
  ];
};


validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .escape()
      .isEmail()
      .withMessage("A valid email is required")
      .normalizeEmail(),
  ];
};

validate.updateRules = () => {
  return [
    //firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .escape()
      .isEmail()
      .withMessage("A valid email is required")
      .normalizeEmail()
      .custom(async (new_email, { req }) => {
        const { account_email } = await accountModel.getAccountById(
          req.body.account_id
        );
        console.log(account_email, new_email);
        const emailExists = await accountModel.checkExistingEmailExclusive(
          new_email,
          account_email
        );
        if (emailExists) {
          throw new Error(
            "This email already is used by another user. Try with a different one."
          );
        }
      }),
  ];
};

validate.updatePasswordRules = () => {
  return [
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements")
      .custom(async (password, { req }) => {
        const { account_password } = await accountModel.getAccountById(
          req.body.account_id
        );
        console.log(password, account_password)
        if (await bcrypt.compare(password, account_password)) {
          throw new Error(
            "You can't use the current password as the new password."
          );
        }
      }),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */

//This middleware is set here to divide the code, but this could also be in accountRoute.js because is a middleware. Same with the entire file.
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

validate.checkManualRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_type } = req.body;
  let select = await utilities.buildTypeList(account_type)
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/add-account", {
      errors,
      title: "Add New Accont",
      nav,
      select,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    });
    return;
  }
  next();
};

validate.checkUpdateData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/update", {
      errors,
      title: "Edit Account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

validate.checkUpdatePassword = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } = res.locals.accountData;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/update", {
      errors,
      title: "Edit Account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    });
    return;
  }
  next();
};

validate.checkEditData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_type, account_id } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let select = await utilities.buildTypeList(account_type)
    res.render("account/edit", {
      errors,
      title: "Edit Existing Account",
      nav,
      select,
      account_firstname,
      account_lastname,
      account_email,
      account_type,
      account_id
    });
    return;
  }
  next();
};

validate.checkEditPassword = async (req, res, next) => {
  const accountId = parseInt(req.body.account_id)
  const account_data = await accountModel.getAccountById(accountId)
  const {account_firstname, account_lastname, account_email, account_type } = account_data;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let select = await utilities.buildTypeList(account_type)
    res.render("account/edit", {
      errors,
      title: "Edit Existing Account",
      nav,
      select,
      account_firstname,
      account_lastname,
      account_email,
      account_type,
      account_id: accountId
    });
    return;
  }
  next();
};

module.exports = validate;
