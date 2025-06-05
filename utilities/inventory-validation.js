const utilities = require(".");
const { throwError } = require("../controllers/invController");
const accountInventory = require("../models/inventory-model");
const { body, validationResult } = require("express-validator");
const validate = {};

/*  **********************************
 *  New Classification Data Validation Rules
 * ********************************* */

//This middleware catches the errors
validate.newClassificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .isLength({ min: 2 })
      .withMessage("Must be at least 2 characters")
      .isAlphanumeric()
      .withMessage("The Classification name doesn't meet the requirements")
      .custom(async (classification_name) => {
        const nameExists =
          await accountInventory.checkExistingClassificationName(
            classification_name
          );
        if (nameExists) {
          throw new Error("Classification already exists.");
        }
      }),
  ];
};

/*  **********************************
 *  New Inventory Data Validation Rules
 * ********************************* */

validate.newInventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .escape()
      .custom(async (classification_id) => {
        const nameExists = await accountInventory.getDetailsById(
          classification_id
        );

        if (!nameExists) {
          throw new Error("Please choose a valid Classification");
        }
      }),

    body("inv_make")
      .trim()
      .escape()
      .isLength({ min: 3 })
      .withMessage("Make must be at leat 3 characters"),

    body("inv_model")
      .trim()
      .escape()
      .isLength({ min: 3 })
      .withMessage("Model must be at leat 3 characters"),

    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Description can't be empty"),

    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image Path can't be empty"),

    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail Path can't be empty"),

    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Price can't be empty")
      .isNumeric()
      .withMessage("Price MUST be a numeric value!"),

    body("inv_year")
      .trim()
      .escape()
      .isLength({ min: 4, max: 4 })
      .withMessage("Year must be a 4-digit number")
      .isNumeric()
      .withMessage("Year MUST be a numeric value!"),

    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Miles can't be empty")
      .isNumeric()
      .withMessage("Miles MUST be a numeric value!"),

    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Color can't be emty"),
  ];
};

//This middleware gathers the errors, and if there are, dont continue and render the same page with the errors, if not, continue the middleware flow.
validate.checkClassificationName = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    });

    return;
  }

  next();
};

/*  **********************************
 *  New Inventory Data Validation Check
 * ********************************* */

validate.checkInventoryData = async (req, res, next) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body;

  let select = await utilities.buildClassificationList(classification_id);

  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Vehicle",
      nav,
      select,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    });

    return;
  }

  next();
};

/*  **********************************
 *  Update Inventory Data Validation Check
 * ********************************* */

validate.checkUpdateData = async (req, res, next) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    inv_id,
  } = req.body;

  let select = await utilities.buildClassificationList(classification_id);

  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/edit-inventory", {
      errors,
      title: `Edit: ${inv_make} ${inv_model}`,
      nav,
      select,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      inv_id
    });

    return;
  }

  next();
};

module.exports = validate;
