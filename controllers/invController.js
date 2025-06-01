const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildInvManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
  });
};

/* ***************************
 *  Build classification form view
 * ************************** */
invCont.buildClassificationForm = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  });
};

/* ***************************
 *  Build inventory form view
 * ************************** */
invCont.buildInvForm = async function (req, res, next) {
  let nav = await utilities.getNav();
  let select = await utilities.buildClassificationList();
  res.render("./inventory/add-inventory", {
    title: "Add Vehicle",
    nav,
    select,
    errors: null,
  });
};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  Build details by id view
 * ************************** */
invCont.buildDetailsById = async function (req, res, next) {
  const invId = req.params.invId;
  const data = await invModel.getDetailsById(invId);
  const view = await utilities.buildDetailsView(data);
  let nav = await utilities.getNav();
  const vehicleName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`;
  res.render("./inventory/details", {
    title: vehicleName,
    nav,
    view,
  });
};

/* ***************************
 *  Build Error view
 * ************************** */
invCont.throwError = async function (req, res, next) {
  throw new Error("Intentional 500 error triggered");
};

/* ***************************
 *  Add Classification process
 * ************************** */

invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body;

  const newClassResult = await invModel.addClassification(classification_name);

  //This way the nav gets the latest update from the db
  let nav = await utilities.getNav();

  if (newClassResult) {
    req.flash(
      "notice",
      `The ${classification_name} Classification was succesfully added.`
    );
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
    });
  } else {
    req.flash(
      "notice",
      "Sorry, adding a new classification failed. Try again later."
    );
    res.status(501).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
    });
  }
};

invCont.addVehicleToInventory = async function (req, res, next) {
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

  const newVehicleResult = await invModel.addVehicleToInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  );

  let nav = await utilities.getNav();

  if (newVehicleResult) {
    req.flash('notice',`${inv_make} ${inv_model} has been succesfully added to the inventory`)
    res.status(201).render('./inventory/management', {
      title: "Vehicle Management",
      nav,
    })
  } else {
    req.flash('notice',`There has been an error adding a new vehicle. Try again later.`)
    res.status(201).render('./inventory/management', {
      title: "Vehicle Management",
      nav,
    })
  }

};

module.exports = invCont;
