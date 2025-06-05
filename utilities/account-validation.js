const utilities = require('.')
const accountModel = require("../models/account-model")
const { body, validationResult } = require('express-validator')
const validate = {}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
 validate.registrationRules = () => {
    return [
        //firstname is required and must be string
        body('account_firstname')
        .trim()
        .escape()
        .isLength({ min: 1 }).withMessage("Please provide a first name."),

        // lastname is required and must be string
        body('account_lastname')
        .trim()
        .escape()
        .isLength({ min: 2 }).withMessage("Please provide a last name."),

        // valid email is required and cannot already exist in the DB
        body('account_email')
        .trim()
        .escape()
        .isEmail().withMessage('A valid email is required')
        .normalizeEmail()
        .custom(async (account_email) =>{
            const emailExists = await accountModel.checkExistingEmail(account_email)
            if(emailExists){
                throw new Error('Email exists. Please log in or use different email')
            }
        }),

        // password is required and must be strong password
        body('account_password')
        .trim()
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        }).withMessage("Password does not meet requirements"),
    ]
 }

 validate.loginRules = () => {
    return [
        body('account_email')
        .trim()
        .escape()
        .isEmail().withMessage('A valid email is required')
        .normalizeEmail()
    ]
 }

 /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */

 //This middleware is set here to divide the code, but this could also be in accountRoute.js because is a middleware. Same with the entire file.
 validate.checkRegData = async (req,res, next) => {
    const { account_firstname, account_lastname, account_email} = req.body
    let errors = []
    errors = validationResult(req) 
    if(!errors.isEmpty()){
        let nav = await utilities.getNav()
        res.render('account/register', {
            errors,
            title: 'Registration',
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
 }

 validate.checkLoginData = async (req, res, next) =>{
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()){
        let nav = await utilities.getNav()
        res.render('account/login', {
            errors,
            title: 'Login',
            nav,
            account_email,
        })
        return
    }
    next()
 }

 module.exports = validate 