const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { throwError } = require("./invController");
const { hash } = require("bcryptjs");
require("dotenv").config();

/* ****************************************
 *  Deliver account management view
 * *************************************** */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/account", {
    title: "Account Management",
    nav,
  });
}

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    accountData: null
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver Update view
 * *************************************** */
async function buildUpdate(req, res, next) {
  const account_id = parseInt(req.params.account_id);
  const data = await accountModel.getAccountById(account_id);
  let nav = await utilities.getNav();

  res.render("account/update", {
    title: "Edit Account",
    nav,
    errors: null,
    account_id: data.account_id,
    account_firstname: data.account_firstname,
    account_lastname: data.account_lastname,
    account_email: data.account_email,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  //Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      errors: null,
      title: "Registration",
      nav,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process LogIn request
 * *************************************** */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const account_data = await accountModel.getAccountByEmail(account_email);
  if (!account_data) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }

  try {
    if (await bcrypt.compare(account_password, account_data.account_password)) {
      delete account_data.account_password;
      const accessToken = jwt.sign(
        account_data,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );

      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }

      return res.redirect("/account/");
    } else {
      req.flash(
        "message notice",
        "Please check your credentials and try again"
      );
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
}

/* ****************************************
 *  Process Account Update
 * *************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email } =
    req.body;

  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  );

  if (!updateResult) {
    req.flash("notice", "Sorry, the registration failed");
    res.status(501).render("account/update", {
      title: "Edit Account",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }

  
  try {
    //Updates the token and res.locals inmediatelly
    const account_data = updateResult.rows[0];
    delete account_data.account_password

    const accessToken = jwt.sign(
      account_data,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 3600 * 1000 }
    );

    res.locals.accountData = account_data;

    if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }

    req.flash("notice", `Your account was succesfully updated.`);
    res.status(201).render("account/account", {
      title: "Account Management",
      nav,
    });


  } catch (error) {
    throw new Error('The updating process was interrupted by an error in the server.')
  }

}

async function updatePassword(req, res, next) {
  let nav = await utilities.getNav()
  const {account_password, account_id} = req.body

  let hashedPassword

  try {
     hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/update", {
      errors: null,
      title: "Edit Account",
      nav,
    });
  }

  const updateResult = accountModel.updatePassword(hashedPassword, account_id)

  if (!updateResult){
    req.flash(
      "notice",
      "An error ocurred updating the password."
    );
    res.status(501).render("account/update", {
      errors: null,
      title: "Edit Account",
      nav,
    });
    return
  }

  req.flash(
      "notice",
      `Your password has been updated succesfully`
    );
    res.status(201).render("account/account", {
      title: "Account Management",
      nav,
      errors: null,
    });


}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagement,
  buildUpdate,
  updateAccount,
  updatePassword
};
