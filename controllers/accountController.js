const utilities = require('../utilities/');
const accountModel = require('../models/account-model');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req,res, next){
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

async function buildRegister(req,res, next){
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const {account_firstname, account_lastname, account_email, account_password} = req.body

    //Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch(error){
        req.flash('notice', 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
            errors: null,
            title: 'Registration',
            nav,
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
            'notice',
            `Congratulations, you're registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null
        })
    } else {
        req.flash('notice', 'Sorry, the registration failed')
        res.status(501).render('account/register', {
            title: 'Registration',
            nav,
            errors: null
        })
    }

}

/* ****************************************
*  Process LogIn
* *************************************** */
async function loginAccount(req, res) {
    let nav = await utilities.getNav()
    const {account_email, account_password} = req.body

    let errors = validationResult(req);

    const loginResult = await accountModel.loginAccount(
        account_email,
        account_password
    )


    
    if (loginResult.rowCount){
        console.log(loginResult)
        req.flash(
            'notice',
            `Welcome back, ${loginResult.rows[0].account_firstname}!`
        )
        res.status(201).render("account/login", {
            errors: null,
            title: 'Login',
            nav,
        })
    } else {

        errors.errors.push({
            value: account_email,
            msg: "We couldn't find the account. Try again later.",
            param: 'account_email',
            location: 'body'
        })
        
        res.render('account/login', {
            errors: errors,
            title: 'Login',
            account_email: account_email,
            nav,
        })
    }


}

module.exports = {buildLogin, buildRegister, registerAccount, loginAccount};
