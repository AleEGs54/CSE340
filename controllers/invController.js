const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildInvManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    classificationSelect,
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
  const vehicleName = `${data.inv_year} ${data.inv_make} ${data.inv_model}`;
  res.render("./inventory/details", {
    title: vehicleName,
    nav,
    view,
  });
};

/* ***************************
 *  Build Edit Vehicle Form
 * ************************** */
invCont.buildEditForm = async function (req, res, next) {
  const inventoryId = parseInt(req.params.inventory_id);
  const details = await invModel.getDetailsById(inventoryId);
  let nav = await utilities.getNav();
  let select = await utilities.buildClassificationList(
    details.classification_id
  );
  res.render("./inventory/edit-inventory", {
    title: `Edit: ${details.inv_make} ${details.inv_model}`,
    nav,
    select,
    errors: null,
    inv_id: details.inv_id,
    inv_make: details.inv_make,
    inv_model: details.inv_model,
    inv_year: details.inv_year,
    inv_description: details.inv_description,
    inv_image: details.inv_image,
    inv_thumbnail: details.inv_thumbnail,
    inv_price: details.inv_price,
    inv_miles: details.inv_miles,
    inv_color: details.inv_color,
    classification_id: details.classification_id,
  });
};

/* ***************************
 *  Build Delete Vehicle Form
 * ************************** */
invCont.buildDeleteForm = async function(req, res, next) {
  const inventoryId = parseInt(req.params.inventory_id);
  const details = await invModel.getDetailsById(inventoryId);
  let nav = await utilities.getNav();
  res.render("./inventory/delete-inventory", {
    title: `Delete: ${details.inv_make} ${details.inv_model}`,
    nav,
    errors: null,
    inv_id: details.inv_id,
    inv_make: details.inv_make,
    inv_model: details.inv_model,
    inv_year: details.inv_year,
    inv_price: details.inv_price,
  });
}

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
  const classificationSelect = await utilities.buildClassificationList();

  if (newClassResult) {
    req.flash(
      "notice",
      `The ${classification_name} Classification was succesfully added.`
    );
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationSelect,
    });
  } else {
    req.flash(
      "notice",
      "Sorry, adding a new classification failed. Try again later."
    );
    res.status(501).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationSelect,
    });
  }
};

/* ***************************
 *  Add Vehicle process
 * ************************** */

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
  let classificationSelect = await utilities.buildClassificationList();

  if (newVehicleResult) {
    req.flash(
      "notice",
      `${inv_make} ${inv_model} has been succesfully added to the inventory`
    );
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationSelect,
    });
  } else {
    req.flash(
      "notice",
      `There has been an error adding a new vehicle. Try again later.`
    );
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationSelect,
    });
  }
};

/* ***************************
 *  Edit Vehicle process
 * ************************** */

invCont.updateInventory = async function (req, res, next) {
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

  const updateResult = await invModel.updateInventory(
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
    inv_id
  );

  let nav = await utilities.getNav();

  if (updateResult) {
    req.flash(
      "notice",
      `${inv_make} ${inv_model} has been succesfully updated`
    );
    res.redirect("/inv/");
  } else {
    let classificationSelect = await utilities.buildClassificationList(
      classification_id
    );

    req.flash(
      "notice",
      `There has been an error adding a new vehicle. Try again later.`
    );
    res.status(201).render("inventory/edit-inventory", {
      title: `Edit: ${inv_make} ${inv_model}`,
      nav,
      classificationSelect,
      errors: null,
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
    });
  }
};

/* ***************************
 *  Delete Vehicle process
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id);
  const data = await invModel.getDetailsById(inv_id)

  const deleteResult = await invModel.deleteInventory(inv_id);

  if (deleteResult) {
    req.flash(
      "notice",
      `${data.inv_make} ${data.inv_model} has been succesfully deleted`
    );
    res.redirect("/inv/");
  } else {
    req.flash(
      "notice",
      `There has been an error deleting the vehicle.`
    );
    res.render('/inv/delete-inventory/' + inv_id)
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

module.exports = invCont;
